const defaultTheme = require('./defaultTheme.js');

function json_format(json) {
  if (json && typeof json === 'object') {
    return JSON.stringify(json, null, '   ');
  }
  return json;
}

module.exports = function renderToHtml(reports) {
  let tp = createHtml(reports);
  return tp;
};

function createHtml(reports) {
  let mdTemplate = ``;
  let left = ``;
  reports.list.map((item, index) => {
    mdTemplate += baseHtml(index, item.name, item.path, item.status);
    mdTemplate += validHtml(item.validRes);
    mdTemplate += requestHtml(item.url, item.headers, item.data);
    mdTemplate += reponseHtml(item.res_header, item.res_body);
    left += leftHtml(index, item.name, item.code);
    // left += codeHtml(item.code);
  });
  return createHtml5(left, mdTemplate, reports.message, reports.runTime);
}

function createHtml5(left, tp, msg, runTime) {
  let message = ``;
  if (msg.failedNum === 0) {
    message += `<div>一共 <span class="success">${
      msg.successNum
    }</span> 测试用例， 全部验证通过(${runTime})</div>`;
  } else {
    message += `<div>一共 ${msg.len} 测试用例，<span class="success"> ${
      msg.successNum
    }</span> 个验证通过， ${msg.failedNum} 个未通过(${runTime})</div>`;
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
      <a href="#" style="display: inherit;"><svg class="svg" width="32px" height="32px" viewBox="0 0 64 64" version="1.1"><title>Icon</title><desc>Created with Sketch.</desc><defs><linearGradient x1="50%" y1="0%" x2="50%" y2="100%" id="linearGradient-1"><stop stop-color="#FFFFFF" offset="0%"></stop><stop stop-color="#F2F2F2" offset="100%"></stop></linearGradient><circle id="path-2" cx="31.9988602" cy="31.9988602" r="2.92886048"></circle><filter x="-85.4%" y="-68.3%" width="270.7%" height="270.7%" filterUnits="objectBoundingBox" id="filter-3"><feOffset dx="0" dy="1" in="SourceAlpha" result="shadowOffsetOuter1"></feOffset><feGaussianBlur stdDeviation="1.5" in="shadowOffsetOuter1" result="shadowBlurOuter1"></feGaussianBlur><feColorMatrix values="0 0 0 0 0   0 0 0 0 0   0 0 0 0 0  0 0 0 0.159703351 0" type="matrix" in="shadowBlurOuter1"></feColorMatrix></filter></defs><g id="首页" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd"><g id="大屏幕"><g id="Icon"><circle id="Oval-1" fill="url(#linearGradient-1)" cx="32" cy="32" r="32"></circle><path d="M36.7078009,31.8054514 L36.7078009,51.7110548 C36.7078009,54.2844537 34.6258634,56.3695395 32.0579205,56.3695395 C29.4899777,56.3695395 27.4099998,54.0704461 27.4099998,51.7941246 L27.4099998,31.8061972 C27.4099998,29.528395 29.4909575,27.218453 32.0589004,27.230043 C34.6268432,27.241633 36.7078009,29.528395 36.7078009,31.8054514 Z" id="blue" fill="#2359F1" fill-rule="nonzero"></path><path d="M45.2586091,17.1026914 C45.2586091,17.1026914 45.5657231,34.0524383 45.2345291,37.01141 C44.9033351,39.9703817 43.1767091,41.6667796 40.6088126,41.6667796 C38.040916,41.6667796 35.9609757,39.3676862 35.9609757,37.0913646 L35.9609757,17.1034372 C35.9609757,14.825635 38.0418959,12.515693 40.6097924,12.527283 C43.177689,12.538873 45.2586091,14.825635 45.2586091,17.1026914 Z" id="green" fill="#57CF27" fill-rule="nonzero" transform="translate(40.674608, 27.097010) rotate(60.000000) translate(-40.674608, -27.097010) "></path><path d="M28.0410158,17.0465598 L28.0410158,36.9521632 C28.0410158,39.525562 25.9591158,41.6106479 23.3912193,41.6106479 C20.8233227,41.6106479 18.7433824,39.3115545 18.7433824,37.035233 L18.7433824,17.0473055 C18.7433824,14.7695034 20.8243026,12.4595614 23.3921991,12.4711513 C25.9600956,12.4827413 28.0410158,14.7695034 28.0410158,17.0465598 Z" id="red" fill="#FF561B" fill-rule="nonzero" transform="translate(23.392199, 27.040878) rotate(-60.000000) translate(-23.392199, -27.040878) "></path><g id="inner-round"><use fill="black" fill-opacity="1" filter="url(#filter-3)" xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#path-2"></use><use fill="#F7F7F7" fill-rule="evenodd" xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#path-2"></use></g></g></g></g></svg></a>
      <a href="#"><h1 class="title">YAPI 测试结果文档</h1></a>
      <div class="nav">
        <a href="https://yapi.ymfe.org/">YApi</a>
      </div>
    </div>
    <div class="g-doc">
      <div class="menu-left">
        ${left}
      </div>
      <div id="right" class="content-right">
      <h1>YApi 测试报告</h1>
      <div class="summary">${message}</div>
      ${tp}
        <footer class="m-footer">
          <p>Build by <a href="https://ymfe.org/">YMFE</a>.</p>
        </footer>
      </div>
    </div>
  </body>
  </html>
  `;
  return html;
}

function requestHtml(url, headers, params) {
  headers = json_format(headers, null, '   ');
  params = json_format(params);
  let html = ``;
  html += `
  <div>
    <h3>Request</h3>
    <div class="row case-report">
     <div class="col-3 case-report-title">Url</div>
     <div class="col-21">${url}</div>
    </div>`;
  html += headers
    ? `<div class="row case-report">
    <div class="col-3 case-report-title">Headers</div>
    <div class="col-21">
     <pre>${headers}</pre>
    </div>
   </div>`
    : ``;

  html += params
    ? ` <div class="row case-report">
   <div class="col-3 case-report-title">Body</div>
   <div class="col-21">
    <pre>${params}</pre>
   </div>
   </div>`
    : ``;
  html += `</div>`;

  return html;
}

function reponseHtml(res_header, res_body) {
  res_header = json_format(res_header, null, '   ');
  res_body = json_format(res_body, null, '   ');
  let html = ``;
  html += `<div><h3>Reponse</h3>`;

  html += res_header
    ? `
  <div class="row case-report">
   <div class="col-3 case-report-title">Headers</div>
   <div class="col-21">
    <pre>${res_header}</pre>
   </div>
  </div>`
    : ``;

  html += res_body
    ? ` <div class="row case-report">
  <div class="col-3 case-report-title">Body</div>
  <div class="col-21">
   <pre>${res_body}</pre>
  </div>
 </div>`
    : ``;

  html += `</div>`;

  return html;
}

function validHtml(validRes) {
  if (validRes && Array.isArray(validRes)) {
    validRes = validRes.map((item, index) => {
      return `<div key=${index}>${item.message}</div>`;
    });
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
  
  `;

  return html;
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
  `;

  return html;
}

function leftHtml(index, name, code) {
  let html = `
  <div class="list-content">
    <a class="list" href="#${index}">${name}</a>
    ${codeHtml(code)}
  </div>
  `;

  return html;
}

function codeHtml(code) {
  let codeHtml = ``;
  switch (code) {
    case 0:
      codeHtml += `<div title="验证通过" class="status status-ok"><i class="icon icon-check-circle"></i></div>`;
      break;
    case 400:
      codeHtml += `<div title="请求异常" class="status status-ko"><i class="icon icon-close-circle"></i></div>`;
      break;
    case 1:
      codeHtml += `<div title="验证失败" class="status status-warning"><i class="icon icon-warning-circle"></i></div>`;
      break;
    default:
      codeHtml += `<div title="验证通过" class="status status-warning"><i class="icon icon-warning-circle"></i></div>`;
      break;
  }
  return codeHtml;
}
