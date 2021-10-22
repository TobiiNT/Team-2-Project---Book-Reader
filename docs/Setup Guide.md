# Web app setting up guide

## Install Node.js
Go to https://nodejs.org/en/ and download Node

## Install dependencies for server
In the project folder,open up the terminal:
-  cd src/server
-  npm install express mongodb cors dotenv

    * mongodb command installs MongoDB database driver that allows your Node.js applications to connect to the database and work with data.
    * express installs the web framework for Node.js.
    * cors installs a Node.js package that allows cross origin resource sharing.
    * dotenv installs the module that loads environment variables from a .env file into process.env file.

## Install dependencies for client
   In the project folder, open up the terminal:
- cd src/client
- npm install bootstrap
- npm install react-router-dom
- npm install axios

## Run server
In the server folder,open up the terminal:
- npm install -g nodemon
- nodemon server
 - Do not close while the server is running

## Start the client
In the client folder, open up the terminal:
- npm start


