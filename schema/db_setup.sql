START TRANSACTION;

CREATE SCHEMA IF NOT EXISTS pc_admin;
CREATE SCHEMA IF NOT EXISTS pc_product;


DROP TABLE IF EXISTS pc_admin.admin;
DROP TABLE IF EXISTS pc_product.product;
DROP TABLE IF EXISTS pc_product.product_category;
DROP TABLE IF EXISTS pc_product.product_to_category;
DROP TABLE IF EXISTS pc_product.order;
DROP TABLE IF EXISTS pc_product.order_to_product;
/*
	No cart table
	Carts will be handled client-side. Once payout is complete, info will be sent to server
*/

CREATE TABLE pc_admin.admin (
	admin_id SERIAL PRIMARY KEY NOT NULL,
	email VARCHAR(40) NOT NULL, /*for receiving order emails*/
	username VARCHAR(40) NOT NULL,
	password TEXT NOT NULL,
	salt TEXT NOT NULL,
	CONSTRAINT valid_email CHECK (email ~ '.+@.+\.(com|org|edu)')
);

CREATE TABLE pc_product.product (
	product_id SERIAL PRIMARY KEY NOT NULL,
	title VARCHAR(40) NOT NULL,
	description TEXT NOT NULL,
	image_url TEXT NOT NULL,
	price DOUBLE PRECISION NOT NULL,
	quantity_avail INTEGER NOT NULL
);

CREATE TABLE pc_product.product_category (
	product_category_id SERIAL PRIMARY KEY NOT NULL,
	name VARCHAR(40) NOT NULL
);

CREATE TABLE pc_product.product_to_category (
	product_id INTEGER NOT NULL,
	product_category_id INTEGER NOT NULL,
	CONSTRAINT product_id_fk FOREIGN KEY(product_id) REFERENCES pc_product.product(product_id),
	CONSTRAINT product_category_id_fk FOREIGN KEY (product_category_id) REFERENCES pc_product.product_category(product_category_id)
);

/*
	Note below that "amount" column is not
	
	this cus it's obtainable by (product price × quantity) - percent discount
	
	check NEXT TWO tables
*/
CREATE TABLE pc_product.order (
	order_id SERIAL PRIMARY KEY NOT NULL,
	discount DOUBLE PRECISION NOT NULL,
	user_fname VARCHAR(40) NOT NULL,
	user_phone_no VARCHAR(40) NOT NULL,
	user_address TEXT NOT NULL,
	pending BOOLEAN NOT NULL,
	time_stamp TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE pc_product.order_to_product (
	product_id INTEGER NOT NULL,
	order_id INTEGER NOT NULL,
	quantity_purchased INTEGER NOT NULL,
	CONSTRAINT product_id_fk FOREIGN KEY(product_id) REFERENCES pc_product.product(product_id),
	CONSTRAINT order_id_fk FOREIGN KEY (order_id) REFERENCES pc_product.order(order_id)
);