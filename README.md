# Flash Sales Application

This is a simple Flash Sales Express.js and MongoDB application. This guide will help you set up and run the application either using Docker or directly on your local machine without Docker.

## Prerequisites

Before starting, ensure you have the following installed:

- [Node.js](https://nodejs.org/en/download) (version 22 or higher)
- [pnpm](https://pnpm.io/) (version 7.0.0 or higher)
- [MongoDB](https://docs.mongodb.com/manual/installation/) (version 4.2 or higher)

## Running the Application with Docker

#### 1. Ensure [Docker](https://www.docker.com/) is installed and running on your machine.

```sh
docker -v
```

#### 2. Clone the Repository and Change directory

Clone this repository to your local machine:
```sh
git clone https://github.com/ugbewijc/flash-sale-system.git
cd flash-sale-system
```
### 3. Set Up Environment Variables

Rename .env.example file to .env or create a `.env`file in the root of the project and add the environment variables values:

#### 4. Run the following command to start the development environment:
   ```sh
   docker-compose up --build
   ```
<br/>

## Running the Application Without Docker

#### 1. Clone the Repository and Change directory
Clone this repository to your local machine:
```sh
git clone https://github.com/ugbewijc/flash-sale-system.git
cd flash-sale-system
```


#### 2. Install Dependencies
Install the required packages
```sh
pnpm install
```

#### 3. Set Up Environment Variables

Rename .env.example file to .env or create a `.env`file in the root of the project and add the environment variables values:

#### 4. Run the following command to start the development environment:
   ```sh
   pnpm dev
   ```


## API Endpoints
**Note:** 

All request and response content type should be JSON

All successful response have the structure below, with valid status code 
attached
   ```json
   {
      "success": true,
      "data": <Object>, //Requested records
   }
```
All Fail Request have the structure below, with valid status code attached
   ```json
   {
      "success": false,
      "errors": <Array>, //Array of Error Messages
   }
```

### General Endpoints

---

- **Login** - *POST /api/login*
   
   ---
   
      Logs in Users(customers/admins) into the application     
   
   ---

     **Request Header**

        Content Type : application/json
    **Request Body**
    ```json
    {
      "username": "example@domain.com",
      "password": "password"
    }
    ```
   **Parameters**
   <table style="margin-left: 40px;">
      <tr><th>Parameters</th>           <th>Value</th>      <th>Data Type</th></tr>
      <tr><td>username</td>   <td>required</td>       <td>string</td></tr>
      <tr><td>password</td>        <td>required</td>       <td>string</td></tr>
   </table>

   <br/>

   **Note**
   
      After successful authentication, users are redirected to their respective dashboard after setting session cookies
   
   <br/>
   
   ---

<br/>

- **Logout** - *GET /api/logout*

   Log out users(customer/admin) out of the application

<br/>

---

### Admin Endpoints
---

- **Register Admin** - *POST /api/register*
   
   ---
      Register a new admin account
   
   ---
   **Request Header**

        Content Type : application/json
    
   **Request Body**
   ```json
   {
      "name":"admin_name",
      "username": "admin@domain.com",
      "password": "password",
      "role": "admin"
   }
   ```
   **Parameters**
   <table style="margin-left: 40px;">
      <tr><th>Parameters</th>           <th>Value</th>      <th>Data Type</th></tr>
      <tr><td>name</td>   <td>required</td>       <td>string</td></tr>
      <tr><td>username</td>   <td>required</td>       <td>string</td></tr>
      <tr><td>password</td>        <td>required</td>       <td>string</td></tr>
      <tr><td>role</td>        <td>required</td>       <td>string</td></tr>
   </table>

   <br/>

   **NOTE**

      Admin are requested to login after successful registration
   <br/>
---

<br/>

- **Admin Dashboard** - *GET /api/admin*
   
   **Request Header**

      Content-Type : application/json
      Cookies: session_cookies
     
   <br/>

---

<br/>

- **Retrieve All Products** - *GET /api/admin/products*
   
   ---
      Retrieve product details for all registered product. Product details includes; product id, name, price, quantity, sold quantity, Max Ordered Quantity,and sales start time
   
   ---
   **Request Header**

      Content-Type : application/json
      Cookies: session_cookies
     
   <br/>

---
   <br/>

- **Retrieve Product** - *GET /api/admin/products/:product_name*
   
   ---
      Retrieve single product details. Product details includes; product id, name, price, quantity, sold quantity, Max Ordered Quantity and sales start time
   ---
   **Path Parameter**
   
      :product_name

   **Request Header**

      Content-Type : application/json
      Cookies: session_cookies
    
   **Request Body**
   ```json
   {
      "id":"product_id"
   }
   ```
   **Parameters**
   <table style="margin-left: 40px;">
      <tr><th>Parameters</th>           <th>Value</th>      <th>Data Type</th></tr>
      <tr><td>id</td>   <td>required</td>       <td>string</td></tr>
   </table>

   <br/>
---
<br/>

- **Add Product** - *POST /api/admin/products*
   
   ---
      Adds a new product
   ---
   **Request Header**

        Content-Type : application/json
        Cookies: session_cookies
    
   **Request Body**
   ```json
   {
      "name": "product_name",
      "price": "20.32",
      "quantity": "190", // min: 0, max: 200
      "start_time": "2025-02-04T21:25:05.483Z", // UTC
      "moq": "5" //default: 5, min: 0, max: 200
   }
   ```
   **Parameters**
   <table style="margin-left: 40px;">
      <tr><th>Parameters</th>           <th>Value</th>      <th>Data Type</th></tr>
      <tr><td>name</td>   <td>required</td>       <td>String</td></tr>
      <tr><td>price</td>   <td>required</td>       <td>Float</td></tr>
      <tr><td>quantity</td>   <td>required</td>       <td>Number</td></tr>
      <tr><td>start_time</td>   <td>required</td>       <td>DateTime</td></tr>
      <tr><td>moq</td>   <td>optional</td>       <td>Number</td></tr>
   </table>
   <br/>
---
<br/>

- **Update Product** - *POST /api/admin/products*
   
   ---
      Update an existing product 
   ---
   **Request Header**

        Content-Type : application/json
        Cookies: session_cookies
    
   **Request Body**
   ```json
   {
      "name": "product_name",
      "price": "20.32",
      "quantity": "190", // min: 0, max: 200
      "start_time": "2025-02-04T21:25:05.483Z", // UTC
      "moq": "5", //default: 5, min: 0, max: 200
   }
   ```
   **Parameters**
   <table style="margin-left: 40px;">
      <tr><th>Parameters</th>           <th>Value</th>      <th>Data Type</th></tr>
      <tr><td>name</td>   <td>required</td>       <td>String</td></tr>
      <tr><td>price</td>   <td>required</td>       <td>Float</td></tr>
      <tr><td>quantity</td>   <td>required</td>       <td>Number</td></tr>
      <tr><td>start_time</td>   <td>required</td>       <td>DateTime</td></tr>
      <tr><td>moq</td>   <td>optional</td>       <td>Number</td></tr>
   </table>
   <br/>

---
### Leaderboard Endpoints
---


- **Leaderboard Dashboard** - *Get /api/leaderboard*
   
   ---
      Retrieve list of all users who successfully purchased the product, sorted in chronological order based on purchase time.   
   ---
   **Request Header**

      Content-Type : application/json
      Cookies: session_cookies
     
   <br/>
- **Customer Records** - *POST /api/leaderboard/customer*
   
   ---
      Retrieve list of all products purchased by a user, sorted in chronological order based on purchase time.  
   ---
   **Request Header**

        Content-Type : application/json
        Cookies: session_cookies
    
   **Request Body**
   ```json
   {
      "id": "user_id"
   }
   ```
   **Parameters**
   <table style="margin-left: 40px;">
      <tr><th>Parameters</th>           <th>Value</th>      <th>Data Type</th></tr>
      <tr><td>id</td>   <td>required</td>       <td>String</td></tr>
   </table>
   <br/>
- **Product Records** - *POST /api/dashboard/products*
   
   ---
      Retrieve list of all sakes details of a product, sorted in chronological order based on purchase time. 
   ---
   **Request Header**
   
        Content-Type : application/json
        Cookies: session_cookies
    
   **Request Body**
   ```json
   {
      "id": "product_id"
   }
   ```
   **Parameters**
   <table style="margin-left: 40px;">
      <tr><th>Parameters</th>           <th>Value</th>      <th>Data Type</th></tr>
      <tr><td>id</td>   <td>required</td>       <td>String</td></tr>
   </table>
   <br/>

---
### Customer Endpoints
---
- **Customer Dashboard** - *Get /api/dashboard*

   ---
  
   **Request Header**

      Content-Type : application/json
      Cookies: session_cookies
     
   <br/>

- **Register Customer** - *POST /api/register*   

   ---
      Register a new customer account
   
   ---
   **Request Header**

        Content Type : application/json
    
   **Request Body**
   ```json
   {
      "name":"customer_name",
      "username": "customer@domain.com",
      "password": "password"
   }
   ```
   **Parameters**
   <table style="margin-left: 40px;">
      <tr><th>Parameters</th>           <th>Value</th>      <th>Data Type</th></tr>
      <tr><td>name</td>   <td>required</td>       <td>string</td></tr>
      <tr><td>username</td>   <td>required</td>       <td>string</td></tr>
      <tr><td>password</td>        <td>required</td>       <td>string</td></tr>
   </table>

   <br/>

   **NOTE**

      Customer are requested to login after successful registration
   <br/>
---
- **Retrieve Products** - *GET /api/products*
   
   ---
      Retrieve product details for all registered product that are active. Product details includes; product id, name, price, Max Ordered Quantity
   
   ---
   **Request Header**

      Content-Type : application/json
   <br/>

---
   <br/>

- **Retrieve Single Product** - *GET /api/products/:product_name*
   
   ---
      Retrieve single product details that is active. Product details includes; product id, name, price, Max Ordered Quantity
   ---
   **Path Parameter**
   
      :product_name

   **Request Header**

      Content-Type : application/json
    
   **Request Body**
   ```json
   {
      "id":"product_id"
   }
   ```
   **Parameters**
   <table style="margin-left: 40px;">
      <tr><th>Parameters</th>           <th>Value</th>      <th>Data Type</th></tr>
      <tr><td>id</td>   <td>required</td>       <td>string</td></tr>
   </table>

   <br/>
---
<br/>

- **Purchase Product** - *GET /api/cart/*

   ---
      Product cart
   ---
  
   **Request Header**

      Content-Type : application/json
      Cookies: session_cookies
     
   <br/>
    
   **Request Body**
   ```json
   {
      "cart": 
      [ 
         { "product_id": "product_id", "quantity": 1 },
         { "product_id": "product_id", "quantity": 2 },
         { "product_id": "product_id", "quantity": 3 }
      ]
   }
   ```
   **Parameters**
   <table style="margin-left: 40px;">
      <tr><th>Parameters</th>           <th>Value</th>      <th>Data Type</th></tr>
      <tr><td>product_id</td>   <td>required</td>       <td>string</td></tr>
      <tr><td>quantity</td>   <td>required</td>       <td>number</td></tr>
   </table>

   <br/>
---
<br/>





