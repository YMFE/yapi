
const yapi = require('yapi.js')
const mongoose = require('mongoose');
const controller = require('./controller');


module.exports = function () {

    yapi.connect.then(function () {
        let Col = mongoose.connection.db.collection('wiki');
        Col.createIndex({
            project_id: 1
        })

    });

    this.bindHook('add_router', function (addRouter) {
        addRouter({
            controller: controller,
            method: 'get',
            path: 'wiki_desc/get',
            action: 'getWikiDesc'
        })

        addRouter({
            controller: controller,
            method: 'post',
            path: 'wiki_desc/up',
            action: 'uplodaWikiDesc'
        })
        // addRouter({
        //   controller: controller,
        //   method: 'get',
        //   path: 'statismock/get_system_status',
        //   action: 'getSystemStatus'
        // })
        // addRouter({
        //     controller: controller,
        //     method: 'get',
        //     path: 'statismock/group_data_statis',
        //     action: 'groupDataStatis'
        // })


    })
};