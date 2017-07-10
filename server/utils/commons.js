
import fs from 'fs-extra'
import path from 'path'
import yapi from '../yapi.js'

exports.resReturn = (data, num, errmsg)=> {
    num = num || 0;
    return {
        errcode: num,
        errmsg: errmsg || 'success',
        data: data
    }
}

const MSGTYPE = {
    'log' : 'Log',
    'warn' : 'warning',
    'error': 'Error'
}

exports.log =  (msg, type) => {
    if(!msg) return;
    type = type || 'log';
    let f;
    switch(type){
        case 'log': f = console.log; break;
        case 'warn': f = console.warn; break;
        case 'error': f= console.error; break;
        default : f = console.log; break;
    }
    f(type + ':', msg);
    let date = new Date();
    let year = date.getFullYear();
    let month = date.getMonth();
    
    let logfile = path.join(yapi.WEBROOT_LOG, year + '-' + month + '.log');

    if(typeof msg === 'object'){
        if(msg instanceof Error) msg = msg.message;
        else msg = JSON.stringify(msg);
    }
    let data= (new Date).toLocaleTimeString() + "\t|\t" + type + "\t|\t" + msg;
    fs.writeFileSync(logfile, data, {
        flag: 'w+'
    });

    
}


exports.fileExist =  (filePath) =>{
    try {
        return fs.statSync(filePath).isFile();
    } catch (err) {
        return false;
    }
}

exports.time = () => {
    return Date.parse(new Date())/1000;
}

exports.fieldSelect = (data, field)=>{
    if(!data || !field || !Array.isArray(field)) return null;
    var arr = {};
    field.forEach( (f) => {
        data[f] && (arr[f] = data[f]);
    } )
    return arr;
}

exports.rand =(min, max)=>{
    return Math.floor(Math.random() * (max - min) + min);
}

exports.json_parse = (json)=>{
    try{
        return JSON.parse(json);
    }catch(e){
        return json
    }
}