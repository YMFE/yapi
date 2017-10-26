import test from 'ava';

const rewire = require("rewire");
const lib = require('../common/lib.js');


test('testJsonEqual', t=>{
  let json1 = {
    a:"1",
    b:2,
    c:{
      t:3,
      x: [11,22]
    }
  };

  let json2 = {    
    c:{
      x: [11,22],
      t:3
    },
    b:2,
    a:"1"
  }
  t.true(lib.jsonEqual(json1, json1));
})

test('testJsonEqualBase', t=>{
  t.true(lib.jsonEqual(1,1));
})

test('testJsonEqualBaseString', t=>{
  t.true(lib.jsonEqual('2', '2'));
})


test('isDeepMatch', t=>{
  t.true(lib.isDeepMatch({a:'aaaaa', b:2}, {a:'aaaaa'}))
})

test('isDeepMatch', t=>{
  t.true(lib.isDeepMatch({a:1, b:2, c: {t:'ttt'}}, {c: {t:'ttt'}}))
})
