<?php
namespace app\dashboard\controller;

use app\dashboard\controller\DashboardBase;

class User extends DashboardBase
{
    public function index()
    {
        if (!$this->isAllowed('dashboard_user')) {
            $this->redirect("dashboard/AccessDenied/index");
        }
        return $this->fetch();
    }
}
