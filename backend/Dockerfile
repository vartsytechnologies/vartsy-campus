ARG PYTHON_VERSION=3.12.3
FROM python:${PYTHON_VERSION}-slim

ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

WORKDIR /app

# Install deps
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt
# Create non-root user
# Create user
RUN adduser --disabled-password --gecos "" appuser

# Copy app
COPY . .

# Create static dir + fix ownership
RUN mkdir -p /app/staticfiles \
    && chown -R appuser:appuser /app

USER appuser

EXPOSE 8000

# Run the application.
ENTRYPOINT ["bash", "/app/scripts/start.sh"]
