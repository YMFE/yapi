import { resReturn,log } from '../utils/commons';
import interfaceModel from '../models/interface.js'

module.exports = {
    async add(ctx) {
        let data = {
            title: 'yapi',
            content: 'content',
            uid: 'abc'
        }
        let result = await interfaceModel.save(data);
        log('interface err...', 'error');
        ctx.body = resReturn(result)
    },

    async list(ctx) {
        let data = interfaceModel.find();
        ctx.body = 1;
    }
}
