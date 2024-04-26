echo "Please exit if you havent done the following"
sleep 0.6
echo "1. source login.sh to get auth tokens"
echo "2. source category.sh to create categories"
echo "3. source product.sh to create products and assign em to categories"
echo ""
echo "Please exit if you havent done the dollowing yet"
sleep 0.6

token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhZG1pbl9pZCI6MSwiaWF0IjoxNzE0MTMyMDYyLCJleHAiOjE3MTQyMTg0NjJ9.qKyBBGa0iWOfsnagWYVEuUI1VBNNF7Uk_RN8JOo1dUc

encrypted_order=$(node helpers/encrypt.js '{
	"personal_details": {
		"user_fname": "Ewoma",
		"user_phone_no": "08037680836",
		"user_address": "hospital road, ozoro"
	},
	"products_ordered": [
		{"product_id": "4", "quantity_ordered": "2"},
		{"product_id": "2", "quantity_ordered": "3"}
	]
}')


echo ""
echo ""
echo "First testing creating an order"
curl http://localhost:3000/api/v1/orders \
-X POST \
-H 'Content-Type: Application/json' -H "token: Bearer ${token}" \
-d "{\"encryptedOrder\":\"${encrypted_order}\"}"

echo ""
echo ""
echo "Next testing getting the order just created.. If I'm righ, its id is 1"
curl http://localhost:3000/api/v1/orders/1 \
-X GET \
-H "token: Bearer ${token}"

echo ""
echo ""
echo "Next testing the PUT /order kini"
curl "http://localhost:3000/api/v1/orders/1?is_paid_for=true&is_order_delivered=true" \
-X PUT \
-H "token: Bearer ${token}"