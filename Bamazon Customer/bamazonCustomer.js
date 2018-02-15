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
    start();
});

var table = new Table({
    head: ['ID', 'Products', 'Department', 'Price', 'Stock','Sales']
    , colWidths: [10, 25, 20, 10, 10,10]
});

function start() {
            var query = "SELECT * FROM products";
            connection.query(query, function (err, res) {
                if (err) throw err;
                for (var i = 0; i < res.length; i++) {
                    var send = [res[i].id, res[i].product_name, res[i].department_name, res[i].price, res[i].stock_quantity, res[i].product_sales]
                    table.push(send);
                    // console.log("ID: " + res[i].id + " || Product: " + res[i].product_name + " || Department: " + res[i].department_name + " || Price: " + res[i].price + " || In Stock: " + res[i].stock_quantity + " || Total Sales: " + res[i].product_sales);
                }
                console.log(table.toString());
                customerPurchase();
            });
        }

function customerPurchase() {
    connection.query("SELECT * FROM products", function(err, res){
        if (err) throw err;

        inquirer
        .prompt([
            {
                name: "id",
                type: "input",
                message: "Please type the ID of the item you would like to purchase"
            },
            {
                name: "quantity",
                type: "input",
                message: "How many would you like to purchase?",
                validate: function (value) {
                    if (isNaN(value) === false) {
                        return true;
                    }
                    return false;
                }
            }
        ])
        .then(function(answer){
            
            // console.dir(res);

            var buyItem;
            for (var i = 0; i < res.length; i++) {
                if (res[i].id == answer.id) {
                    buyItem = res[i];
                }
            }
            
            // console.log(buyItem);
            
            var purchaseTotal = answer.quantity * buyItem.price;
            var qtyMath = buyItem.stock_quantity - answer.quantity;
            var currentSales = purchaseTotal + buyItem.product_sales;

            if (buyItem.stock_quantity > answer.quantity){
                
                connection.query(
                    "UPDATE products SET ?, ? WHERE ?",
                    [
                        {
                            stock_quantity: qtyMath
                        },
                        {
                            product_sales: currentSales
                        },
                        {
                            id: buyItem.id
                        }
                    ],
                    function(error) {
                        if (error) throw err;
                        console.log("Thank you for your purchase\n Your total is $" + purchaseTotal.toFixed(2));
                        connection.end();
                    }
                );
            }
            else {
                console.log("Insufficient quantity!");
                connection.end();
            }
            // console.log(buyItem.stock_quantity);
            // console.log(currentSales);
        })
    })
}