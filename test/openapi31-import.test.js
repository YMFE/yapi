import test from 'ava';

const fs = require('fs');
const path = require('path');
const run = require('../exts/yapi-plugin-import-swagger/run.js');

test('import openapi 3.1', async t => {
  const specPath = path.join(__dirname, 'swagger.v3.1.json');
  const spec = JSON.parse(fs.readFileSync(specPath, 'utf8'));
  const result = await run(spec);

  t.truthy(result);
  t.true(Array.isArray(result.apis));
  t.true(result.apis.length > 0);
  t.is(result.basePath, '/v1');

  const postApi = result.apis.find(api => api.method === 'POST' && api.path === '/pets/{petId}');
  t.truthy(postApi);
  t.is(postApi.req_body_type, 'json');
  const postSchema = JSON.parse(postApi.req_body_other);
  t.deepEqual(postSchema.properties.name.type, ['string', 'null']);

  const getApi = result.apis.find(api => api.method === 'GET' && api.path === '/pets/{petId}');
  t.truthy(getApi);
  t.true(getApi.req_params.some(param => param.name === 'petId'));
  t.is(getApi.res_body_type, 'json');
});
