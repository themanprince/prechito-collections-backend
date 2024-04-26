#get tokens by loggin in first

echo ""
curl "http://localhost:3000/api/v1/category" \
-H 'Content-Type: application/json' \
-H 'token: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhZG1pbl9pZCI6MSwiaWF0IjoxNzE0MDkyNTM3LCJleHAiOjE3MTQxNzg5Mzd9.CMxDUrzm2VSD8gJ8k0oAG3hDRwnM0JWOSO0RT3tUKbQ' \
-X 'POST' \
-d '{"categories": "good, bad, big, small, white, black, up, down, left, right"}'
