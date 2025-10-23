#!/bin/sh

# Replace environment variables in built files
# This allows runtime configuration without rebuilding the image

# Default values
API_URL=${API_URL:-"http://localhost:8000"}
APP_NAME=${APP_NAME:-"E-Shopping Zone"}
RAZORPAY_KEY=${RAZORPAY_KEY:-""}

# Replace placeholders in JavaScript files
find /usr/share/nginx/html -name "*.js" -exec sed -i "s|REACT_APP_API_URL_PLACEHOLDER|$API_URL|g" {} \;
find /usr/share/nginx/html -name "*.js" -exec sed -i "s|REACT_APP_NAME_PLACEHOLDER|$APP_NAME|g" {} \;
find /usr/share/nginx/html -name "*.js" -exec sed -i "s|REACT_APP_RAZORPAY_KEY_PLACEHOLDER|$RAZORPAY_KEY|g" {} \;

# Execute the main command
exec "$@"