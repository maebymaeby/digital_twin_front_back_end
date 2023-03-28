-- MySQL dump 10.13  Distrib 8.0.32, for Win64 (x86_64)
--
-- Host: localhost    Database: digital_twin
-- ------------------------------------------------------
-- Server version	8.0.32

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `datadriven_model`
--

DROP TABLE IF EXISTS `datadriven_model`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `datadriven_model` (
  `model_id` varchar(255) NOT NULL,
  `model_path` varchar(255) NOT NULL,
  `scaler_path` varchar(255) NOT NULL,
  PRIMARY KEY (`model_id`),
  KEY `model_id_data_model_idx` (`model_id`),
  CONSTRAINT `model_id_datadriven_model` FOREIGN KEY (`model_id`) REFERENCES `model_info` (`model_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `datadriven_model`
--

LOCK TABLES `datadriven_model` WRITE;
/*!40000 ALTER TABLE `datadriven_model` DISABLE KEYS */;
/*!40000 ALTER TABLE `datadriven_model` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `mechanism_model`
--

DROP TABLE IF EXISTS `mechanism_model`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `mechanism_model` (
  `model_id` varchar(255) NOT NULL,
  `param1` float NOT NULL,
  `param2` float NOT NULL,
  `param3` float NOT NULL,
  `param4` float NOT NULL,
  `param5` float NOT NULL,
  `param6` float NOT NULL,
  PRIMARY KEY (`model_id`),
  CONSTRAINT `model_id_mechanism_model` FOREIGN KEY (`model_id`) REFERENCES `model_info` (`model_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `mechanism_model`
--

LOCK TABLES `mechanism_model` WRITE;
/*!40000 ALTER TABLE `mechanism_model` DISABLE KEYS */;
/*!40000 ALTER TABLE `mechanism_model` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `message_info`
--

DROP TABLE IF EXISTS `message_info`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `message_info` (
  `message_id` int NOT NULL AUTO_INCREMENT,
  `username_from` varchar(255) NOT NULL,
  `message_title` varchar(255) NOT NULL,
  `message_content` varchar(255) NOT NULL,
  `create_time` datetime NOT NULL,
  PRIMARY KEY (`message_id`),
  KEY `username_message_idx` (`username_from`),
  CONSTRAINT `username_message` FOREIGN KEY (`username_from`) REFERENCES `user_info` (`username`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `message_info`
--

LOCK TABLES `message_info` WRITE;
/*!40000 ALTER TABLE `message_info` DISABLE KEYS */;
/*!40000 ALTER TABLE `message_info` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `model_info`
--

DROP TABLE IF EXISTS `model_info`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `model_info` (
  `model_id` varchar(255) NOT NULL,
  `model_name` varchar(255) NOT NULL,
  `model_type` varchar(255) NOT NULL,
  `model_description` varchar(255) DEFAULT NULL,
  `create_time` datetime NOT NULL,
  `train_length` int NOT NULL,
  `train_loss` float NOT NULL,
  `username` varchar(255) NOT NULL,
  PRIMARY KEY (`model_id`),
  KEY `username_idx` (`username`),
  CONSTRAINT `username_model_info` FOREIGN KEY (`username`) REFERENCES `user_info` (`username`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `model_info`
--

LOCK TABLES `model_info` WRITE;
/*!40000 ALTER TABLE `model_info` DISABLE KEYS */;
/*!40000 ALTER TABLE `model_info` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `user_info`
--

DROP TABLE IF EXISTS `user_info`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `user_info` (
  `username` varchar(255) NOT NULL,
  `password` varchar(255) DEFAULT NULL,
  `name` varchar(255) NOT NULL,
  `company` varchar(255) NOT NULL,
  `title` varchar(255) NOT NULL,
  `phone` varchar(255) DEFAULT NULL,
  `email` varchar(255) DEFAULT NULL,
  `access` int NOT NULL,
  `available` int NOT NULL,
  `photo` int DEFAULT NULL,
  PRIMARY KEY (`username`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user_info`
--

LOCK TABLES `user_info` WRITE;
/*!40000 ALTER TABLE `user_info` DISABLE KEYS */;
INSERT INTO `user_info` VALUES ('admin','1234567','管理员','南京邮电大学','计算机学院','18712345678','admin@njupt.edu.cn',0,1,0),('user','1234567','普通用户','东南大学','软件学院','16612345678','user@seu.edu.cn',1,1,2);
/*!40000 ALTER TABLE `user_info` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2023-03-29  4:25:57
