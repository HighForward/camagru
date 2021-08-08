CREATE DATABASE camagru;
use camagru;

create table users (id INT PRIMARY KEY NOT NULL AUTO_INCREMENT, username VARCHAR(30), email VARCHAR(50), password VARCHAR(30));