<?php
namespace app\dashboard\controller;

use app\dashboard\controller\DashboardBase;

class Index extends DashboardBase
{
    public function index()
    {
        return $this->fetch();
    }
}
