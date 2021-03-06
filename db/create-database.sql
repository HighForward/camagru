CREATE DATABASE camagru;
use camagru;

create table users (id INT PRIMARY KEY NOT NULL AUTO_INCREMENT, profile_img VARCHAR(256), username VARCHAR(30), email VARCHAR(256), password VARCHAR(256), validate boolean DEFAULT false, mailer boolean DEFAULT true, uuid VARCHAR(40) default NULL, reset_uuid VARCHAR(40) default NULL);
create table posts (id INT PRIMARY KEY NOT NULL AUTO_INCREMENT, user_id int, img_path VARCHAR(255),FOREIGN KEY (user_id) REFERENCES users(id));
create table comments (id INT PRIMARY KEY NOT NULL AUTO_INCREMENT, post_id int, user_id int, comment VARCHAR(32000), FOREIGN KEY (post_id) REFERENCES posts(id) ON DELETE CASCADE, FOREIGN KEY (user_id) REFERENCES users(id));
create table likes (id INT PRIMARY KEY NOT NULL AUTO_INCREMENT, post_id int, user_id int, FOREIGN KEY (post_id) REFERENCES posts(id) ON DELETE CASCADE, FOREIGN KEY (user_id) REFERENCES users(id));