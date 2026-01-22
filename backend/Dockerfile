ARG PYTHON_VERSION=3.12.3
FROM python:${PYTHON_VERSION}-slim

ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

WORKDIR /app

# Install bash (required for entrypoint scripts)
RUN apt-get update \
    && apt-get install -y bash curl \
    && rm -rf /var/lib/apt/lists/*

# Install deps
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Create non-root user
RUN adduser --disabled-password --gecos "" appuser

# Copy app
COPY . .

# Static dir + permissions
RUN mkdir -p /app/staticfiles \
    && chown -R appuser:appuser /app

USER appuser

EXPOSE 8000

# Default command (API), override per service
CMD ["/app/scripts/start_api.sh"]
