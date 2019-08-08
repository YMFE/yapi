#  解决Chrome跨域问题
*  首先注意要区分Chrome版本，49之前的版本和49之后的版本处理方法不同。具体如下：
## Chrome49之后的版本：
**Windows**
1. 关闭所有的chrome浏览器。
2. 新建一个chrome快捷方式，右键“属性”，“快捷方式”选项卡里选择“目标”，添加  --args --disable-web-security --user-data-dir=C:\MyChromeDevUserData
3. 通过快捷方式打开谷歌浏览器

**MAC**
1. 打开终端
2. 输入下面的命令(需要替换路径中的yourname)
* open -n /Applications/Google\ Chrome.app/ --args --disable-web-security  --user-data-dir=/Users/yourname/MyChromeDevUserData/

*注意:网上有些文章--user-data-dir参数后面没有添加文件夹名，是设置不成功的;保证该路径/Users/yourname/下存在MyChromeDevUserData文件夹，没有文件夹MyChromeDevUserData，可以自己新建一个*

## Chrome49之前的版本：
**Windows**
1. 关闭所有的chrome浏览器。
2. 新建一个chrome快捷方式，右键“属性”，“快捷方式”选项卡里选择“目标”，添加--args --disable-web-security --user-data-dir**
3. 通过快捷方式打开谷歌浏览器

*注意:相对于新版本不需要新建添加MyChromeDevUserData文件夹 可以增加  --allow-running-insecure-content 解决混合内容问题*