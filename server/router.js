import koaRouter from 'koa-router'   
import interfaceController from './controllers/interface'

let router = koaRouter();

const interface_PREFIX = {
    interface: '/interface/',
    user: '/user/'
};

router.get ( interface_PREFIX.interface + 'add', interfaceController.add)
      .get ( interface_PREFIX.interface + 'list', interfaceController.list)




module.exports = router