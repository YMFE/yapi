import koaRouter from 'koa-router'
import interfaceController from './controllers/interface.js'
import groupController from './controllers/group.js'
import userController from './controllers/user.js'

const router = koaRouter();

const INTERFACE_PREFIX = {
    interface: '/interface/',
    user: '/user/',
    group: '/group/'
};

router.post ( INTERFACE_PREFIX.interface + 'add', interfaceController.add)
      .get ( INTERFACE_PREFIX.interface + 'list', interfaceController.list)
      .get ( INTERFACE_PREFIX.group + 'list', groupController.list)
      .post ( INTERFACE_PREFIX.group + 'add', groupController.add)
      .post ( INTERFACE_PREFIX.group + 'up', groupController.up)
      .post ( INTERFACE_PREFIX.group + 'del', groupController.del)
      .get (INTERFACE_PREFIX.user + 'list', userController.list)
      .post (INTERFACE_PREFIX.user + 'add', userController.add)
      .post(INTERFACE_PREFIX.user + 'up', userController.up)
      .post(INTERFACE_PREFIX.user + 'del', userController.del)

module.exports = router