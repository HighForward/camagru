CREATE DATABASE camagru;
use camagru;

create table users (id INT PRIMARY KEY NOT NULL AUTO_INCREMENT, profile_img VARCHAR(255), username VARCHAR(30), email VARCHAR(50), password VARCHAR(30));
create table posts (id INT PRIMARY KEY NOT NULL AUTO_INCREMENT, user_id int, img_path VARCHAR(255),FOREIGN KEY (user_id) REFERENCES users(id));
create table comments (id INT PRIMARY KEY NOT NULL AUTO_INCREMENT, post_id int, comment VARCHAR(32000),FOREIGN KEY (post_id) REFERENCES posts(id));