module.exports = `<style>
h1,
h2,
h3,
h4,
h5,
h6,
p,
blockquote {
    margin: 0;
    padding: 0;
}
body {
    font-family: "Helvetica Neue", Helvetica, "Hiragino Sans GB", Arial, sans-serif;
    font-size: 15px;
    line-height: 25px;
    color: #393838;
    background-color: white;
    margin: 10px 13px 10px 13px;
    position: relative;
    padding: 0 60px 30px;
    overflow-x: hidden;
}
table {
    margin: 10px 0 15px 0;
    border-collapse: collapse;
}
td,th { 
    border: 1px solid #ddd;
    padding: 3px 10px;
}
th {
    padding: 5px 10px;  
}

a {
    color: #34495e;
}
a:hover {
    color: #42b983;
    text-decoration: none;
}
a img {
    border: none;
}
p {
    padding-left: 10px;
    margin-bottom: 9px;
}
h1,
h2,
h3,
h4,
h5,
h6 {
    color: #404040;
    line-height: 36px;
}
h1 {
    color: #2c3e50;
    font-weight: 600;
    margin-top: 35px;
    font-size: 42px;
    padding-bottom: 16px;
    border-bottom: 1px solid #ddd;
    line-height: 50px;
}
h2 {
    font-size: 28px;
    padding-top: 10px;
    padding-bottom: 10px;
}



h3 {
    clear: both;
    font-weight: 400;
    margin-top: 20px;
    margin-bottom: 20px;
    border-left: 3px solid #42b983;
    padding-left: 8px;
    font-size: 18px;
}
h4 {
    font-size: 16px;
}
h5 {
    font-size: 14px;
}
h6 {
    font-size: 13px;
}
hr {
    margin: 0 0 19px;
    border: 0;
    border-bottom: 1px solid #ccc;
}
blockquote {
    padding: 13px 13px 21px 15px;
    margin-bottom: 18px;
    font-family:georgia,serif;
    font-style: italic;
}
blockquote:before {
    font-size:40px;
    margin-left:-10px;
    font-family:georgia,serif;
    color:#eee;
}
blockquote p {
    font-size: 14px;
    font-weight: 300;
    line-height: 18px;
    margin-bottom: 0;
    font-style: italic;
}
code, pre {
    font-family: Monaco, Andale Mono, Courier New, monospace;
}
code {
    background-color: #fee9cc;
    color: rgba(0, 0, 0, 0.75);
    padding: 1px 3px;
    font-size: 12px;
    -webkit-border-radius: 3px;
    -moz-border-radius: 3px;
    border-radius: 3px;
}
pre {
    display: block;
    padding: 14px;
    margin: 0 0 18px;
    line-height: 16px;
    font-size: 11px;
    border: 1px solid #d9d9d9;
    white-space: pre-wrap;
    word-wrap: break-word;
    background:#f6f6f6;
}
pre code {
    background-color: #f6f6f6;
    color:#737373;
    font-size: 11px;
    padding: 0;
}
sup {
    font-size: 0.83em;
    vertical-align: super;
    line-height: 0;
}
* {
    -webkit-print-color-adjust: exact;
}

@media print {
    body,code,pre code,h1,h2,h3,h4,h5,h6 {
        color: black;
    }
    table, pre {
        page-break-inside: avoid;
    }
}
html,body{
    height: 100%;
}
.table-of-contents{
    top: 61px;
    left: 0;
    bottom: 0;
    overflow-x: hidden;
    overflow-y: auto;
    width: 260px;
}

.table-of-contents ul{
    position: fixed;
    overflow: auto;
    margin: 0px;
    height: 100%;
    padding: 0px 0px;
    box-sizing: border-box;
    list-style-type: none;
}
.table-of-contents ul li{
    padding-left: 20px;
}
.table-of-contents ul:before{
    content: "YAPI 接口文档";
    font-size: 26px;
    line-height: 80px;
    margin: 30px;
    text-align: center;
}

.table-of-contents a{
    padding: 2px 0px;
    display: block;
    text-decoration: none;
}

.content-right{
    position: relative;
    max-width: 700px;
    margin-left: 290px;
    padding-left: 50px;
}

body>p{
    margin-left: 30px;
}
body>table{
    margin-left: 30px;
}
body>pre{
    margin-left: 30px;
}
.curProject{
    position: fixed;
    top:20px;
    font-size:25px;
    color:black;
    margin-left:-240px;
    width:240px;
    padding:5px;
    line-height:25px;
    box-sizing:border-box;
}

</style>`