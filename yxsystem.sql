/*
Navicat MySQL Data Transfer

Source Server         : localhost
Source Server Version : 50621
Source Host           : localhost:3306
Source Database       : yxsystem

Target Server Type    : MYSQL
Target Server Version : 50621
File Encoding         : 65001

Date: 2015-07-28 17:00:54
*/

SET FOREIGN_KEY_CHECKS=0;
-- ----------------------------
-- Table structure for `t_charge`
-- ----------------------------
DROP TABLE IF EXISTS `t_charge`;
CREATE TABLE `t_charge` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `u_id` int(11) DEFAULT NULL,
  `charge_cate_id` int(11) DEFAULT NULL,
  `amount` decimal(10,2) DEFAULT NULL,
  `type` int(11) DEFAULT NULL,
  `date` varchar(20) DEFAULT NULL,
  `is_void` int(11) DEFAULT '0',
  `remark` varchar(100) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=17 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of t_charge
-- ----------------------------
INSERT INTO `t_charge` VALUES ('1', '1', '3', '12.00', '1', '2015-02-13', '0', null);
INSERT INTO `t_charge` VALUES ('2', '1', '2', '22.00', '0', '2015-11-13', '0', null);
INSERT INTO `t_charge` VALUES ('3', '1', '5', '11.00', '0', '2014-07-17', '0', null);
INSERT INTO `t_charge` VALUES ('4', '1', '3', '12.00', '0', '2015-05-01', '0', null);
INSERT INTO `t_charge` VALUES ('5', '1', '1', '55.00', '1', '2015-06-17', '0', null);
INSERT INTO `t_charge` VALUES ('6', '1', '1', '33.00', '1', '2014-12-17', '0', null);
INSERT INTO `t_charge` VALUES ('7', '1', '1', '44.00', '0', '2015-08-17', '0', null);
INSERT INTO `t_charge` VALUES ('8', '1', '2', '50.00', '0', '2015-06-05', '0', null);
INSERT INTO `t_charge` VALUES ('9', '1', '2', '33.00', '0', '2015-04-03', '0', null);
INSERT INTO `t_charge` VALUES ('10', '1', '5', '60.00', '0', '2015-03-20', '0', null);
INSERT INTO `t_charge` VALUES ('11', '1', '4', '33.00', '0', '2015-07-01', '0', null);
INSERT INTO `t_charge` VALUES ('12', '1', '4', '35.00', '0', '2015-09-10', '0', null);
INSERT INTO `t_charge` VALUES ('13', '1', '3', '26.00', '0', '2015-10-11', '0', null);
INSERT INTO `t_charge` VALUES ('14', '1', '1', '43.00', '0', '2015-12-12', '0', null);
INSERT INTO `t_charge` VALUES ('15', '1', '3', '10.00', '0', '2015-02-11', '0', null);
INSERT INTO `t_charge` VALUES ('16', '1', '4', '23.00', '1', '2015-07-17', '0', null);

-- ----------------------------
-- Table structure for `t_charge_cate`
-- ----------------------------
DROP TABLE IF EXISTS `t_charge_cate`;
CREATE TABLE `t_charge_cate` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(20) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of t_charge_cate
-- ----------------------------
INSERT INTO `t_charge_cate` VALUES ('1', 'Food');
INSERT INTO `t_charge_cate` VALUES ('2', 'Traffic');
INSERT INTO `t_charge_cate` VALUES ('3', 'Telecome');
INSERT INTO `t_charge_cate` VALUES ('4', 'Electric');
INSERT INTO `t_charge_cate` VALUES ('5', 'Gas');
INSERT INTO `t_charge_cate` VALUES ('6', 'Others');

-- ----------------------------
-- Table structure for `t_comment`
-- ----------------------------
DROP TABLE IF EXISTS `t_comment`;
CREATE TABLE `t_comment` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `u_id` int(11) DEFAULT NULL,
  `charge_id` int(11) DEFAULT NULL,
  `text` varchar(1000) DEFAULT NULL,
  `date` varchar(50) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of t_comment
-- ----------------------------
INSERT INTO `t_comment` VALUES ('1', '1', '4', '1222', '2015-05-12 15:30');

-- ----------------------------
-- Table structure for `t_user`
-- ----------------------------
DROP TABLE IF EXISTS `t_user`;
CREATE TABLE `t_user` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `username` varchar(20) NOT NULL,
  `email` varchar(100) DEFAULT NULL,
  `role` int(11) DEFAULT NULL,
  `password` varchar(100) NOT NULL,
  `logo` varchar(100) DEFAULT NULL,
  `is_login` int(11) DEFAULT NULL,
  `last_login_ip` varchar(100) DEFAULT NULL,
  `last_login_time` varchar(100) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=22 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of t_user
-- ----------------------------
INSERT INTO `t_user` VALUES ('1', 'YanJun', 'jun.yan@kewill.com', null, '111111', '/logo/avatar2.jpg', '1', '127.0.0.1', '2015-07-28 16:47:46');
INSERT INTO `t_user` VALUES ('2', 'XueWei', null, null, '', null, '0', null, null);
INSERT INTO `t_user` VALUES ('3', 'user4', null, null, '', null, '0', null, null);
INSERT INTO `t_user` VALUES ('4', 'user001', '857207947@qq.com', null, '111111', null, '0', null, null);
INSERT INTO `t_user` VALUES ('5', 'user002', '12@12.com', null, '111111', null, '0', null, null);
INSERT INTO `t_user` VALUES ('6', 'user003', '12@13.com', null, '111111', null, '0', null, null);
INSERT INTO `t_user` VALUES ('7', 'user004', '12@14.com', null, '111111', null, '0', null, null);
INSERT INTO `t_user` VALUES ('8', 'user005', '12@15.com', null, '111111', null, '0', null, null);
INSERT INTO `t_user` VALUES ('9', 'user006', '12@16.com', null, '111111', null, '0', null, null);
INSERT INTO `t_user` VALUES ('10', 'user007', '12@17.com', null, '111111', null, '0', null, null);
INSERT INTO `t_user` VALUES ('11', 'user008', '12@18.com', null, '111111', null, '0', null, null);
INSERT INTO `t_user` VALUES ('12', 'user009', '12@19.com', null, '111111', null, '0', null, null);
INSERT INTO `t_user` VALUES ('13', 'user011', '12@22.com', null, '111111', null, '0', null, null);
INSERT INTO `t_user` VALUES ('14', 'user012', '12@23.com', null, '111111', null, '0', null, null);
INSERT INTO `t_user` VALUES ('15', 'user014', '12@24.com', null, '111111', null, '0', null, null);
INSERT INTO `t_user` VALUES ('16', 'user015', '12@25.com', null, '111111', null, '0', null, null);
INSERT INTO `t_user` VALUES ('17', 'user016', '12@26.com', null, '111111', null, '0', null, null);
INSERT INTO `t_user` VALUES ('18', 'user018', '12@28.com', null, '111111', null, '0', null, null);
INSERT INTO `t_user` VALUES ('19', 'user019', '12@29.com', null, '111111', null, '0', null, null);
INSERT INTO `t_user` VALUES ('21', 'yjciacia', 'yjciacia@gmail.com', null, '111111', null, '0', null, null);
