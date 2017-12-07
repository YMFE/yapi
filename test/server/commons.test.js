import test from 'ava';
import {
  ltrim,
  rtrim,
  trim,
  handleParams,
  verifyPath, 
  sandbox,
  handleVarPath
} from '../../server/utils/commons.js';

test('trim', t => {
    t.is(trim(" a   b  ksjdfk    "), 'a   b  ksjdfk');
    t.is(trim(1), '1')
});

test('ltrim', t => {
  t.is(ltrim(" a   b  ksjdfk    "), 'a   b  ksjdfk    ');
  t.is(ltrim(1), '1')
});

test('rtrim', t => {
  t.is(rtrim(" a   b  ksjdfk    "), ' a   b  ksjdfk');
  t.is(rtrim(1), '1')
});

test('handleParams', t=>{
    t.deepEqual(handleParams({
        a: '  s k ',
        b: " a123456 "
    }, {
        a: 'string',
        b: 'number'
    }), {
        a: 's k',
        b: 0
    })
})

test('verifyPath', t=>{
    t.false(verifyPath('a/b'));
    t.true(verifyPath('/a:b/t/.api/k_-/tt'))
    t.true(verifyPath('/a:b/t/.api/k_-/tt/'))
})

test('sandbox', t=>{
    t.deepEqual(sandbox({
        a: 1
    }, 'a=2'), {a : 2});
})

test('handleVarPath', t=>{
    let result = [];
    let pathname = '/a/:id'
    handleVarPath(pathname, result);

    t.deepEqual(result, [{
        name: 'id',
        desc: ''
    }])
})

test('handleVarPath2', t=>{
    let result = [];
    let pathname = '/a/{id}'
    handleVarPath(pathname, result);

    t.deepEqual(result, [{
        name: 'id',
        desc: ''
    }])
})

test('handleVarPath4', t=>{
    let result = [];
    let pathname = '/a/id={id}/tt/:sub/kk'
    handleVarPath(pathname, result);

    t.deepEqual(result, [{
        name: 'sub',
        desc: ''
    }, {
        name: 'id',
        desc: ''
    }])
})