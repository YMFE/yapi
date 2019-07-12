module.exports = function storageCreator(id) {
  const storageModel = require('../models/storage.js');
  const yapi = require('../yapi.js');
  const defaultData = {}
  return {
    getItem: async (name = '') => {
      let getIteminfo={};
      let inst = yapi.getInst(storageModel);
      let data = await inst.get(id);
      data = data || defaultData;
      if (name) return data[name];
      getIteminfo["des"]="key: "+id+"--->getItem:"+name;
      getIteminfo["data"]=data;
      //console.log(getIteminfo);
      return data;
    },
    setItem: async (data,name,value) => {
      let setIteminfo={};
      let inst = yapi.getInst(storageModel);
      let curData = await inst.get(id);
     //let data =  curData || defaultData;
      let result;

      //data[name] = value;
      if(!curData){
        result = await inst.save(id, data, true)
      }else{
        result = await inst.save(id, data, false)
      }
      setIteminfo["des"]="key: "+id+"--->setItem:"+name+"="+value;
      setIteminfo["data"]=data;
      setIteminfo["action"]=curData?"update":"insert";
      setIteminfo["result"]=result;
      //console.log(setIteminfo);
      return result;
    }
  }
}
