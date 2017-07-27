import path from 'path'
import fs from 'fs-extra'
import config from '../config.js'

fs.ensureDirSync( path.join(path.resolve(__dirname, '../../'), 'runtime') );
let configPath =  path.join(path.resolve(__dirname, '../../'), 'runtime', 'config.json') 

fs.writeFileSync(configPath,
  JSON.stringify(config, null, "\t"),
  {encoding: 'utf8'}
)