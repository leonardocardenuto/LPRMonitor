#!/bin/bash

# Just for Linux
# crontab -e
# * * * * * /home/usr/Desktop/LPRMonitor/flask_back/call_wipe.sh >> /home/usr/Desktop/LPRMonitor/flask_back/call_wipe.log 2>&1

# Step 1: Authenticate and get the token
AUTH_RESPONSE=$(curl -s -X POST http://127.0.0.1:5000/auth/login \
    -H "Content-Type: application/json" \
    -d '{"name":"wipe-service","password":"Zj*y.09{/wA9P!`8DIX"}')

# Print full auth response
echo "Auth Response: $AUTH_RESPONSE"

# Extract token from response
TOKEN=$(echo "$AUTH_RESPONSE" | jq -r '.token')

# Check if token was extracted successfully
if [[ "$TOKEN" == "null" || -z "$TOKEN" ]]; then
    echo "Failed to get token. Exiting."
    exit 1
fi

echo "Token: $TOKEN"

# Step 2: Use token to call the wipe endpoint
WIPE_RESPONSE=$(curl -s -X DELETE http://127.0.0.1:5000/identify_car/wipe-expired \
    -H "Authorization: Bearer $TOKEN")

# Print wipe response
echo "Wipe Response: $WIPE_RESPONSE"
