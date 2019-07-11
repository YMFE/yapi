const shell = require ('shelljs');
const packageJson = require ('./package.json');

const version = "v" + packageJson.version;

if(!version){
  console.error('version 不能为空')
  process.exit(1)
}

shell.exec ('npm install --registry https://registry.npm.taobao.org');
shell.exec ('npm run build-client');
shell.exec ('git add .');
shell.exec ('git commit -a -m "chore: update static file"');

console.log ('exec: git pull origin master');
shell.exec ('git pull origin master');
let a = shell.exec (`git tag |grep ${version} |wc -l`);
if (a && parseInt (a) > 0) {
  shell.exec ('git tag -d ' + version);
  shell.exec ('git push origin :' + version);
}
shell.exec ('git tag ' + version);
shell.exec ('git push origin ' + version);

console.log('git push success', version)

console.log('正在执行npm发布')
shell.exec('npm publish')
