const _ = require('underscore');

exports.schemaTransformToTable = (schema) =>{
  try{
  
   let result = mapping(schema, 0);
   return result
  }catch(err){
    console.log(err);
  }
}


//  自动添加type

function checkJsonSchema(json) {
  let newJson = Object.assign({}, json)
  if (_.isUndefined(json.type) && _.isObject(json.properties) ){
     newJson.type = 'object'
  } 
  // console.log('newJson', newJson)

  return newJson;
}

const mapping = function(data, index) {
  switch(data.type){
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
      return SchemaInt(data)
    default:
      console.log(data);
  }

};


const SchemaObject = (data, key) => {
  let {properties, required} = data
  properties = properties || {}
  required = required || []
  let result =[];
  Object.keys(properties).map((name, index) => {
    let value = properties[name];
    let copiedState = checkJsonSchema(JSON.parse(JSON.stringify(value)));
    let optionForm = mapping(copiedState, key+''+index);
   
    let desc = optionForm.desc;
    let d = optionForm.default;
    let children = optionForm.children;
    
    delete optionForm.desc;
    delete optionForm.default;
    delete optionForm.children;
    let item = {
      name,
      type: value.type || 'object',
      required: required.indexOf(name) != -1,
      sub: optionForm,
      desc,
      default: d,
      key: key+''+index
    }
    
    if(value.type === 'array' && !_.isUndefined(children) ){
     
      if( _.isArray(children)){
        item.children = children
      }
      // item = {
      //   ...item,
      //   childrenDesc: children.desc
      // }
      item.childrenDesc = children.desc
     
    }

    if(value.type === 'object'|| _.isUndefined(value.type)){
      // item = {
      //   ...item,
      //   children: optionForm
      // }
      item.children = optionForm
      delete item.sub
    }

    result.push(item)
   

  })


  
return result
  
}


const SchemaString = (data) => {
  let item = {
    desc: data.description,
    default: data.default,
    maxLength: data.maxLength,
    minLength: data.minLength,
    enum: data.enum
  }
  return item
}

const SchemaArray =(data, index) => {
  data.items = data.items || {type: 'string'};
  let items = checkJsonSchema(data.items)
  let optionForm = mapping(items, index);
  
  
  let item = {
    desc: data.description,
    default: data.default,
    minItems: data.minItems,
    uniqueItems: data.uniqueItems,
    maxItems: data.maxItems,
    itemType: items.type,
    children: optionForm

  }
  return item
}

const SchemaNumber =(data) => {
  
  let item = {
    desc: data.description,
    maximum: data.maximum,
    minimum: data.minimum,
    default: data.default
  }
  return item
}

const SchemaInt = (data) =>{
  let item = {
    desc: data.description,
    maximum: data.maximum,
    minimum: data.minimum,
    default: data.default,
    format: data.format
  }
  return item
}

const SchemaBoolean = (data) =>{
  
  let item = {
    desc: data.description,
    default: data.default,
    enum: data.enum
  }
  return item
}