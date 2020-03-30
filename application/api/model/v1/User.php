<?php
namespace app\api\model\v1;

use think\Model;

class User extends Model
{
    public function userGroup()
    {
        return $this->belongsTo('app\\api\\model\\v1\\UserGroup', 'group_id')->bind([
                'group' => 'name'
            ]);
    }
}