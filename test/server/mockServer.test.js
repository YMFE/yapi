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
