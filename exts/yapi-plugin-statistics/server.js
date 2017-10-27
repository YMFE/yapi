/**
 * Created by gxl.gao on 2017/10/24.
 */
const yapi = require('yapi.js')
const mongoose = require('mongoose');
const controller = require('./controller');
const statisModel = require('./statisMockModel.js');
const commons = require('./util.js');

module.exports = function () {

    yapi.connect.then(function () {
        let Col = mongoose.connection.db.collection('statis_mock');
        Col.createIndex({
            interface_id: 1
        })
        Col.createIndex({
            project_id: 1
        })
        Col.createIndex({
            group_id: 1
        })
        Col.createIndex({
            time: 1
        })

    });

    this.bindHook('add_router', function (addRouter) {
        addRouter({
            controller: controller,
            method: 'get',
            path: 'statismock/count',
            action: 'getStatisCount'
        })

        addRouter({
            controller: controller,
            method: 'get',
            path: 'statismock/get',
            action: 'getMockDateList'
        })
    })

    // MockServer生成mock数据后触发
    this.bindHook('mock_after', async function (context) {

        // console.log('context', context);
        let interfaceId = context.interfaceData._id;
        let projectId = context.projectData._id;
        let groupId = context.projectData.group_id;
        let ip = context.ctx.originalUrl;
        // let date = commons.formatYMD(new Date());

        let data = {
            interface_id: interfaceId,
            project_id: projectId,
            group_id: groupId,
            time: yapi.commons.time(),
            ip: ip,
            date: commons.formatYMD(new Date())
        };
        let inst = yapi.getInst(statisModel);

        try {
            let result = await inst.save(data);
            result = yapi.commons.fieldSelect(result, ['interface_id', 'project_id', 'group_id', 'time', 'ip', 'date']);
            console.log('result', result);
        } catch (e) {
            console.log('mockStatisError', e);
        }
    })
};