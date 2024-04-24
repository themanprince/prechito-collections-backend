#get tokens by loggin in first

echo ""
curl "http://localhost:3000/api/v1/category" \
-H 'Content-Type: application/json' \
-H 'token: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhZG1pbl9pZCI6MSwiaWF0IjoxNzEzOTU2ODg5LCJleHAiOjE3MTQwNDMyODl9.DvVcIyqUts6ADrr23x3ipTeCKpOT6VboIWl40qOd9g8' \
-X 'POST' \
-d '{"categories": "good, bad, big, small, white, black, up, down, left, right"}'
