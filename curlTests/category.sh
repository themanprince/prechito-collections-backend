#get tokens by loggin in first

token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhZG1pbl9pZCI6MSwiaWF0IjoxNzE0MjIzNDMzLCJleHAiOjE3MTQzMDk4MzN9.VWyWuI-k9jRuKcmPqNlxAovnzmPiKtj1jAz5jCkOdd4

echo ""
curl "http://localhost:3000/api/v1/category" \
-H 'Content-Type: application/json' \
-H "token: Bearer $token" \
-X 'POST' \
-d '{"categories": "good, bad, big, small, white, black, up, down, left, right"}'
