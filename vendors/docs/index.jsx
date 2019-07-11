---
banner:
  name: 'YApi'
  desc: '旨在为开发、产品、测试人员提供更优雅的接口管理服务。可以帮助开发者轻松创建、发布、维护 API'
  btns: 
    - { name: '开始', href: './documents/index.html', primary: true }
    - { name: 'Github >', href: 'https://github.com/ymfe/yapi' }
features: 
  - { name: '权限管理', desc: 'YApi 成熟的团队管理扁平化项目权限配置满足各类企业的需求' }
  - { name: '可视化接口管理', desc: '基于 websocket 的多人协作接口编辑功能和类 postman 测试工具，让多人协作成倍提升开发效率' }
  - { name: 'Mock Server', desc: '易用的 Mock Server，再也不用担心 mock 数据的生成了' }
  - { name: '自动化测试', desc: '完善的接口自动化测试,保证数据的正确性' }
  - { name: '数据导入', desc: '支持导入 swagger, postman, har 数据格式，方便迁移旧项目'}
  - { name: '插件机制', desc: '强大的插件机制，满足各类业务需求'}

footer:
  copyRight:
    name: 'YMFE Team'
    href: 'https://ymfe.org/'
  links:
    团队网址:
      - { name: 'YMFE', href: 'https://ymfe.org/' }
      - { name: 'YMFE Blog', href: 'https://blog.ymfe.org/' }
    Git仓库:
      - { name: 'Github', href: 'https://github.com/YMFE/yapi' }
      - { name: 'Github Issue', href: 'https://github.com/YMFE/yapi/issues' }

---
{
  (function(){
    banner.caption = '当前版本: v' + props.config.version
    return <div>
      <Homepage banner={banner} features={features} />
      <Footer distPath={props.page.distPath} title={props.footer.title} copyRight={props.footer.copyRight} links={props.footer.links} />
    </div>
  })()
}
