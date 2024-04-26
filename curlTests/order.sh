echo "Please exit if you havent done the following"
sleep 0.6
echo "1. source login.sh to get auth tokens"
echo "2. source category.sh to create categories"
echo "3. source product.sh to create products and assign em to categories"
echo ""
echo "Please exit if you havent done the dollowing yet"
sleep 0.6

token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhZG1pbl9pZCI6MSwiaWF0IjoxNzE0MTMyMDYyLCJleHAiOjE3MTQyMTg0NjJ9.qKyBBGa0iWOfsnagWYVEuUI1VBNNF7Uk_RN8JOo1dUc

function createOrderWithThreeProducts() {
	user_fname=$1
	user_phone_no=$2
	user_address=$3
	product1_id=$4
	product1_qty=$5
	product2_id=$6
	product2_qty=$7
	product3_id=$8
	product3_qty=$9
	
	encrypted_order=$(node helpers/encrypt.js "{
		\"personal_details\": {
			\"user_fname\": \"${user_fname}\",
			\"user_phone_no\": \"${user_phone_no}\",
			\"user_address\": \"${user_address}\"
		},
		\"products_ordered\": [
			{\"product_id\": \"${product1_id}\", \"quantity_ordered\": \"${product1_qty}\"},
			{\"product_id\": \"${product2_id}\", \"quantity_ordered\": \"${product2_qty}\"},
			{\"product_id\": \"${product3_id}\", \"quantity_ordered\": \"${product3_qty}\"},
		]
	}")
	
	
	curl http://localhost:3000/api/v1/orders \
	-X POST \
	-H 'Content-Type: Application/json' -H "token: Bearer ${token}" \
	-d "{\"encryptedOrder\":\"${encrypted_order}\"}"

}




echo ""
echo ""
echo "First testing creating an order"
createOrderWithThreeProducts "Ewoma" "08037680836" "hospital road, ozoro" 3 4 1 4 5 3


echo ""
echo ""
echo "Next testing getting the order just created.. If I'm righ, its id is 1"
curl http://localhost:3000/api/v1/orders/1 \
-X GET \
-H "token: Bearer ${token}"

function markOrderAsDelivered() {
	order_id=$1
	curl "http://localhost:3000/api/v1/orders/${order_id}?is_order_delivered=true" \
	-X PUT \
	-H "token: Bearer ${token}"
}

echo ""
echo ""
echo "Next testing the PUT /order kini"
markOrderAsDelivered 1

echo ""
echo ""
echo "Next, testing getting all orders"
echo "...gon first create pages of orders"

page_size=10 #last time I checked
order_id=1 #order 1 has already been created
while ((order_id < (3 * page_size)))
do
	order_id=$((order_id + 1))
	
	randomInt1=${RANDOM:1:1}
	randomInt2=${RANDOM:1:1}
	randomInt3=${RANDOM:1:1}
	
	echo""
	echo "creating order ${order_id}"
	createOrderWithThreeProducts "Prince" "07010935636" "Lucas Abraka" randomInt2 randomInt1 randomInt3 randomInt1 randomInt2 randomInt3
	
	if((order_id % 2 == 0)) #so we can have some delivered orders for the testing purposes
	then
		markOrderAsDelivered $order_id
	fi;
done;

echo ""
echo ""
echo "getting first page raw"
curl "http://localhost:3000/api/v1/orders?pg=1" -X GET \
-H "token: Bearer ${token}"

echo ""
echo ""
cate="true"
echo "getting 2nd page of is_order_delivered=${cate}"
curl "http://localhost:3000/api/v1/orders?pg=2&is_order_delivered=${cate}" -X GET \
-H "token: Bearer ${token}"

echo ""
echo ""
cate="false"
echo "getting 2nd page of is_order_delivered=${cate}"
curl "http://localhost:3000/api/v1/orders?pg=2&is_order_delivered=${cate}" -X GET \
-H "token: Bearer ${token}"


echo ""
echo ""
echo "getting zeroth(unexisting) page raw"
curl "http://localhost:3000/api/v1/orders?pg=0" -X GET \
-H "token: Bearer ${token}"

echo ""
echo ""
echo "getting unexistent page"
curl "http://localhost:3000/api/v1/orders?pg=100" -X GET \
-H "token: Bearer ${token}"