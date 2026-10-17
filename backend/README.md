Express Menu Management API

A lightweight RESTful API built with Node.js and Express that manages a restaurant or cafe menu using a local JSON file as its database. It features clean separation of concerns using the Model-View-Controller (MVC) architecture pattern (specifically Router and Controller modules).

🚀 Features

Get Menu Items: Fetch all available items on the menu.

Partial Update (PATCH): Modify specific fields (e.g., price, availability, description) without overwriting the rest of the item data.

Delete Menu Item: Safely remove items from the menu.

File Persistence: Automatic read and write operations directly to a JSON data store using Node.js fs/promises.

Modular Architecture: Clear division between routing logic and controller logic.

📁 Project Structure

├── Db/
│   └── menuData.json       # JSON file serving as the mock database
├── controllers/
│   └── menuController.js   # Contains business logic for all menu operations
├── routes/
│   └── menuRouter.js       # Defines API endpoints and connects to controllers
├── app.js                  # Main Express application entry point
├── package.json
└── README.md


🛠️ Requirements & Setup

Prerequisites

Node.js (v18 or higher recommended)

npm or yarn

Installation

Clone or download the repository:

git clone <repository-url>
cd <project-directory>


Install dependencies:

npm install


Verify Configuration:
Ensure package.json includes "type": "module" if you are using ES Modules syntax (import/export).

Start the server:

npm start


📡 API Endpoints

1. Get All Menu Items

Returns the complete list of items in the menu.

Method: GET

URL Path: /api/items

Response (200 OK):

[
  {
    "id": 1,
    "name": "Burger",
    "category": "Main",
    "price": 9.99,
    "description": "Juicy beef burger with cheese",
    "available": true
  }
]


2. Update a Menu Item

Updates one or more fields of an existing menu item without affecting unchanged fields.

Method: PATCH

URL Path: /api/item/:id

Headers: Content-Type: application/json

Request Body Example:

{
  "price": 11.99,
  "available": false
}


Response (200 OK):

{
  "success": true,
  "message": "Menu item updated successfully",
  "data": {
    "id": 1,
    "name": "Burger",
    "category": "Main",
    "price": 11.99,
    "description": "Juicy beef burger with cheese",
    "available": false
  }
}


Error Response (404 Not Found):

{
  "success": false,
  "message": "Menu item not found"
}


3. Delete a Menu Item

Removes an item from the menu by its ID.

Method: DELETE

URL Path: /api/item/:id

Response (200 OK):

{
  "success": true,
  "message": "Menu item deleted successfully"
}


Error Response (404 Not Found):

{
  "success": false,
  "message": "Menu item not found"
}


🛠️ Error Handling

The API returns consistent HTTP status codes:

200 OK: Successful operation.

404 Not Found: Item with the requested ID does not exist.

500 Internal Server Error: Server failure or error reading/writing to the storage file.