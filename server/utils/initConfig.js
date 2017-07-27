import path from 'path';
import fs from 'fs-extra';
import config from '../config.js';

let runtimePath = config.runtime_path;
fs.ensureDirSync( runtimePath );
fs.ensureDirSync( path.join(runtimePath, 'log'));
let configPath =  path.join(runtimePath, 'config.json') 

fs.writeFileSync(configPath,
  JSON.stringify(config, null, '\t'),
  { encoding: 'utf8' }
);