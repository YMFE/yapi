const yapi = require('../yapi.js');
const baseController = require('./base.js');

class interfaceColController extends baseController{
    constructor(ctx) {
        super(ctx);
    }

    /**
     * 测试 get
     * @interface /test/get
     * @method GET
     * @returns {Object}
     * @example
     */
    async testGet(ctx){
        try {
            let query = ctx.query;
            ctx.body = yapi.commons.resReturn(query);
        } catch (e) {
            ctx.body = yapi.commons.resReturn(null, 402, e.message);
        }
    }

    async testHttpCode(ctx){
        let params = ctx.request.body;
        ctx.status = +ctx.query.code || 200;
        ctx.body = yapi.commons.resReturn(params);
    }

    /**
     * 测试 post
     * @interface /test/post
     * @method POST
     * @returns {Object}
     * @example
     */
    async testPost(ctx){
        try{
            let params = ctx.request.body;
            ctx.body = yapi.commons.resReturn(params);

        }catch(e){
            ctx.body = yapi.commons.resReturn(null, 402, e.message);
        }
    }

    /**
     * 测试 单文件上传
     * @interface /test/single/upload
     * @method POST
     * @returns {Object}
     * @example
     */
    async testSingleUpload(ctx){
        try{
            let params = ctx.request.body;
            ctx.body = yapi.commons.resReturn({res: '上传成功'});

        }catch(e){
            ctx.body = yapi.commons.resReturn(null, 402, e.message);
        }
    }

    /**
     * 测试 文件上传
     * @interface /test/files/upload
     * @method POST
     * @returns {Object}
     * @example
     */
    async testFilesUpload(ctx){
        try{
            let params = ctx.request.body;
            ctx.body = yapi.commons.resReturn({res: '上传成功'});

        }catch(e){
            ctx.body = yapi.commons.resReturn(null, 402, e.message);
        }
    }

    /**
     * 测试 put
     * @interface /test/put
     * @method PUT
     * @returns {Object}
     * @example
     */
    async testPut(ctx){
        try{
            let params = ctx.request.body;
            ctx.body = yapi.commons.resReturn(params);

        }catch(e){
            ctx.body = yapi.commons.resReturn(null, 402, e.message);
        }
    }

    /**
     * 测试 delete
     * @interface /test/delete
     * @method DELETE
     * @returns {Object}
     * @example
     */
    async testDelete(ctx){
        try{
            let params = ctx.request.body;
            ctx.body = yapi.commons.resReturn(params);

        }catch(e){
            ctx.body = yapi.commons.resReturn(null, 402, e.message);
        }
    }

    /**
     * 测试 head
     * @interface /test/head
     * @method HEAD
     * @returns {Object}
     * @example
     */
    async testHead(ctx){
        try{
            let query = ctx.query;
            ctx.body = yapi.commons.resReturn(query);

        }catch(e){
            ctx.body = yapi.commons.resReturn(null, 402, e.message);
        }
    }

    /**
     * 测试 options
     * @interface /test/options
     * @method OPTIONS
     * @returns {Object}
     * @example
     */
    async testOptions(ctx){
        try{
            let query = ctx.query;
            ctx.body = yapi.commons.resReturn(query);

        }catch(e){
            ctx.body = yapi.commons.resReturn(null, 402, e.message);
        }
    }

    /**
     * 测试 patch
     * @interface /test/patch
     * @method PATCH
     * @returns {Object}
     * @example
     */
    async testPatch(ctx){
        try{
            let params = ctx.request.body;
            ctx.body = yapi.commons.resReturn(params);

        }catch(e){
            ctx.body = yapi.commons.resReturn(null, 402, e.message);
        }
    }


}

module.exports = interfaceColController
