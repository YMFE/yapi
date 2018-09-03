const req_t_data = [
  {
    name: 'p1',
    desc: 'ddd',
    required: 1,
    paramType: 'json',
    children: [
      { name: 'p1', desc: 'xxx', paramType: 'string', required: 1 },
      { name: 'p2', desc: 'test', paramType: 'init', required: 1 }
    ]
  },
  {
    name: 'p2',
    desc: 'test',
    required: 1,
    paramType: 'json',
    children: [
      { name: 'p1', desc: '33', paramType: 'init', required: 1 },
      { name: 'p2', desc: '444', paramType: 'init', required: 1 }
    ]
  }
];
const res_t_data = {
  ec: { type: 'number', desc: 'ec' },
  msg: { type: 'string', desc: 'msg' },
  data: {
    type: 'array',
    desc: 'data',
    children: { name: { type: 'string', desc: 'name' }, age: { type: 'string', desc: 'age' } }
  },
  field_5: {
    type: 'object',
    desc: 'field_5',
    children: { field_6: { type: 'string', desc: 'field_6' } }
  },
  field_7: { type: 'array', desc: 'field_7' }
};
const chalk = require('chalk');

function isObject(obj) {
  return Object.prototype.toString.call(obj) === '[object Object]';
}
function parserInterface(input) {
  const data = input.data[0];
  const method = JSON.parse(data.type);
  const result = {};
  result.desc = data.desc;
  result.method = method[0] ? 'GET' : 'POST';
  if (!/^\//.test(data.name)) {
    data.name = '/' + data.name;
  }
  result.title = data.name;
  result.path = data.name;
  result.status = 'done';

  result.req_body_is_json_schema = true;
  if (result.method === 'GET') {
    result.req_query = JSON.parse(data.request);
  } else {
    result.req_body_other = JSON.stringify({
      type: 'object',
      properties: parseReq(JSON.parse(data.request)),
      description: ''
    });
    result.req_body_type = 'json';
  }
  try {
    const { response_wiki } = data;
    const t = {
      children: isObject(response_wiki) ? response_wiki : JSON.parse(response_wiki || '{}')
    };
    result.res_body = JSON.stringify({
      $schema: 'http://json-schema.org/draft-04/schema#',
      type: 'object',
      properties: parseRes(t).properties
    });
  } catch (e) {
    console.log(chalk.red('error'), e, data.response_wiki);
  }
  result.res_body_is_json_schema = true;
  result.res_body_type = 'json';
  return result;
}
const TYPE_MAP = {
  json: 'object',
  int: 'number',
  string: 'string',
  boolean: 'boolean'
};
function parseReq(req = []) {
  const output = {};
  req.forEach(({ name, desc, required, paramType, children = [] }) => {
    const item = (output[name] = {
      type: TYPE_MAP[paramType],
      description: desc,
      required: []
    });

    if (paramType === 'json') {
      item.properties = parseReq(children);
      children.forEach(i => {
        if (i.required) {
          item.required.push(i.name);
        }
      });
    }
  });
  return output;
}
function parseRes(res, depth = 0) {
  const output = {
    type: res.type,
    description: res.desc || ''
  };
  const { children } = res;
  // array 如果里面items不是object就不会存在children
  if (children) {
    const properties = {};
    for (const key in children) {
      properties[key] = parseRes(children[key]);
    }
    if (res.type === 'array') {
      output.items = {
        type: 'object',
        properties,
        required: [] // linkstart 不存在必填
      };
    } else {
      output.properties = properties;
    }
  }
  return output;
}
// console.log('--------test parseReq-----------');
// console.log(JSON.stringify(parseReq(req_t_data), null, 2));
// console.log('--------test parseRes-----------');
// console.log(
//   JSON.stringify(
//     parseRes({
//       type: 'object',
//       children: res_t_data,
//     }),
//     null,
//     2
//   )
// );
module.exports = {
  parserInterface
};
