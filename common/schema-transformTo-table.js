const _ = require('underscore');
let fieldNum = 1;

exports.schemaTransformToTable = schema => {
  try {
    schema = checkJsonSchema(schema);
    let result = Schema(schema, 0);
    result = _.isArray(result) ? result : [result];
    return result;
  } catch (err) {
    console.log(err);
  }
};

//  自动添加type

function checkJsonSchema(json) {
  if (!json || typeof json !== 'object') return json;
  let newJson = Object.assign({}, json);
  newJson = normalizeCombinators(newJson);
  if (_.isArray(newJson.type)) {
    let type = newJson.type.find(item => item && item !== 'null') || newJson.type[0];
    newJson.type = type;
    newJson.nullable = true;
  }
  if (_.isUndefined(newJson.type) && _.isObject(newJson.properties)) {
    newJson.type = 'object';
  }

  return newJson;
}

function normalizeCombinators(schema) {
  if (!schema || typeof schema !== 'object') return schema;
  let result = Object.assign({}, schema);
  if (_.isArray(result.allOf) && result.allOf.length > 0) {
    let merged = mergeSchemas(result.allOf);
    result = Object.assign({}, result, merged);
    delete result.allOf;
  }
  if (_.isArray(result.oneOf) && result.oneOf.length > 0) {
    let picked = pickSchemaCandidate(result.oneOf);
    result = Object.assign({}, result, picked);
    delete result.oneOf;
  }
  if (_.isArray(result.anyOf) && result.anyOf.length > 0) {
    let picked = pickSchemaCandidate(result.anyOf);
    result = Object.assign({}, result, picked);
    delete result.anyOf;
  }
  if (_.isObject(result.properties)) {
    Object.keys(result.properties).forEach(key => {
      result.properties[key] = checkJsonSchema(result.properties[key]);
    });
  }
  if (_.isObject(result.items)) {
    result.items = checkJsonSchema(result.items);
  }
  return result;
}

function mergeSchemas(list) {
  let merged = {};
  let properties = {};
  let required = [];
  list.forEach(item => {
    let schema = checkJsonSchema(item) || {};
    if (schema.type && !merged.type) {
      merged.type = schema.type;
    }
    if (schema.description && !merged.description) {
      merged.description = schema.description;
    }
    if (schema.title && !merged.title) {
      merged.title = schema.title;
    }
    if (_.isObject(schema.properties)) {
      properties = Object.assign(properties, schema.properties);
    }
    if (_.isArray(schema.required)) {
      schema.required.forEach(name => {
        if (required.indexOf(name) === -1) required.push(name);
      });
    }
  });
  if (!_.isEmpty(properties)) {
    merged.properties = properties;
  }
  if (required.length > 0) {
    merged.required = required;
  }
  return merged;
}

function pickSchemaCandidate(list) {
  let candidate = list.find(item => item && item.properties);
  if (!candidate) candidate = list[0];
  return checkJsonSchema(candidate) || {};
}

const mapping = function(data, index) {
  switch (data.type) {
    case 'string':
      return SchemaString(data);

    case 'number':
      return SchemaNumber(data);

    case 'array':
      return SchemaArray(data, index);

    case 'object':
      return SchemaObject(data, index);

    case 'boolean':
      return SchemaBoolean(data);

    case 'integer':
      return SchemaInt(data);
    default:
      return SchemaOther(data);
  }
};

const ConcatDesc = (title, desc) => {
  return [title, desc].join('\n').trim();
};

const Schema = (data, key) => {
  let result = mapping(data, key);
  if (data.type !== 'object') {
    let desc = result.desc;
    let d = result.default;
    let children = result.children;

    delete result.desc;
    delete result.default;
    delete result.children;
    let item = {
      type: data.type,
      key,
      desc,
      default: d,
      sub: result
    };

    if (_.isArray(children)) {
      item = Object.assign({}, item, { children });
    }

    return item;
  }

  return result;
};

const SchemaObject = (data, key) => {
  let { properties, required } = data;
  properties = properties || {};
  required = required || [];
  let result = [];
  Object.keys(properties).map((name, index) => {
    let value = properties[name];
    let copiedState = checkJsonSchema(JSON.parse(JSON.stringify(value)));

    let optionForm = Schema(copiedState, key + '-' + index);
    let item = {
      name,
      key: key + '-' + index,
      desc: ConcatDesc(copiedState.title, copiedState.description),
      required: required.indexOf(name) != -1
    };

    if (value.type === 'object' || (_.isUndefined(value.type) && _.isArray(optionForm))) {
      item = Object.assign({}, item, { type: 'object', children: optionForm });
      delete item.sub;
    } else {
      item = Object.assign({}, item, optionForm);
    }

    result.push(item);
  });

  return result;
};

const SchemaString = data => {
  let item = {
    desc: ConcatDesc(data.title, data.description),
    default: data.default,
    maxLength: data.maxLength,
    minLength: data.minLength,
    enum: data.enum,
    enumDesc: data.enumDesc,
    format: data.format,
    mock: data.mock && data.mock.mock
  };
  return item;
};

const SchemaArray = (data, index) => {
  data.items = data.items || { type: 'string' };
  let items = checkJsonSchema(data.items);
  let optionForm = mapping(items, index);
  //  处理array嵌套array的问题
  let children =optionForm ;
  if (!_.isArray(optionForm) && !_.isUndefined(optionForm)) {
    optionForm.key = 'array-' + fieldNum++;
    children = [optionForm];
  }

  let item = {
    desc: ConcatDesc(data.title, data.description),
    default: data.default,
    minItems: data.minItems,
    uniqueItems: data.uniqueItems,
    maxItems: data.maxItems,
    itemType: items.type,
    children
  };
  if (items.type === 'string') {
    item = Object.assign({}, item, { itemFormat: items.format });
  }
  return item;
};

const SchemaNumber = data => {
  let item = {
    desc: ConcatDesc(data.title, data.description),
    maximum: data.maximum,
    minimum: data.minimum,
    default: data.default,
    format: data.format,
    enum: data.enum,
    enumDesc: data.enumDesc,
    mock: data.mock && data.mock.mock
  };
  return item;
};

const SchemaInt = data => {
  let item = {
    desc: ConcatDesc(data.title, data.description),
    maximum: data.maximum,
    minimum: data.minimum,
    default: data.default,
    format: data.format,
    enum: data.enum,
    enumDesc: data.enumDesc,
    mock: data.mock && data.mock.mock
  };
  return item;
};

const SchemaBoolean = data => {
  let item = {
    desc: ConcatDesc(data.title, data.description),
    default: data.default,
    enum: data.enum,
    mock: data.mock && data.mock.mock
  };
  return item;
};

const SchemaOther = data => {
  let item = {
    desc: ConcatDesc(data.title, data.description),
    default: data.default,
    mock: data.mock && data.mock.mock
  };
  return item;
};
