CREATE SCHEMA `ujobs` DEFAULT CHARACTER SET utf8 ;
  
CREATE TABLE `ujobs`.`account` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `type` varchar(4) NOT NULL,
  `userName` varchar(64) NOT NULL,
  `password` varchar(128) NOT NULL,
  `fname` varchar(45) NOT NULL,
  `lname` varchar(45) NOT NULL,
  `phone` varchar(16) NOT NULL,
  `email` varchar(45) NOT NULL,
  `contactPref` varchar(4) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `userName_UNIQUE` (`userName`)
) ENGINE=InnoDB AUTO_INCREMENT=22 DEFAULT CHARSET=utf8;