import test from 'ava';
import {
  handleParamsValue,
  schemaValidator
} from '../../common/utils.js';


test('handleParamsValue', t => {
    const json = JSON.stringify({
      t: 1,
      obj: {
        name: "dd",
        value: "vvvv"
      }
    })


    t.is(handleParamsValue(" aaaa | length"), 'aaaa | length');
    t.is(handleParamsValue("{{aaaa |upper }}"), 'AAAA')
    t.is(handleParamsValue(json), json)
    t.is(handleParamsValue('   {{ dkkdjf }}'), 'dkkdjf')
    t.is(handleParamsValue('   {{ dkkdjf | upper | kkk }}'), '{{ dkkdjf | upper | kkk }}')
    t.is(handleParamsValue('aaa   {{ aaaa | upper }} bbbb'), 'aaa   AAAA bbbb')
    t.is(handleParamsValue('aaa   {{ aaaa | upper }} bbbb,aaa   {{ aaaa | upper }} bbbb'), 'aaa   AAAA bbbb,aaa   AAAA bbbb')
    t.is(handleParamsValue("{{aaaa | length}}"), 4);
    t.is(handleParamsValue("{{4444 | number}}"), 4444);
});

test('schemaValidator', t => {
  const schema1 = {
    "$schema": "http://json-schema.org/draft-04/schema#",
    "type": "object",
    "properties": {
      "errcode": {
        "type": "number"
      },
      "errmsg": {
        "type": "string"
      },
      "data": {
        "type": "object",
        "properties": {}
      }
    },
    "required": [
      "errcode",
      "errmsg"
    ]
  };

  const data1 = {
    "errcode": 0,
    "errmsg": "成功！",
    "data": {}
  }

  t.is(schemaValidator(schema1, data1).valid, true);

  const schema2 ={
    "type": "object",
    "required": [
      "id",
      "category",
      "status"
    ],
    "properties": {
      "id": {
        "type": "integer",
        "format": "int64",
        "minimum": 1,
        "maximum": 4,
        "enum": [
          2,
          3,
          4
        ],
        "exclusiveMinimum": true,
        "exclusiveMaximum": true,
        "description": "所有功能"
      },
      "category": {
        "type": "object",
        "properties": {
          "id": {
            "type": "integer",
            "format": "int64",
            "minimum": 1,
            "maximum": 3,
            "exclusiveMinimum": true,
            "description": "exclusiveMinimum"
          },
          "type": {
            "type": "string",
            "pattern": "\\d",
            "default": "12",
            "minLength": 1,
            "maxLength": 2,
            "description": "正则， 长度限制"
          },
          "name": {
            "type": "string",
            "enum": [
              "小明",
              "小风"
            ],
            "description": "枚举"
          },
          "formate": {
            "type": "string",
            "format": "ctitle",
            "description": "formate"
          },
          "boolean": {
            "type": "boolean"
          },
          "array": {
            "type": "array",
            "items": {
              "type": "object",
              "properties": {
                "item": {
                  "type": "boolean"
                }
              },
              "required": [
                "item"
              ]
            },
            "description": "uniqueItems",
            "uniqueItems": true
          },
          "array2": {
            "type": "array",
            "items": {
              "type": "integer",
              "enum": [
                2
              ],
              "minimum": 1,
              "maximum": 2,
              "description": "枚举和最大值最小值"
            },
            "minItems": 1,
            "maxItems": 2,
            "description": "最大个数和最小个数"
          }
        },
        "xml": {
          "name": "Category"
        },
        "$$ref": "#/definitions/Category",
        "required": [
          "id",
          "name",
          "boolean"
        ]
      },
      "status": {
        "type": "number",
        "description": "枚举",
        "enum": [
          23.9,
          34.9
        ]
      }
    },
    "xml": {
      "name": "Pet"
    },
    "$$ref": "#/definitions/Pet"
  }

  const data2 = {
    "id": 2,
    "category": {
      "id": 2,
      "type": "8",
      "name": "小明",
      "formate": "任治导具",
      "boolean": false,
      "array": [
        {
          "item": true
        },
        {
          "item": false
        }
      ],
      "array2": [
        2,
        2
      ]
    },
    "status": 23.9
  }

  t.is(schemaValidator(schema2, data2).valid, true);
})

