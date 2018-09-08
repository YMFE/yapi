function isPlainObject(obj) {
  return obj ? typeof obj === 'object' && Object.getPrototypeOf(obj) === Object.prototype : false;
}

function handleProperties(sourceProperties, mergeProperties){
  if(!isPlainObject(mergeProperties)){
    return mergeProperties
  }
  if(! isPlainObject(sourceProperties)){
    return mergeProperties
  }
  Object.keys(mergeProperties).forEach(key=>{
    mergeProperties[key]= handleSchema(sourceProperties[key], mergeProperties[key])
  })
  return mergeProperties;
}


function handleSchema(source, merge){
  if(!isPlainObject(source)) return merge;
  if(!isPlainObject(merge)) return merge;
  let result = {}
  Object.assign(result, source, merge)
  if(merge.type === 'object'){
    result.properties = handleProperties(source.properties, merge.properties);
  }else if(merge.type === 'array'){
    result.items = handleSchema(source.items, merge.items);
  }
  return result;
}

module.exports = function(sourceJsonSchema, mergeJsonSchema){
  return handleSchema(sourceJsonSchema, mergeJsonSchema)
}