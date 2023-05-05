const qs = require('query-string')
const defaultTheme = require('./defaultTheme.js')

function json_format(json) {
  if (json && typeof json === 'object') {
    return JSON.stringify(json, null, '   ')
  }
  return json
}

function strChangeObj(str, info) {
  if (!str || typeof str !== 'string') {
    return str
  }
  var arr = str.split(info)
  var obj = {}
  for (var i = 0; i < arr.length; i++) {
    var arr2 = arr[i].split('=')
    obj[arr2[0]] = arr2[1]
  }
  for (let i in obj) {
    if (!obj[i]) {
      return obj
    }
    if (obj[i].indexOf('%2') !== -1) {
      obj[i] = obj[i].split('%2')
    }
  }
  return obj
}

module.exports = function renderToHtml(reports) {
  let tp = createHtml(reports)
  return tp
}

function createHtml(reports) {
  let mdTemplate = ``
  let left = ``
  reports.list.map((item, index) => {
    mdTemplate += baseHtml(index, item.name, item.path, item.status)
    mdTemplate += validHtml(item.validRes)
    mdTemplate += requestHtml(item.url, item.headers, item.data)
    mdTemplate += reponseHtml(item.res_header, item.res_body)
    left += leftHtml(index, item.name, item.code)
    // left += codeHtml(item.code);
  })
  return createHtml5(left, mdTemplate, reports.message, reports.runTime)
}

function createHtml5(left, tp, msg, runTime) {
  let message = ``
  if (msg.failedNum === 0) {
    message += `<div>一共 <span class="success">${msg.successNum}</span> 测试用例， 全部验证通过(${runTime})</div>`
  } else {
    message += `<div>一共 ${msg.len} 测试用例，<span class="success"> ${msg.successNum}</span> 个验证通过， ${msg.failedNum} 个未通过(${runTime})</div>`
  }

  //html5模板
  let html = `<!DOCTYPE html>
  <html>
  <head>
  <title>测试报告</title>
  <meta charset="utf-8" />
  ${defaultTheme}
  </head>
  <body class="yapi-run-auto-test">
    <div class="m-header">
      <a href="#"><h1 class="title">落兵台 测试结果文档</h1></a>
    </div>
    <div class="g-doc">
      <div class="menu-left">
        ${left}
      </div>
      <div id="right" class="content-right">
      <h1>落兵台 测试报告</h1>
      <div class="summary">${message}</div>
      ${tp}
        <footer class="m-footer">
          <p>Build by yapi</p>
        </footer>
      </div>
    </div>
  </body>
  </html>
  `
  return html
}

function requestHtml(url, headers, params) {
  headers = json_format(headers)
  params = json_format(qs.parse(params))
  let html = ``
  html += `
  <div>
    <h3>Request</h3>
    <div class="row case-report">
     <div class="col-3 case-report-title">Url</div>
     <div class="col-21">${url}</div>
    </div>`
  html += headers
    ? `<div class="row case-report">
    <div class="col-3 case-report-title">Headers</div>
    <div class="col-21">
     <pre>${headers}</pre>
    </div>
   </div>`
    : ``

  html += params
    ? ` <div class="row case-report">
   <div class="col-3 case-report-title">Body</div>
   <div class="col-21">
    <pre>${params}</pre>
   </div>
   </div>`
    : ``
  html += `</div>`

  return html
}

function reponseHtml(res_header, res_body) {
  res_header = json_format(res_header, null, '   ')
  res_body = json_format(strChangeObj(res_body, '&'), null, '   ')
  let html = ``
  html += `<div><h3>Reponse</h3>`

  html += res_header
    ? `
  <div class="row case-report">
   <div class="col-3 case-report-title">Headers</div>
   <div class="col-21">
    <pre>${res_header}</pre>
   </div>
  </div>`
    : ``

  html += res_body
    ? ` <div class="row case-report">
  <div class="col-3 case-report-title">Body</div>
  <div class="col-21">
   <pre>${res_body}</pre>
  </div>
 </div>`
    : ``

  html += `</div>`

  return html
}

function validHtml(validRes) {
  if (validRes && Array.isArray(validRes)) {
    validRes = validRes.map((item, index) => {
      return `<div key=${index}>${item.message}</div>`
    })
  }
  let html = `
  <div>
    <div class="row case-report">
     <div class="col-3 case-report-title">验证结果</div>
     <div class="col-21">
      ${validRes}
     </div>
    </div>
  </div>
  
  `

  return html
}

function baseHtml(index, name, path, status) {
  let html = `
  <div>
    <h2 id=${index}>${name}</h2>
    <h3>基本信息</h3>
    <div class="row case-report">
    <div class="col-3 case-report-title">Path</div>
    <div class="col-21">${path}</div>
   </div>
   <div class="row case-report">
    <div class="col-3 case-report-title">Status</div>
    <div class="col-21">${status}</div>
   </div>
  </div>
  `

  return html
}

function leftHtml(index, name, code) {
  let html = `
  <div class="list-content">
    <a class="list" href="#${index}">${name}</a>
    ${codeHtml(code)}
  </div>
  `

  return html
}

function codeHtml(code) {
  let codeHtml = ``
  switch (code) {
    case 0:
      codeHtml += `<div title="验证通过" class="status status-ok"><i class="icon icon-check-circle"></i></div>`
      break
    case 400:
      codeHtml += `<div title="请求异常" class="status status-ko"><i class="icon icon-close-circle"></i></div>`
      break
    case 1:
      codeHtml += `<div title="验证失败" class="status status-warning"><i class="icon icon-warning-circle"></i></div>`
      break
    default:
      codeHtml += `<div title="验证通过" class="status status-warning"><i class="icon icon-warning-circle"></i></div>`
      break
  }
  return codeHtml
}
