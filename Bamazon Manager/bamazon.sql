DROP DATABASE IF EXISTS bamazon;
CREATE DATABASE bamazon;

USE bamazon;

CREATE TABLE products(
    id INT NOT NULL AUTO_INCREMENT,
    product_name VARCHAR(45) NOT NULL,
    department_name VARCHAR(45) NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    stock_quantity INT default 0,
    PRIMARY KEY (id)
);

CREATE TABLE departments(
    department_id INT NOT NULL AUTO_INCREMENT,
    department_name VARCHAR(45) NOT NULL,
    over_head_costs DECIMAL(10,2) NOT NULL,
    PRIMARY KEY (department_id)
);

-- adding department info
INSERT INTO departments SELECT department_name FROM products;

-- updating each department over head
update departments set over_head_costs = 80
WHERE department_name = "Health";

update departments set over_head_costs = 550
WHERE department_name = "Electronics";

update departments set over_head_costs = 200
WHERE department_name = "Games";

update departments set over_head_costs = 120
WHERE department_name = "Books";

-- all product db info
INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("Apple iPad", "Electronics", 279.99, 41), ("Old Man Logan", "Books", 9.99, 21),  ("Vitamin C 500mg", "Health",7.49, 321), ("Call of Duty:WWII", "Games", 59.99, 103), ("Samsung Gear S3", "Electronics",198.97, 36), ("Airborne", "Health", 18.58, 487), ("Flash Point", "Books", 11.98, 68), ("Tekken 7", "Games", 37.98, 43), ("Farcry 5", "Games", 59.99, 135), ("Syntha-6", "Health", 44.99, 56);

-- test queries low inventory
UPDATE products set stock_quantity = 4 where product_name = "Flash Point";

SELECT id,product_name, stock_quantity FROM products WHERE stock_quantity < '5';

-- add product sales to products
ALTER TABLE products
ADD product_sales DECIMAL(10,2) default 0.00;

-- add sales to departments
INSERT INTO departments
SELECT product_sales
FROM products;
-- add profit to departments
ALTER TABLE departments
ADD total_profit DECIMAL(10,2) default 0.00;