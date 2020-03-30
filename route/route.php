<?php
// +----------------------------------------------------------------------
// | ThinkPHP [ WE CAN DO IT JUST THINK ]
// +----------------------------------------------------------------------
// | Copyright (c) 2006~2018 http://thinkphp.cn All rights reserved.
// +----------------------------------------------------------------------
// | Licensed ( http://www.apache.org/licenses/LICENSE-2.0 )
// +----------------------------------------------------------------------
// | Author: liu21st <liu21st@gmail.com>
// +----------------------------------------------------------------------

Route::resource('api/:version/admin/User', 'api/:version.admin.User');
Route::resource('api/:version/admin/UserGroup', 'api/:version.admin.UserGroup');

Route::group('api/:version', function() {
    Route::get('admin/:controller/:action', 'api/:version.admin.:controller/:action');
    Route::get('admin/:controller', 'api/:version.admin.:controller/index');
    Route::get(':controller/:action', 'api/:version.:controller/:action');
    Route::get(':controller', 'api/:version.:controller/index');
});

Route::get('dashboard/user_group/permission/:id', 'dashboard/UserGroup/permission?id=:id');


return [

];

