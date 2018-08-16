// const json5_parse = require('../client/common.js').json5_parse;

const json5 = require('json5');

module.exports = function(jsondiffpatch, formattersHtml, curDiffData) {
  const json5_parse = json => {
    if (typeof json === 'object' && json) return json;
    try {
      return json5.parse(json);
    } catch (err) {
      return json;
    }
  };

  const diffText = (left, right) => {
    left = left || '';
    right = right || '';
    if (left == right) {
      return null;
    }

    var delta = jsondiffpatch.diff(left, right);

    let result = formattersHtml.format(delta, left);

    return result;
  };

  const diffJson = (left, right) => {
    left = json5_parse(left);
    right = json5_parse(right);
    let delta = jsondiffpatch.diff(left, right);
    return formattersHtml.format(delta, left);
    // return '';
  };

  const valueMaps = {
    '1': '必需',
    '0': '非必需',
    text: '文本',
    file: '文件',
    undone: '未完成',
    done: '已完成'
  };

  const handleParams = item => {
    let newItem = Object.assign({}, item);
    newItem._id = undefined;

    Object.keys(newItem).forEach(key => {
      switch (key) {
        case 'required':
          newItem[key] = valueMaps[newItem[key]];
          break;
        case 'type':
          newItem[key] = valueMaps[newItem[key]];
          break;
      }
    });
    return newItem;
  };

  const diffArray = (arr1, arr2) => {
    arr1 = arr1 || [];
    arr2 = arr2 || [];
    arr1 = arr1.map(handleParams);
    arr2 = arr2.map(handleParams);
    return diffJson(arr1, arr2);
  };

  let diffView = [];

  if (curDiffData && typeof curDiffData === 'object' && curDiffData.current) {
    const { current, old, type } = curDiffData;
    // wiki 信息的diff 输出
    if (type === 'wiki') {
      if (current != old) {
        diffView.push({
          title: 'wiki更新',
          content: diffText(old, current)
        });
      }
      return (diffView = diffView.filter(item => item.content));
    }
    if (current.path != old.path) {
      diffView.push({
        title: 'Api 路径',
        content: diffText(old.path, current.path)
      });
    }
    if (current.title != old.title) {
      diffView.push({
        title: 'Api 名称',
        content: diffText(old.title, current.title)
      });
    }

    if (current.method != old.method) {
      diffView.push({
        title: 'Method',
        content: diffText(old.method, current.method)
      });
    }

    if (current.catid != old.catid) {
      diffView.push({
        title: '分类 id',
        content: diffText(old.catid, current.catid)
      });
    }

    if (current.status != old.status) {
      diffView.push({
        title: '接口状态',
        content: diffText(valueMaps[old.status], valueMaps[current.status])
      });
    }

    if (current.tag !== old.tag) {
      diffView.push({
        title: '接口tag',
        content: diffText(old.tag, current.tag)
      });
    }

    diffView.push({
      title: 'Request Path Params',
      content: diffArray(old.req_params, current.req_params)
    });

    diffView.push({
      title: 'Request Query',
      content: diffArray(old.req_query, current.req_query)
    });

    diffView.push({
      title: 'Request Header',
      content: diffArray(old.req_headers, current.req_headers)
    });

    let oldValue = current.req_body_type === 'form' ? old.req_body_form : old.req_body_other;
    if (current.req_body_type !== old.req_body_type) {
      diffView.push({
        title: 'Request Type',
        content: diffText(old.req_body_type, current.req_body_type)
      });
      oldValue = null;
    }

    if (current.req_body_type === 'json') {
      diffView.push({
        title: 'Request Body',
        content: diffJson(oldValue, current.req_body_other)
      });
    } else if (current.req_body_type === 'form') {
      diffView.push({
        title: 'Request Form Body',
        content: diffArray(oldValue, current.req_body_form)
      });
    } else {
      diffView.push({
        title: 'Request Raw Body',
        content: diffText(oldValue, current.req_body_other)
      });
    }

    let oldResValue = old.res_body;
    if (current.res_body_type !== old.res_body_type) {
      diffView.push({
        title: 'Response Type',
        content: diffText(old.res_body_type, current.res_body_type)
      });
      oldResValue = '';
    }

    if (current.res_body_type === 'json') {
      diffView.push({
        title: 'Response Body',
        content: diffJson(oldResValue, current.res_body)
      });
    } else {
      diffView.push({
        title: 'Response Body',
        content: diffText(oldResValue, current.res_body)
      });
    }
  }

  return (diffView = diffView.filter(item => item.content));
};
