# Express MongoDB Application

This is a simple Express.js and MongoDB application. This guide will help you set up and run the application either using Docker or directly on your local machine without Docker.

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

Rename .env.example file to .env or create a `.env`file in the root of the project and add the following environment variables and their values:
```` sh
HOST=
PORT= 
#MONGO_URI is required
MONGO_URI=    
````

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
Rename .env.example file to .env or create a `.env`file in the root of the project and add the following environment variables and their values:
```` sh
HOST=
PORT= 
#MONGO_URI is required
MONGO_URI=    
````
#### 4. Run the following command to start the development environment:
   ```sh
   pnpm dev
   ```