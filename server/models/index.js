// @index('./*', f => `exports.${f.name}Model = require('${f.path}');`)
exports.avatarModel = require('./avatar');
exports.baseModel = require('./base');
exports.followModel = require('./follow');
exports.groupModel = require('./group');
exports.importDataCronJobModel = require('./importDataCronJob');
exports.interfaceModel = require('./interface');
exports.interfaceCaseModel = require('./interfaceCase');
exports.interfaceCatModel = require('./interfaceCat');
exports.interfaceColModel = require('./interfaceCol');
exports.logModel = require('./log');
exports.projectModel = require('./project');
exports.storageModel = require('./storage');
exports.tokenModel = require('./token');
exports.userModel = require('./user');
