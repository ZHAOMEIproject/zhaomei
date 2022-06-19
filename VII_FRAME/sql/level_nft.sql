/*
 Navicat MySQL Data Transfer

 Source Server         : 154.91.156.113level_nft
 Source Server Type    : MySQL
 Source Server Version : 80016
 Source Host           : 154.91.156.113:3306
 Source Schema         : level_nft

 Target Server Type    : MySQL
 Target Server Version : 80016
 File Encoding         : 65001

 Date: 19/06/2022 16:05:20
*/

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- ----------------------------
-- Table structure for dictionary_value
-- ----------------------------
DROP TABLE IF EXISTS `dictionary_value`;
CREATE TABLE `dictionary_value`  (
  `describe` varchar(200) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL COMMENT 'key描述',
  `key_id` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL COMMENT '键',
  `key_value` varchar(200) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT '-' COMMENT '值',
  PRIMARY KEY (`key_id`) USING BTREE
) ENGINE = InnoDB CHARACTER SET = utf8mb4 COLLATE = utf8mb4_general_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of dictionary_value
-- ----------------------------
INSERT INTO `dictionary_value` VALUES ('levelnft最后检测区块链高度', 'block_number_levelnft', '26431380');

-- ----------------------------
-- Table structure for levelnft_events_log
-- ----------------------------
DROP TABLE IF EXISTS `levelnft_events_log`;
CREATE TABLE `levelnft_events_log`  (
  `event_id` int(20) UNSIGNED NOT NULL AUTO_INCREMENT COMMENT '自增ID，事件日志ID',
  `block_number` int(20) NULL DEFAULT NULL COMMENT '创建区块高度',
  `event_name` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL COMMENT '事件名称',
  `transaction_hash` varchar(200) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL COMMENT '创建txid',
  `from_address` varchar(200) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL COMMENT '发起地址',
  `to_address` varchar(200) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL COMMENT '目标地址',
  `content` varchar(1000) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL COMMENT '描述说明',
  `update_time` datetime(0) NULL DEFAULT NULL COMMENT '更新时间',
  `tokenid` int(255) NULL DEFAULT NULL COMMENT 'tokenid',
  `is_deal_owner` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT 'F' COMMENT '是否更新owner信息：F-否；S-是',
  PRIMARY KEY (`event_id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 9 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_general_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of levelnft_events_log
-- ----------------------------
INSERT INTO `levelnft_events_log` VALUES (9, 26357279, 'Transfer', '0x8effbae11d43ba6c171b203e26cc3b61dde9424ad4471fe7f808d4a469655d2c', '0x0000000000000000000000000000000000000000', '0x8C327f1Aa6327F01A9A74cEc696691cEAAc680e2', 'levelnft转账', '2022-05-18 06:04:44', 0, 'F');

-- ----------------------------
-- Table structure for tokenminter
-- ----------------------------
DROP TABLE IF EXISTS `tokenminter`;
CREATE TABLE `tokenminter`  (
  `tokenid` int(255) NOT NULL,
  `minter` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `date` int(8) NOT NULL DEFAULT 0,
  `time` int(10) UNSIGNED ZEROFILL NOT NULL DEFAULT 0000000000,
  PRIMARY KEY (`tokenid`) USING BTREE
) ENGINE = InnoDB CHARACTER SET = utf8mb4 COLLATE = utf8mb4_general_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of tokenminter
-- ----------------------------
INSERT INTO `tokenminter` VALUES (113, '0xe3e628f50b5cdd2418ceb8b58d7bd57a5dabc178', 20220525, 1653465739);
INSERT INTO `tokenminter` VALUES (222, '0x32c8595719b9b315ad4afdb4a2a8c9c230898d87', 20220525, 1653465739);
INSERT INTO `tokenminter` VALUES (333, '0xe3e628f50b5cdd2418ceb8b58d7bd57a5dabc333', 20220526, 1653552139);
INSERT INTO `tokenminter` VALUES (444, '0xe3e628f50b5cdd2418ceb8b58d7bd57a5dabc333', 20220527, 1653638539);

-- ----------------------------
-- Table structure for tokenowner
-- ----------------------------
DROP TABLE IF EXISTS `tokenowner`;
CREATE TABLE `tokenowner`  (
  `tokenid` int(255) NOT NULL,
  `owner` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `date` int(8) NOT NULL DEFAULT 0,
  `time` int(10) UNSIGNED ZEROFILL NOT NULL DEFAULT 0000000000,
  PRIMARY KEY (`tokenid`) USING BTREE
) ENGINE = InnoDB CHARACTER SET = utf8mb4 COLLATE = utf8mb4_general_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of tokenowner
-- ----------------------------
INSERT INTO `tokenowner` VALUES (113, '0xe3e628f50b5cdd2418ceb8b58d7bd57a5dabc178', 20220525, 1653465739);
INSERT INTO `tokenowner` VALUES (222, '0x32c8595719b9b315ad4afdb4a2a8c9c230898d87', 20220525, 1653465739);
INSERT INTO `tokenowner` VALUES (333, '0xe3e628f50b5cdd2418ceb8b58d7bd57a5dabc333', 20220526, 1653552139);
INSERT INTO `tokenowner` VALUES (444, '0xe3e628f50b5cdd2418ceb8b58d7bd57a5dabc333', 20220527, 1653638539);

SET FOREIGN_KEY_CHECKS = 1;
