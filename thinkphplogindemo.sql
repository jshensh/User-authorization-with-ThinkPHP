-- phpMyAdmin SQL Dump
-- version 4.8.5
-- https://www.phpmyadmin.net/
--
-- 主机： localhost
-- 生成日期： 2020-03-31 01:34:21
-- 服务器版本： 10.3.15-MariaDB-log
-- PHP 版本： 7.3.6

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET AUTOCOMMIT = 0;
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- 数据库： `thinkphplogindemo`
--

-- --------------------------------------------------------

--
-- 表的结构 `config`
--

CREATE TABLE `config` (
  `k` varchar(50) NOT NULL,
  `v` varchar(255) DEFAULT NULL
) ENGINE=MyISAM DEFAULT CHARSET=utf8;

--
-- 转存表中的数据 `config`
--

INSERT INTO `config` (`k`, `v`) VALUES
('sys_user_register_group', '2');

-- --------------------------------------------------------

--
-- 表的结构 `permission`
--

CREATE TABLE `permission` (
  `id` int(10) UNSIGNED NOT NULL,
  `scope` varchar(50) NOT NULL,
  `txt` varchar(255) NOT NULL,
  `parent` int(10) UNSIGNED NOT NULL DEFAULT 0,
  `val` varchar(255) NOT NULL
) ENGINE=MyISAM DEFAULT CHARSET=utf8;

--
-- 转存表中的数据 `permission`
--

INSERT INTO `permission` (`id`, `scope`, `txt`, `parent`, `val`) VALUES
(1, 'dashboard', '后台管理面板', 0, '[\"允许访问\"]'),
(2, 'dashboard_user', '用户管理', 1, '[\"读取用户列表\", \"添加用户\", \"编辑用户\", \"删除用户\"]'),
(3, 'dashboard_user_group', '用户组管理', 1, '[\"读取用户组列表\", \"添加用户组\", \"编辑用户组(含组权限)\", \"删除用户组\"]'),
(4, 'group', '用户组与成员', 0, '[]'),
(5, 'group_same', '允许同组成员', 4, '[\"修改本用户组(含组权限)\", \"添加本用户组成员\", \"修改本用户组用户\", \"删除本用户组用户\"]'),
(6, 'group_diff', '允许异组成员', 4, '[\"修改本用户组(含组权限)\", \"删除本用户组\", \"添加本用户组成员\", \"修改本用户组用户\", \"删除本用户组用户\"]'),
(7, 'dashboard_config', '系统设置', 1, '[\"允许编辑\"]');

-- --------------------------------------------------------

--
-- 表的结构 `user`
--

CREATE TABLE `user` (
  `id` int(10) UNSIGNED NOT NULL,
  `name` varchar(50) NOT NULL,
  `pwd` varchar(60) NOT NULL,
  `group_id` int(10) UNSIGNED NOT NULL
) ENGINE=MyISAM DEFAULT CHARSET=utf8;

--
-- 转存表中的数据 `user`
--

INSERT INTO `user` (`id`, `name`, `pwd`, `group_id`) VALUES
(1, 'root', '$2y$10$xlwkUFWqy5MeGFJvw8XZOeUH1MlbtYOMjMiWYD2uiSgVp0UT2m3H6', 1),
(2, 'guest', '$2y$10$HAlUQGBs8P72oRLlsDVpvuQcWUehGTt0SGf1U/WXiabhuVUfLz8wu', 2);

-- --------------------------------------------------------

--
-- 表的结构 `user_group`
--

CREATE TABLE `user_group` (
  `id` int(10) UNSIGNED NOT NULL,
  `name` varchar(50) NOT NULL
) ENGINE=MyISAM DEFAULT CHARSET=utf8;

--
-- 转存表中的数据 `user_group`
--

INSERT INTO `user_group` (`id`, `name`) VALUES
(1, 'admin'),
(2, 'user');

-- --------------------------------------------------------

--
-- 表的结构 `user_group_permission`
--

CREATE TABLE `user_group_permission` (
  `id` int(10) UNSIGNED NOT NULL,
  `group_id` int(10) UNSIGNED NOT NULL,
  `scope_id` int(10) UNSIGNED NOT NULL,
  `scope` varchar(50) NOT NULL,
  `perm` int(10) UNSIGNED NOT NULL
) ENGINE=MyISAM DEFAULT CHARSET=utf8;

--
-- 转存表中的数据 `user_group_permission`
--

INSERT INTO `user_group_permission` (`id`, `group_id`, `scope_id`, `scope`, `perm`) VALUES
(53, 1, 5, 'group_same', 15),
(74, 2, 6, 'group_diff', 31),
(52, 1, 7, 'dashboard_config', 1),
(73, 2, 5, 'group_same', 15),
(51, 1, 3, 'dashboard_user_group', 15),
(72, 2, 3, 'dashboard_user_group', 1),
(71, 2, 2, 'dashboard_user', 15),
(50, 1, 2, 'dashboard_user', 15),
(49, 1, 1, 'dashboard', 1),
(70, 2, 1, 'dashboard', 1),
(75, 5, 1, 'dashboard', 1);

--
-- 转储表的索引
--

--
-- 表的索引 `config`
--
ALTER TABLE `config`
  ADD PRIMARY KEY (`k`);

--
-- 表的索引 `permission`
--
ALTER TABLE `permission`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `scope` (`scope`);

--
-- 表的索引 `user`
--
ALTER TABLE `user`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `uname` (`name`);

--
-- 表的索引 `user_group`
--
ALTER TABLE `user_group`
  ADD PRIMARY KEY (`id`);

--
-- 表的索引 `user_group_permission`
--
ALTER TABLE `user_group_permission`
  ADD PRIMARY KEY (`id`);

--
-- 在导出的表使用AUTO_INCREMENT
--

--
-- 使用表AUTO_INCREMENT `permission`
--
ALTER TABLE `permission`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- 使用表AUTO_INCREMENT `user`
--
ALTER TABLE `user`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- 使用表AUTO_INCREMENT `user_group`
--
ALTER TABLE `user_group`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- 使用表AUTO_INCREMENT `user_group_permission`
--
ALTER TABLE `user_group_permission`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=78;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
