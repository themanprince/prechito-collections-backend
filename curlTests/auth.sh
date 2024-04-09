#first the registration route
echo ""
echo ""

echo "registration"
curl "http://localhost:3000/api/v1/auth/admin/register" \
-H 'Content-Type: application/json' \
-d '{"email":"prince@gmail.com", "username":"themanprince", "password":"123"}'

echo ""
echo ""

echo "username login first"
#first, username login
curl "http://localhost:3000/api/v1/auth/admin/login" \
-H 'Content-Type: application/json' \
-d '{"username":"themanprince", "password":"123"}' \

echo ""
echo ""

echo "email login next"
#then email login
curl "http://localhost:3000/api/v1/auth/admin/login" \
-H 'Content-Type: application/json' \
-d '{"email":"prince@gmail.com", "password":"123"}'

echo ""
echo ""

echo "wrong password purposefully supplied"
curl "http://localhost:3000/api/v1/auth/admin/login" \
-H 'Content-Type: application/json' \
-d '{"email":"prince@gmail.com", "password":"12hs"}'

echo ""
echo ""

echo "wrong emaik supplied"
curl "http://localhost:3000/api/v1/auth/admin/login" \
-H 'Content-Type: application/json' \
-d '{"email":"princeadigwe@gmail.com", "password":"123"}'
