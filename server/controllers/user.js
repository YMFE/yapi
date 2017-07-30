import userModel from '../models/user.js';
import yapi from '../yapi.js';
import baseController from './base.js';
import request from 'request';
import common from '../utils/commons.js';

import interfaceModel from '../models/interface.js'
import groupModel from '../models/group.js'
import projectModel from '../models/project.js'

const jwt = require('jsonwebtoken');

class userController extends baseController {
    constructor(ctx) {
        super(ctx);
        this.Model = yapi.getInst(userModel);
    }
    /**
     * 用户登录接口
     * @interface /user/login
     * @method POST
     * @category user
     * @foldnumber 10
     * @param {String} email email名称，不能为空
     * @param  {String} password 密码，不能为空
     * @returns {Object} 
     * @example ./api/user/login.json
     */
    async login(ctx) {   //登录
        let userInst = yapi.getInst(userModel); //创建user实体
        let email = ctx.request.body.email;
        let password = ctx.request.body.password;

        if (!email) {
            return ctx.body = yapi.commons.resReturn(null, 400, 'email不能为空');
        }
        if (!password) {
            return ctx.body = yapi.commons.resReturn(null, 400, '密码不能为空');
        }

        let result = await userInst.findByEmail(email);


        if (!result) {
            return ctx.body = yapi.commons.resReturn(null, 404, '该用户不存在');
        } else if (yapi.commons.generatePassword(password, result.passsalt) === result.password) {
            this.setLoginCookie(result._id, result.passsalt);

            return ctx.body = yapi.commons.resReturn({
                username: result.username,
                uid: result._id,
                email: result.email,
                add_time: result.add_time,
                up_time: result.up_time,
                server_ip: yapi.WEBCONFIG.server_ip

            }, 0, 'logout success...');
        } else {
            return ctx.body = yapi.commons.resReturn(null, 405, '密码错误');
        }
    }

    /**
     * 退出登录接口
     * @interface /user/logout
     * @method GET
     * @category user
     * @foldnumber 10
     * @returns {Object} 
     * @example ./api/user/logout.json
     */

    async logout(ctx) {
        ctx.cookies.set('_yapi_token', null);
        ctx.cookies.set('_yapi_uid', null);
        ctx.body = yapi.commons.resReturn('ok');
    }


    /**
     *  第三方登录需要提供一个request方法和 token字段，暂时只支持qunar第三方
     * @return {email: String, username: String}
     */
    thirdQunarLogin() {
        return {
            request: (token) => {
                return new Promise((resolve, reject) => {
                    request('http://qsso.corp.qunar.com/api/verifytoken.php?token=' + token, function (error, response, body) {
                        if (!error && response.statusCode == 200) {
                            let result = JSON.parse(body);
                            if (result && result.ret === true) {
                                let ret = {
                                    email: result.userId + '@qunar.com',
                                    username: result.data.userInfo.name
                                };
                                resolve(ret);
                            } else {
                                reject(result);
                            }
                        }
                        reject(error);
                    });
                });
            },
            tokenField: 'token'
        };
    }

    async loginByToken(ctx) {
        let config = this.thirdQunarLogin();
        let token = ctx.request.body[config.tokenField] || ctx.request.query[config.tokenField];

        try {
            let ret = await config.request(token);
            let login = await this.handleThirdLogin(ret.email, ret.username);

            if (login === true) {
                yapi.commons.log('login success');
                ctx.redirect('/');
            }
        } catch (e) {
            yapi.commons.log(e.message, 'error');
            ctx.redirect('/');
        }
    }

    async handleThirdLogin(email, username) {
        let user, data, passsalt;
        let userInst = yapi.getInst(userModel);

        try {
            user = await userInst.findByEmail(email);

            if (!user || !user._id) {
                passsalt = yapi.commons.randStr();
                data = {
                    username: username,
                    password: yapi.commons.generatePassword(passsalt, passsalt),
                    email: email,
                    passsalt: passsalt,
                    role: 'member',
                    add_time: yapi.commons.time(),
                    up_time: yapi.commons.time()
                };
                user = await userInst.save(data);
                yapi.commons.sendMail({
                    to: email,
                    contents: `<h3>亲爱的用户：</h3><p>您好，感谢使用YApi,系统检测您是第一次用Qsso账号登录YApi服务,您的Email是： ${email} ，初始化密码为：${passsalt}</p>`
                });
            }

            this.setLoginCookie(user._id, user.passsalt);
            return true;
        } catch (e) {
            console.error('third_login:', e.message); // eslint-disable-line
            return false;
        }
    }

    /**
     * 修改用户密码
     * @interface /user/change_password
     * @method POST
     * @category user
     * @param {Number} uid 用户ID
     * @param {Number} [old_password] 旧密码, 非admin用户必须传
     * @param {Number} password 新密码
     * @return {Object}
     * @example ./api/user/change_password.json
     */
    async changePassword(ctx) {
        let params = ctx.request.body;
        let userInst = yapi.getInst(userModel);

        if (!params.uid) {
            return ctx.body = yapi.commons.resReturn(null, 400, 'uid不能为空');
        }

        if (!params.password) {
            return ctx.body = yapi.commons.resReturn(null, 400, '密码不能为空');
        }


        if (this.getRole() !== 'admin' && params.uid != this.getUid()) {
            return ctx.body = yapi.commons.resReturn(null, 402, '没有权限');
        }
        if (this.getRole() !== 'admin') {
            if (!params.old_password) {
                return ctx.body = yapi.commons.resReturn(null, 400, '旧密码不能为空');
            }

            let user = await userInst.findById(params.uid);
            if (yapi.commons.generatePassword(params.old_password, user.passsalt) !== user.password) {
                return ctx.body = yapi.commons.resReturn(null, 402, '旧密码错误');
            }
        }

        let passsalt = yapi.commons.randStr();
        let data = {
            up_time: yapi.commons.time(),
            password: yapi.commons.generatePassword(params.password, passsalt),
            passsalt: passsalt
        };
        try {
            let result = await userInst.update(params.uid, data);
            ctx.body = yapi.commons.resReturn(result);
        } catch (e) {
            ctx.body = yapi.commons.resReturn(null, 401, e.message);
        }
    }

    async forgetPassword() { }

    async resetPassword() { }

    setLoginCookie(uid, passsalt) {
        let token = jwt.sign({ uid: uid }, passsalt, { expiresIn: '7 days' });

        this.ctx.cookies.set('_yapi_token', token, {
            expires: yapi.commons.expireDate(7),
            httpOnly: true
        });
        this.ctx.cookies.set('_yapi_uid', uid, {
            expires: yapi.commons.expireDate(7),
            httpOnly: true
        });
    }

    /**
     * 用户注册接口
     * @interface /user/reg
     * @method POST
     * @category user
     * @foldnumber 10
     * @param {String} email email名称，不能为空
     * @param  {String} password 密码，不能为空
     * @param {String} [username] 用户名
     * @returns {Object} 
     * @example ./api/user/login.json
     */
    async reg(ctx) {  //注册
        let userInst = yapi.getInst(userModel);
        let params = ctx.request.body; //获取请求的参数,检查是否存在用户名和密码

        params = yapi.commons.handleParams(params, {
            username: 'string',
            password: 'string',
            email: 'string'
        });

        if (!params.email) {
            return ctx.body = yapi.commons.resReturn(null, 400, '邮箱不能为空');
        }

        if (!params.password) {
            return ctx.body = yapi.commons.resReturn(null, 400, '密码不能为空');
        }

        let checkRepeat = await userInst.checkRepeat(params.email);//然后检查是否已经存在该用户

        if (checkRepeat > 0) {
            return ctx.body = yapi.commons.resReturn(null, 401, '该email已经注册');
        }

        let passsalt = yapi.commons.randStr();
        let data = {
            username: params.username,
            password: yapi.commons.generatePassword(params.password, passsalt),//加密
            email: params.email,
            passsalt: passsalt,
            role: 'member',
            add_time: yapi.commons.time(),
            up_time: yapi.commons.time()
        };

        if (!data.username) {
            data.username = data.email.substr(0, data.email.indexOf('@'));
        }

        try {
            let user = await userInst.save(data);

            this.setLoginCookie(user._id, user.passsalt);
            ctx.body = yapi.commons.resReturn({
                uid: user._id,
                email: user.email,
                username: user.username,
                add_time: user.add_time,
                up_time: user.up_time,
                role: 'member'
            });
            yapi.commons.sendMail({
                to: user.email,
                contents: `<h3>亲爱的用户：</h3><p>您好，感谢使用YApi,您的账号 ${params.email} 已经注册成功</p>`
            });
        } catch (e) {
            ctx.body = yapi.commons.resReturn(null, 401, e.message);
        }
    }

    /**
     * 获取用户列表
     * @interface /user/list
     * @method GET
     * @category user
     * @foldnumber 10
     * @param {Number} [page] 分页页码
     * @param {Number} [limit] 分页大小,默认为10条
     * @returns {Object} 
     * @example 
     */
    async list(ctx) {
        let page = ctx.request.query.page || 1,
            limit = ctx.request.query.limit || 10;

        const userInst = yapi.getInst(userModel);
        try {
            let user = await userInst.listWithPaging(page, limit);
            let count = await userInst.listCount();
            return ctx.body = yapi.commons.resReturn({
                total: Math.ceil(count / limit),
                list: user
            });
        } catch (e) {
            return ctx.body = yapi.commons.resReturn(null, 402, e.message);
        }
    }

    /**
     * 获取用户个人信息
     * @interface /user/find
     * @method GET
     * @param id 用户uid
     * @category user
     * @foldnumber 10
     * @returns {Object} 
     * @example 
     */
    async findById(ctx) {    //根据id获取用户信息
        try {
            let userInst = yapi.getInst(userModel);
            let id = ctx.request.query.id;

            if (!id) {
                return ctx.body = yapi.commons.resReturn(null, 400, 'uid不能为空');
            }

            let result = await userInst.findById(id);

            if (!result) {
                return ctx.body = yapi.commons.resReturn(null, 402, '不存在的用户');
            }

            return ctx.body = yapi.commons.resReturn({
                uid: result._id,
                username: result.username,
                email: result.email,
                role: result.role,
                add_time: result.add_time,
                up_time: result.up_time
            });
        } catch (e) {
            return ctx.body = yapi.commons.resReturn(null, 402, e.message);
        }
    }

    /**
     * 删除用户,只有admin用户才有此权限
     * @interface /user/del
     * @method POST
     * @param id 用户uid
     * @category user
     * @foldnumber 10
     * @returns {Object} 
     * @example 
     */
    async del(ctx) {   //根据id删除一个用户
        try {
            if (this.getRole() !== 'admin') {
                return ctx.body = yapi.commons.resReturn(null, 402, 'Without permission.');
            }

            let userInst = yapi.getInst(userModel);
            let id = ctx.request.body.id;

            if (!id) {
                return ctx.body = yapi.commons.resReturn(null, 400, 'uid不能为空');
            }

            let result = await userInst.del(id);

            ctx.body = yapi.commons.resReturn(result);
        } catch (e) {
            ctx.body = yapi.commons.resReturn(null, 402, e.message);
        }
    }

    /**
     * 更新用户个人信息
     * @interface /user/update
     * @method POST
     * @param uid  用户uid
     * @param [role] 用户角色,只有管理员有权限修改
     * @param [username] String
     * @param [email] String
     * @category user
     * @foldnumber 10
     * @returns {Object} 
     * @example 
     */
    async update(ctx) {    //更新用户信息
        try {
            let params = ctx.request.body;

            params = yapi.commons.handleParams(params, {
                username: 'string',
                email: 'string'
            });

            if (this.getRole() !== 'admin' && params.uid != this.getUid()) {
                return ctx.body = yapi.commons.resReturn(null, 401, '没有权限');
            }

            let userInst = yapi.getInst(userModel);
            let id = params.uid;

            if (!id) {
                return ctx.body = yapi.commons.resReturn(null, 400, 'uid不能为空');
            }

            let data = {
                up_time: yapi.commons.time()
            };

            if (this.getRole() === 'admin') {
                params.role && (data.role = params.role);
            }

            params.username && (data.username = params.username);
            params.email && (data.email = params.email);

            if (data.email) {
                var checkRepeat = await userInst.checkRepeat(data.email);//然后检查是否已经存在该用户
                if (checkRepeat > 0) {
                    return ctx.body = yapi.commons.resReturn(null, 401, '该email已经注册');
                }
            }

            let result = await userInst.update(id, data);

            ctx.body = yapi.commons.resReturn(result);
        } catch (e) {
            ctx.body = yapi.commons.resReturn(null, 402, e.message);
        }
    }

    /**
     * 模糊搜索用户名或者email
     * @interface /user/search
     * @method GET
     * @category user
     * @foldnumber 10
     * @param {String} q
     * @return {Object}
     * @example ./api/user/search.json
    */
    async search(ctx) {
        const { q } = ctx.request.query;

        if (!q) {
            return ctx.body = yapi.commons.resReturn(void 0, 400, 'No keyword.');
        }

        if (!yapi.commons.validateSearchKeyword(q)) {
            return ctx.body = yapi.commons.resReturn(void 0, 400, 'Bad query.');
        }

        let queryList = await this.Model.search(q);
        let rules = [
            {
                key: '_id',
                alias: 'uid'
            },
            'username',
            'email',
            'role',
            {
                key: 'add_time',
                alias: 'addTime'
            },
            {
                key: 'up_time',
                alias: 'upTime'
            }
        ];

        let filteredRes = common.filterRes(queryList, rules);
        console.log(queryList); // eslint-disable-line

        return ctx.body = yapi.commons.resReturn(filteredRes, 0, 'ok');
    }

    /**
     * 根据路由id获取面包屑数据
     * @interface /user/nav
     * @method GET
     * @category user
     * @foldnumber 10
     * @param {String} type 可选group|interface|project
     * @param {Number} id   
     * @return {Object}
     * @example ./api/user/nav.json
    */
    async nav(ctx) {
        let { id, type } = ctx.request.query;
        let result = {};
        try {
            if (type === 'interface') {
                let interfaceInst = yapi.getInst(interfaceModel);
                let interfaceData = await interfaceInst.get(id)
                result["interface_id"] = interfaceData._id;
                result["interface_name"] = interfaceData.path;
                type = 'project';
                id = interfaceData.project_id;
            }

            if (type === 'project') {
                let projectInst = yapi.getInst(projectModel);
                let projectData = await projectInst.get(id);
                result["project_id"] = projectData._id;
                result["project_name"] = projectData.prd_host + projectData.basepath;
                type = 'group';
                id = projectData.group_id
            }

            if (type === 'group') {
                let groupInst = yapi.getInst(groupModel);
                let groupData = await groupInst.get(id);
                result["group_id"] = groupData._id;
                result["group_name"] = groupData.group_name;
            }

            return ctx.body = yapi.commons.resReturn(result)
        }
        catch (e) {
            return ctx.body = yapi.commons.resReturn(result, 422, e.message)
        }
    }

}

module.exports = userController;