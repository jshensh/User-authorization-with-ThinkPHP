ThinkPHP 的用户授权，按用户组分配权限
===

原先基于 ThinkPHP 5.0 开发，三年前写的，刚移植到 ThinkPHP 5.1（LTS版本），可能还有 bug

数据库 [thinkphplogindemo.sql](https://github.com/jshensh/User-authorization-with-ThinkPHP/blob/master/thinkphplogindemo.sql)

clone 以后执行 ``composer install`` 装下依赖

直接注册即为管理员用户，登录进后台可在“系统设置”页面修改

ThinkPHP 5.1 的改动真的好大哇。。6.0 我是碰都不敢碰。。

目前还差把基于 Session 的登录验证改成支持跨域的 Token Header，晚点再说吧
