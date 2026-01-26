// refresh route to refresh auth tkn for 402
async function authRefresh(url, options = {}) {
  const opts = {
    ...options,
    credentials: "include",
    headers: {
      ...options.headers,
    },
  };

  const response = await fetch(url, opts);

  if (response.status !== 401) {
    return response;
  }

  const refreshResponse = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_API}/auth/refresh/`,
    {
      method: "POST",
      credentials: "include",
    },
  );

  if (!refreshResponse.ok) {
    throw new Error("Token refresh failed");
  }

  const newRequest = await fetch(url, {
    ...options,
    credentials: "include",
    headers: {
      ...options.headers,
    },
  });

  return newRequest;
}

export default authRefresh;
