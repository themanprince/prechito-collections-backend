#first the registration route
curl "http://localhost:3000/api/v1/auth/admin/register" \
-H 'Content-Type: application/json' \
-d '{"email":"prince@gmail.com", "username":"themanprince", "password":"123"}'