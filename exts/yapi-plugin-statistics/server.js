/**
 * Created by gxl.gao on 2017/10/24.
 */
const yapi = require('yapi.js')
const mongoose = require('mongoose');
const controller = require('./controller');

module.exports = function(){

    yapi.connect.then(function () {
        let Col = mongoose.connection.db.collection('statis_mock');
        Col.createIndex({
            interface_id: 1
        })
        Col.createIndex({
            project_id: 1
        })

    });

    this.bindHook('add_router', function(addRouter) {
        addRouter({
            controller: controller,
            method: 'get',
            path: 'statismock/get',
            action: 'getStatisMock'
        })
    })

};