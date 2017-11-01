import test from 'ava';
const jsm = require('../common/json-schema-mockjs.js');

test('jsmBase', t=>{
  let json1 = {
    "title": "Person",
    "type": "object",
    "properties": {
        "firstName": {
            "type": "string"
        },
        "lastName": {
            "type": "string"
        },
        "age": {
            "description": "Age in years",
            "type": "integer",
            "minimum": 0
        }
    },
    "required": ["firstName", "lastName"]
  };
  t.deepEqual(jsm(json1), {
    firstName: '@string',
    lastName: '@string',
    age: "@integer"
  });
})

test('jsmRef', t=>{
  let json2 = {
    "$ref": "#/definitions/Pet",
    "definitions": {
      "Order": {
        "type": "object",
        "properties": {
          "id": {
            "type": "integer",
            "format": "int64"
          },
          "petId": {
            "type": "integer",
            "format": "int64"
          },
          "quantity": {
            "type": "integer",
            "format": "int32"
          },
          "shipDate": {
            "type": "string",
            "format": "date-time"
          },
          "status": {
            "type": "string",
            "description": "Order Status",
            "enum": [
              "placed",
              "approved",
              "delivered"
            ]
          },
          "complete": {
            "type": "boolean",
            "default": false
          }
        },
        "xml": {
          "name": "Order"
        }
      },
      "Category": {
        "type": "object",
        "properties": {
          "id": {
            "type": "integer",
            "format": "int64"
          },
          "name": {
            "type": "string"
          }
        },
        "xml": {
          "name": "Category"
        }
      },
      "User": {
        "type": "object",
        "properties": {
          "id": {
            "type": "integer",
            "format": "int64"
          },
          "username": {
            "type": "string"
          },
          "firstName": {
            "type": "string"
          },
          "lastName": {
            "type": "string"
          },
          "email": {
            "type": "string"
          },
          "password": {
            "type": "string"
          },
          "phone": {
            "type": "string"
          },
          "userStatus": {
            "type": "integer",
            "format": "int32",
            "description": "User Status"
          }
        },
        "xml": {
          "name": "User"
        }
      },
      "Tag": {
        "type": "object",
        "properties": {
          "id": {
            "type": "integer",
            "format": "int64"
          },
          "name": {
            "type": "string"
          }
        },
        "xml": {
          "name": "Tag"
        }
      },
      "Pet": {
        "type": "object",
        "required": [
          "name",
          "photoUrls"
        ],
        "properties": {
          "id": {
            "type": "integer",
            "format": "int64"
          },
          "category": {
            "$ref": "#/definitions/Category"
          },
          "name": {
            "type": "string",
            "example": "doggie"
          },
          "photoUrls": {
            "type": "array",
            "xml": {
              "name": "photoUrl",
              "wrapped": true
            },
            "items": {
              "type": "string"
            }
          },
          "status": {
            "type": "string",
            "description": "pet status in the store"
          }
        },
        "xml": {
          "name": "Pet"
        }
      },
      "ApiResponse": {
        "type": "object",
        "properties": {
          "code": {
            "type": "integer",
            "format": "int32"
          },
          "type": {
            "type": "string"
          },
          "message": {
            "type": "string"
          }
        }
      }
    }
  }

  const destJson2 = {
    id: '@integer',
    category: {
      id: '@integer',
      name: '@string'
    },
    name: '@string',
    photoUrls: ['@string'],
    status: '@string'
  }
  t.deepEqual(jsm(json2), destJson2);


})