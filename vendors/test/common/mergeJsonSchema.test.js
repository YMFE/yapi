import test from 'ava';
import mergeJsonSchema from '../../common/mergeJsonSchema';

test('base', t=>{
  let schema1 = {
    type: 'string',
    default: 'xxx'
  }

  let schema2 = {
    type: 'string',
    format: 'email'
  }

  let result = mergeJsonSchema(schema1, schema2)

  t.deepEqual(result, {
    type:'string',
    default: 'xxx',
    format: 'email'
  })
})

test('object', t=>{
  let schema1 = {
    "type": "object",
    "title": "empty object",
    "xxx": 1,
    "properties": {
      "field_1": {
        "type": "string",
        "format": "email"
      }
    }
  }

  let schema2 = {
    "type": "object",
    "title": "empty object",
    "properties": {
      "field_1": {
        "type": "string",
        "description": "dd"
      }
    }
  }

  let result = mergeJsonSchema(schema1, schema2)

  t.deepEqual(result, {
    "type": "object",
    "title": "empty object",
    "xxx": 1,
    "properties": {
      "field_1": {
        "type": "string",
        "format": "email",
        "description": "dd"
      }
    }
  })
})

test('array', t=>{
  let schema1 = {
    "type": "object",
    "title": "empty object",
    "properties": {
      "field_1": {
        "type": "array",
        "tt":1,
        "items": {
          "type": "object",
          "xxx": "2",
          "properties": {
            "field_3": {
              "format": 'ttt',
              "type": "string"
            }
          }
        }
      }
    }
  }

  let schema2 = {
    "type": "object",
    "title": "empty object",
    "properties": {
      "field_1": {
        "type": "array",
        "items": {
          "type": "object",
          "properties": {
            "field_3": {
              "type": "string",
              "enum": [1,2]
            }
          }
        }
      }
    }
  }

  let result = mergeJsonSchema(schema1, schema2)

  t.deepEqual(result, {
    "type": "object",
    "title": "empty object",
    "properties": {
      "field_1": {
        "type": "array",
        "tt":1,
        "items": {
          "type": "object",
          "xxx": "2",
          "properties": {
            "field_3": {
              "format": 'ttt',
              "type": "string",
              "enum": [1,2]
            }
          }
        }
      }
    }
  })
})

