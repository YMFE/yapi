const userController = require('controllers/user.js')
const userModel = require('models/user.js')
const yapi = require('yapi.js')

class fineUserController extends userController {
  constructor(ctx) {
    super(ctx)
  }

  /**
   * 添加新用户
   * @param {*} ctx
   */
  async add(ctx) {
    try {
      if (this.getRole() !== 'admin') {
        return (ctx.body = yapi.commons.resReturn(
          null,
          402,
          'Without permission.',
        ))
      }

      let userInst = yapi.getInst(userModel)
      let params = ctx.request.body //获取请求的参数,检查是否存在用户名和密码

      params = yapi.commons.handleParams(params, {
        email: 'string',
      })

      if (!params.email) {
        return (ctx.body = yapi.commons.resReturn(null, 400, '邮箱不能为空'))
      }

      let checkRepeat = await userInst.checkRepeat(params.email) //然后检查是否已经存在该用户

      if (checkRepeat > 0) {
        return (ctx.body = yapi.commons.resReturn(null, 401, '该email已经注册'))
      }

      let password = params.is_random ? yapi.commons.randStr() : '123456',
        passsalt = yapi.commons.randStr()
      let data = {
        username: params.email.substr(0, params.email.indexOf('@')),
        password: yapi.commons.generatePassword(password, passsalt), //加密
        email: params.email,
        passsalt: passsalt,
        role: 'member',
        add_time: yapi.commons.time(),
        up_time: yapi.commons.time(),
        type: 'site',
      }

      try {
        let user = await userInst.save(data)

        await this.handlePrivateGroup(user._id, user.username, user.email)

        if (params.send_email) {
          yapi.commons.sendMail({
            to: user.email,
            contents: `<h3>亲爱的用户：</h3><p>您好，感谢使用YApi可视化接口平台,您的账号 ${params.email} 已经注册成功，初始密码为：${password}，请尽快登录系统后在个人信息处修改。</p>`,
          })
        }

        ctx.body = yapi.commons.resReturn({
          uid: user._id,
          email: user.email,
          username: user.username,
          add_time: user.add_time,
          up_time: user.up_time,
          role: 'member',
          type: user.type,
          study: false,
        })
      } catch (e) {
        ctx.body = yapi.commons.resReturn(null, 401, e.message)
      }
    } catch (error) {}
  }
}

module.exports = fineUserController
