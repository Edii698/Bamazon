var mysql = require("mysql");
var inquirer = require("inquirer");
var Table = require('cli-table');

// database connection
var connection = mysql.createConnection({
    host: "localhost",
    port: 3306,

    user: "root",

    password: "root",
    database: "bamazon"
});

// connect to the mysql server and sql database
connection.connect(function (err) {
    if (err) throw err;
    // run the start function after the connection is made to prompt the user
    hello();
});

var table = new Table({
    head: ['ID', 'Products', 'Department', 'Price', 'stock']
  , colWidths: [10, 25,20,10,10]
});


function currentStock() {
            var query = "SELECT * FROM products";
            connection.query(query, function (err, res) {
                if (err) throw err;
                for (var i = 0; i < res.length; i++) {
                    var send = [res[i].id,res[i].product_name,res[i].department_name, res[i].price, res[i].stock_quantity]
                    table.push(send);
                    // console.log("ID: " + res[i].id + " || Product: " + res[i].product_name + " || Department: " + res[i].department_name + " || Price: " + res[i].price + " || In Stock: " + res[i].stock_quantity);
                }
                console.log(table.toString());
                hello();
            });
        }

function hello() {
    inquirer
        .prompt({
            name: "managerList",
            type: "rawlist",
            message: "What would you like to do?",
            choices: ["View Products for Sale", "View Low Inventory", "Add to Inventory", "Add a New Product", "Exit"]
        })
        .then(function (answer) {
        //    console.log("this on! :" + answer);
           
            switch (answer.managerList) {
                case "View Products for Sale":
                    return currentStock();
                    break;
                case "View Low Inventory":
                    return lowInventory();
                    break;
                case "Add to Inventory":
                    return addToInventory();
                    break;
                case "Add a New Product":
                    return addProduct();
                    break;
                case "Exit":
                    return connection.end();
                    break;
            }
        });
        
}

function lowInventory() {
    var query = "SELECT id,product_name, stock_quantity FROM products WHERE stock_quantity < '5'";
    connection.query(query, function(err,res){
        for (var i = 0; i < res.length; i++) {
            console.log("ID: " + res[i].id + " ||   PRODUCT: " + res[i].product_name + " ||   DEPARTMENT: " + res[i].department_name + " ||   PRICE: " + res[i].price + " ||   IN STOCK: " + res[i].stock_quantity);
        }
        hello();
    })
}

function addToInventory() {
    connection.query("SELECT * FROM products", function (err, results) {
    if (err) throw err;
    inquirer
        .prompt([
            {
                name: "id",
                type: "input",
                message: "Please type the ID of the item you would like to increase"
            },
            {
                name: "quantity",
                type: "input",
                message: "Quantity to add to inventory?",
                validate: function (value) {
                    if (isNaN(value) === false) {
                        return true;
                    }
                    return false;
                }
            }
        ])
            .then(function (answer) {
            // console.log(answer);
            var itemId;

            for (var i = 0; i < results.length; i++) {
                if (results[i].id == answer.id) {
                    itemId = results[i];
                } 
            }
            // console.log("updat :" + itemId);
            var qtyMath = parseInt(itemId.stock_quantity) + parseInt(answer.quantity);

                connection.query( "UPDATE products SET ? WHERE ?",
                    [
                        {
                            stock_quantity: qtyMath
                        },
                        {
                            id: itemId.id
                        }
                    ],
                    function (error) {
                        if (error) throw err;
                        console.log("The inventory has been updated:\n" + currentStock());
                        hello();
                    } 
            )
            
            })
    })
}

function addProduct() {
    connection.query("SELECT * FROM products", function (err, results) {
        if (err) throw err;
        inquirer
            .prompt([
                {
                    name: "product",
                    type: "input",
                    message: "Enter product name"
                },
                {
                    name: "department",
                    type: "input",
                    message: "Enter department name"
                },
                {
                    name: "price",
                    type: "input",
                    message: "Enter price",
                    validate: function (value) {
                        if (isNaN(value) === false) {
                            return true;
                        }
                        return false;
                    }
                },
                {
                    name: "quantity",
                    type: "input",
                    message: "Enter quantity in inventory",
                    validate: function (value) {
                        if (isNaN(value) === false) {
                            return true;
                        }
                        return false;
                    }
                }
            ])
            .then(function (answer) {

                connection.query("INSERT INTO products SET ?",
                {
                    product_name: answer.product,
                    department_name: answer.department,
                    price: answer.price,
                    stock_quantity: answer.quantity
                }
                    ,
                    function (error, res) {
                        if (error) throw err;
                        console.log("New product has been added:\n");
                        console.log("Product: " + answer.product + " || Department: " + answer.department + " || Price: " + answer.price + " || In Stock: " + answer.quantity);
                        
                        hello();
                    }
                )

            })
    })
}