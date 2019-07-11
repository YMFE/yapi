import test from 'ava';
const mockExtra = require('../common/mock-extra.js');


test('mock-extra', t=>{
  let data = '@string ${body.a}';
  t.is(mockExtra(data), '@string ${body.a}');
  let data2 = {
    a:'@string',
    b:{
      t:'${body.a}'
    }
  }
  t.deepEqual(mockExtra(data2,{
    body: {
      a: 3
    }
  }), {
    a:'@string',
    b:{
      t:3
    }
  }, 'message');

  //test object
  let data3 = {
    a:'@string',
    b:{
      t:'${body}'
    }
  }
  t.deepEqual(mockExtra(data3,{
    body: {
      a: 3,
      t: 5
    }
  }), {
    a:'@string',
    b:{
      t:{
        a: 3,
        t: 5
      }
    }
  }, 'message');

  //test array
  let data4 = {
    a:'@string',
    b:{
      t:'${query.arr}'
    }
  }

  t.deepEqual(mockExtra(data4, {query: {
    arr: [1,2,3]
  }}), {
    a: '@string',
    b:{
      t: [1,2,3]
    }
  
  }, 'message');

  //test var
  let data5 = {
    a:'@string',
    b:{
      t:'${ttt.arr}'
    }
  }

  t.deepEqual(mockExtra(data5, {ttt: {
    arr: [1,2,3]
  }}), {
    a: '@string',
    b:{
      t: [1,2,3]
    }
  
  }, 'message');

//test var
let data6 = {
  a:'@string',
  b:{
    "ttt|regexp":'a|b'
  }
}

//test regexp
t.deepEqual(mockExtra(data6, {ttt: {
  arr: [1,2,3]
}}), {
  a: '@string',
  b:{
    ttt: /a|b/
  }

}, 'message');





})

