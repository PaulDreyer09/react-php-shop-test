<?php

//All access allowed for testing purposes
//Limit more for main production builds
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: *");
header("Access-Control-Allow-Methods: *");

error_reporting(E_ALL);
ini_set('display_errors', 1);

include_once('DbConnectClass.php');
include_once('ProductModel.php');
include_once('ProductSanitize.php');

$objDb = new DbConnect;
$conn = $objDb->connect();

$method = $_SERVER['REQUEST_METHOD'];

//echo($method);
switch ($method) {
    case "GET":
        // Retrieve all products from the database
        $sql = "SELECT * FROM product";

        // Prepare and execute the SQL query
        $stmt = $conn->prepare($sql);
        $stmt->execute();

        // Initialize an array to hold the product data
        $products = array();

        // Iterate through the query results and create a Product object for each row
        while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
            $product = ProductFactory::createProduct(
                $row['sku'] ,
                $row['name'] ,
                $row['price'] ,
                $row['product_type'] ,
                $row['size'] ,
                $row['height'] ,
                $row['width'] ,
                $row['length'] ,
                $row['weight'] ,
            );

            // Create an object with the product data to return to the client
            $product_data = new stdClass();
            $product_data->sku = $product->getSku();
            $product_data->name = $product->getName();
            $product_data->price = $product->getPrice();
            $product_data->description = $product->getDescription();

            // Add the product data object to the products array
            array_push($products, $product_data);
        }

        // Return the products array as JSON data
        echo json_encode($products);
        break;

    case "POST":
        // Retrieve the product data from the HTTP request body
        $product_inputs = json_decode(file_get_contents('php://input'));

        // Sanitize the product data and validate that all required fields are present
        $product = sanitize((array) $product_inputs, $product_fields);

        try {
            // Insert the product data into the database
            $sql = "INSERT INTO product(sku, name,price, product_type, size, height, width, length, weight) VALUES(:sku, :name, :price, :product_type, :size, :height, :width, :length, :weight)";

            $stmt = $conn->prepare($sql);
            $stmt->bindParam(':sku', $product['sku']);
            $stmt->bindParam(':name', $product['name']);
            $stmt->bindParam(':price', $product['price']);
            $stmt->bindParam(':product_type', $product['product_type']);
            $stmt->bindParam(':size', $product['size']);
            $stmt->bindParam(':height', $product['height']);
            $stmt->bindParam(':width', $product['width']);
            $stmt->bindParam(':length', $product['length']);
            $stmt->bindParam(':weight', $product['weight']);

            // Execute the SQL query and return a success or failure response
            if ($stmt->execute()) {
                $response = ['status' => 1, 'message' => 'Record created successfully.'];
            } else {
                $response = ['status' => 0, 'message' => 'Failed to create record.'];
            }

            echo json_encode($response);
        } catch (PDOException $e) {
            // If a PDO exception is caught, check if the error code is for a duplicate entry
            if ($e->getCode() === '23000') {
                // If the error code is for a duplicate entry, return an error message with status code 409
                $response = ['status' => 409, 'message' => 'Duplicate SKU supplied.'];
                http_response_code(409);
                echo json_encode($response);
            } else {
                // If the error code is not for a duplicate entry, return a generic error message
                $response = ['status' => 0, 'message' => 'Failed to create record.'];
                http_response_code(500);
                echo json_encode($response);
            }
        }
        break;

        // Method not implemented yet
    case "PUT":
        echo ('PUT not implemented yet');
        break;

    case "DELETE":
        //Sanitize input
        $product_sku = filter_input(INPUT_GET, 'sku', FILTER_SANITIZE_FULL_SPECIAL_CHARS);

        if (!$product_sku) {
            //Invalid input message
            $response = ['status' => 0, 'message' => 'Invalid product ID: ' . $product_sku];
            echo json_encode($response);
            exit;
        }

        //Create SQL query to delete product by SKU
        $sql = "DELETE FROM product WHERE sku=:sku";
        $stmt = $conn->prepare($sql);
        $stmt->bindParam(':sku', $product_sku);

        if ($stmt->execute()) {
            //Success message
            $response = ['status' => 1, 'message' => 'Record deleted successfully.'];
        } else {
            //Failure message
            $response = ['status' => 0, 'message' => 'Failed to delete record.'];
        }

        echo json_encode($response);
        break;
}

?>