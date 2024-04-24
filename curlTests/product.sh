echo "Pleaze run category.sh test to insert new caegories"
echo "waiting for you to exit if you havent"
sleep 2

token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhZG1pbl9pZCI6MSwiaWF0IjoxNzEzOTU2ODg5LCJleHAiOjE3MTQwNDMyODl9.DvVcIyqUts6ADrr23x3ipTeCKpOT6VboIWl40qOd9g8

echo ""
echo ""
echo "creating a random product"
curl "http://localhost:3000/api/v1/products" -X POST \
-H 'Content-Type: application/json' \
-H "token: Bearer ${token}" \
-d '{"title": "Nike Sneakers", "image_url":"http://test.jpg", "description": "we sneakers(sneekers), but we stepping, not creeping", "price":"1200", "quantity_avail":"2", "category_ids":[1, 2, 3]}'

echo ""
echo ""
echo "getting the product"
curl "http://localhost:3000/api/v1/products/1" -X GET \
-H "token: Bearer ${token}"

echo ""
echo ""
echo "updating product"
curl "http://localhost:3000/api/v1/products/1" -X PUT \
-H 'Content-Type: application/json' \
-H "token: Bearer ${token}" \
-d '{"title": "Nike Sneakers", "image_url":"http://two.jpg", "description": "these sneakers(sneekers) dont creep... for big steppers", "price":"800", "quantity_avail":"1", "category_ids":[1, 3, 6]}'

echo ""
echo ""
echo "deleting the product"
curl "http://localhost:3000/api/v1/products/1" -X DELETE \
-H "token: Bearer ${token}"

echo ""
echo ""

echo "finna do a loop to add 3 pages of products for testing"

function randomNum() {
	#this should give within range of 1-10
	seed=$1
	curr_time_in_secs=$(date '+%S')
	right_most_digit=${curr_time_in_secs:1:1}
	
	result=$((right_most_digit % seed))
	RANDOM_NUM=$((result + 1)) #because of this '+1'
}

page_size=10 #last time I checked
counter=0
while ((counter < (3 * page_size)))
do
	counter=$((counter + 1))
	
	#next set of calls to randomNum() is for the random category ids of this product
	#I currently have 10 categories, so this randomNum() does just fine i.e. 0-9
	randomNum 2 #seed
	randomCategoryId1=$RANDOM_NUM
	randomNum 5 #seed
	randomCategoryId2=$RANDOM_NUM
	randomNum 9 #seed
	randomCategoryId3=$RANDOM_NUM
	
	echo""
	echo "creating product ${counter}"
	echo""
	curl "http://localhost:3000/api/v1/products" -X POST \
	-H 'Content-Type: application/json' \
	-H "token: Bearer ${token}" \
	-d "{\"title\":\"Product-${counter}\", \"description\":\"I am product-${counter}\", \"price\":\"${RANDOM}\", \"quantity_avail\":\"${RANDOM}\", \"image_url\":\"http://random.com/png/img\", \"category_ids\":[$randomCategoryId1, $randomCategoryId2, $randomCategoryId3]}"
done;

echo ""
echo ""
echo "getting first page raw"
curl "http://localhost:3000/api/v1/products?pg=1" -X GET \
-H "token: Bearer ${token}"

#TODO - get by category
echo ""
echo ""
cate="good"
echo "getting 3rd page of category - ${cate}"
curl "http://localhost:3000/api/v1/products?pg=3&category=${cate}" -X GET \
-H "token: Bearer ${token}"

echo ""
echo ""
cate="blessed"
echo "getting page by unexisting category - ${cate}"
curl "http://localhost:3000/api/v1/products?pg=2&category=${cate}" -X GET \
-H "token: Bearer ${token}"


echo ""
echo ""
echo "getting zeroth(unexisting) page raw"
curl "http://localhost:3000/api/v1/products?pg=0" -X GET \
-H "token: Bearer ${token}"
