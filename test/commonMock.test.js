const test = require('ava');
const commonMock = require('../server/utils/commonMock.js');

test('commonResponseHeaders keys check', t => {
  t.truthy(commonMock.commonResponseHeaders['Access-Control-Allow-Credentials']);
  t.truthy(commonMock.commonResponseHeaders['Access-Control-Max-Age']);
});

test('setCommonResponseHeaders sets headers on ctx', t => {
  const ctx = {
    headers: {},
    set: function(key, value) {
      this.headers[key] = value;
    }
  };
  
  commonMock.setCommonResponseHeaders(ctx, 'http://localhost:3000');
  
  t.is(ctx.headers['Access-Control-Allow-Origin'], 'http://localhost:3000');
  t.is(ctx.headers['Access-Control-Allow-Credentials'], true);
});

test('mockUtils.success returns correct structure', t => {
  const res = commonMock.mockUtils.success({ id: 1 });
  t.is(res.code, 0);
  t.is(res.msg, 'success');
  t.deepEqual(res.data, { id: 1 });
});

test('mockUtils.fail returns correct structure', t => {
  const res = commonMock.mockUtils.fail(500, 'server error');
  t.is(res.code, 500);
  t.is(res.msg, 'server error');
});

test('mockUtils.page returns correct structure', t => {
  const list = [1, 2, 3];
  const res = commonMock.mockUtils.page(list, 10);
  t.is(res.code, 0);
  t.deepEqual(res.data.list, list);
  t.is(res.data.total, 10);
});

test('mockUtils.mockUser returns valid mock data', t => {
  const user = commonMock.mockUtils.mockUser();
  t.truthy(user.id);
  t.truthy(user.name);
  t.truthy(user.email);
});
