#get tokens by loggin in first

echo ""
curl "http://localhost:3000/api/v1/category" \
-H 'Content-Type: application/json' \
-H 'token: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhZG1pbl9pZCI6MSwiaWF0IjoxNzEyODc1NTA0LCJleHAiOjE3MTI5NjE5MDR9.gJ0HXflg_MdMAcZDNiLcMdGI8NiP0WuzIeFF_Cm72sg' \
-X 'POST' \
-d '{"categories": "good, bad"}'
