#get tokens by loggin in first

echo ""
curl "http://localhost:3000/api/v1/category" \
-H 'Content-Type: application/json' \
-H 'token: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhZG1pbl9pZCI6MSwiaWF0IjoxNzEzOTY3MzQyLCJleHAiOjE3MTQwNTM3NDJ9.QFqFqPjlX4D4nDfbdEk9As_n9QQbqlM05YG2LeeU0is' \
-X 'POST' \
-d '{"categories": "good, bad, big, small, white, black, up, down, left, right"}'
