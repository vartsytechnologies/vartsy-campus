ARG PYTHON_VERSION=3.12.3
FROM python:${PYTHON_VERSION}-slim

ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

WORKDIR /app

# System dependencies for psycopg2, Pillow, etc.
RUN apt-get update \
    && apt-get install -y --no-install-recommends \
       build-essential \
       libpq-dev \
       libjpeg-dev \
       zlib1g-dev \
    && rm -rf /var/lib/apt/lists/*

# Install Python dependencies
COPY requirements.txt ./
RUN pip install --no-cache-dir -r requirements.txt

# Create non-root user
RUN adduser --disabled-password --gecos "" appuser

# Copy application code
COPY . .

# Create static directory and fix ownership
RUN mkdir -p /app/staticfiles \
    && chown -R appuser:appuser /app

USER appuser

EXPOSE 8000

# Use a small bash-based entrypoint to normalize scripts (line endings,
# permissions) before executing the requested command. Platforms like Render
# can still override the CMD to choose a different start script.
ENTRYPOINT ["bash", "/app/scripts/entrypoint.sh"]
CMD ["/app/scripts/start_api.sh"]
