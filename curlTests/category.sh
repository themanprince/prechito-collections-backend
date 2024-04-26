#get tokens by loggin in first

echo ""
curl "http://localhost:3000/api/v1/category" \
-H 'Content-Type: application/json' \
-H 'token: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhZG1pbl9pZCI6MSwiaWF0IjoxNzE0MTMyMDYyLCJleHAiOjE3MTQyMTg0NjJ9.qKyBBGa0iWOfsnagWYVEuUI1VBNNF7Uk_RN8JOo1dUc' \
-X 'POST' \
-d '{"categories": "good, bad, big, small, white, black, up, down, left, right"}'
