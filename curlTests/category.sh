#get tokens by loggin in first

echo ""
curl "http://localhost:3000/api/v1/category" \
-H 'Content-Type: application/json' \
-H 'token: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhZG1pbl9pZCI6MSwiaWF0IjoxNzEzMDE1NTkxLCJleHAiOjE3MTMxMDE5OTF9.ZnhkV0D_vdkDD0mhIklLFCvB-1sOJr0LNf7nf2m-uKM' \
-X 'POST' \
-d '{"categories": "good, bad, big, small, white, black, up, down, left, right"}'
