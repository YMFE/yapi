import test from 'ava';
const jsm = require('../common/json-schema-mockjs.js');

test('jsmBase', t => {
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

test('jsmRef', t => {
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
      "Category2": {
        "type": "object",
        "properties": {
          "name": {
            "$ref": "#/definitions/ApiResponse"
          },
          "id": {
            "$ref": "#/definitions/ApiResponse"
          }
        }
      },
      "Category3": {
        "type": "object",
        "properties": {
          "username": {
            "type": "string"
          }
        }
      },
      "Category": {
        "type": "object",
        "properties": {
          "id": {
            "$ref": "#/definitions/Category2"
          }
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
    category: {
      id: {
        name: {
          message: '@string',
          type: '@string',
          code: '@integer'
        },
        id: {
          message: '@string',
          type: '@string',
          code: '@integer'
        }
      }
    },
    name: '@string',
    photoUrls: ['@string'],
    status: '@string'
  }
  t.deepEqual(jsm(json2), destJson2);

})

test('jsmRef2', t => {
  // let json3 = {
  //   "$ref": "#/definitions/Response",
  //   "definitions": {
  //     "Result": {
  //       "type": "object",
  //       "properties": {
  //         "data": {
  //           "$ref": "#/definitions/ProductByTagRuleResVo"
  //         }
  //       }
  //     },
  //     "Response": {
  //       "type": "object",
  //       "required": [
  //         "code",
  //         "msg"
  //       ],
  //       "properties": {
  //         "code": {
  //           "type": "string",
  //           "description": "响应编码OK"
  //         },
  //         "info": {
  //           "$ref": "#/definitions/Result"
  //         },
  //         "msg": {
  //           "type": "string",
  //           "description": "错误描述"
  //         }
  //       }
  //     },
  //     "ProductByTagRuleResVo": {
  //       "type": "object",
  //       "properties": {
  //         "product_info": {
  //           "$ref": "#/definitions/ProductInfoAll"
  //         },
  //         "product_image": {
  //           "$ref": "#/definitions/imageItems"
  //         },
  //         "product_category": {
  //           "$ref": "#/definitions/Category"
  //         }

  //       }
  //     },
  //     "ProductInfoAll": {
  //       "type": "object",
  //       "properties": {
  //         "color": {
  //           "type": "string",
  //           "description": "中文颜色"
  //         }
  //       }
  //     },
  //     "imageItems": {
  //       "type": "object",
  //       "properties": {
  //         "id": {
  //           "type": "string",
  //           "description": "imageid"
  //         }
  //       }
  //     },
  //     "Category": {
  //       "type": "object",
  //       "properties": {
  //         "name": {
  //           "type": "string",
  //           "description": "分类名称"
  //         }
  //       }
  //     }


  //   }
  // }

  let json3 = {
    "$ref": "#/definitions/Response",
    "definitions": {
      "Response": {
        "type": "object",
        "required": [
          "code",
          "msg"
        ],
        "properties": {
          "code": {
            "type": "string",
            "description": "响应编码OK"
          },
          "info": {
            "$ref": "#/definitions/Result"
          },
          "msg": {
            "type": "string",
            "description": "错误描述"
          }
        }
      },
      "Result": {
        "type": "object",
        "properties": {
          "data": {
            "$ref": "#/definitions/ProductByTagRuleResVo"
          }
        }
      },
      "ProductByTagRuleResVo": {
        "type": "object",
        "properties": {
          "product_info": {
            "$ref": "#/definitions/ProductInfoAll"
          },
          "product_image": {
            "$ref": "#/definitions/imageItems"
          },
          "product_category": {
            "$ref": "#/definitions/Category"
          }
        }
      },
      "ProductInfoAll": {
        "type": "object",
        "properties": {
          "color": {
            "type": "string",
            "description": "中文颜色"
          }
        }
      },
      "imageItems": {
        "type": "object",
        "properties": {
          "id": {
            "type": "string",
            "description": "imageid"
          }
        }
      },
      "Category": {
        "type": "object",
        "properties": {
          "name": {
            "type": "string",
            "description": "分类名称"
          }
        }
      }
    }

  }

  const destJson3 = {
    info: {
      data: {
        product_info: {
          color: '@string'
        },
        product_image: {
          id: '@string'
        },
        product_category: {
          name: '@string'
        }
      }
    },
    code: '@string',
    msg: '@string'
  }

  t.deepEqual(jsm(json3), destJson3);
})