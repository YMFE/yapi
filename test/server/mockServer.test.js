import test from 'ava';
const rewire = require("rewire");
const mockServer = rewire('../../server/middleware/mockServer.js');
const matchApi = mockServer.__get__('matchApi');
const mockExtra = require('../../common/mock-extra.js');

test('matchApi', t => {
  const apiRule = '/user/:username';
  t.true(matchApi('/user/tom', apiRule));
  t.true(matchApi('/user/111$$%#$##$#2222222222!!!!!!!', apiRule))
  t.false(matchApi('/user/a/', apiRule))
  t.false(matchApi('/use/a', apiRule))
  
  const apiRule_2 = '/user/:username/kk';
  t.true(matchApi('/user/aa/kk', apiRule_2));
  t.true(matchApi('/user/!!!###kksdjfks***/kk', apiRule_2));
  t.false(matchApi('/user/aa/aa', apiRule_2));

  const apiRule_3 = '/user/:sdfsdfj/ttt/:sdkfjkj';
  t.true(matchApi('/user/a/ttt/b', apiRule_3));
  t.false(matchApi('/user/a/ttt2/b', apiRule_3))


});

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

