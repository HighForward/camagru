CREATE DATABASE camagru;
use camagru;

create table users (id INT PRIMARY KEY NOT NULL AUTO_INCREMENT, profile_img VARCHAR(255), username VARCHAR(30), email VARCHAR(50), password VARCHAR(30));
create table posts (id int not null, user_id int, img_path VARCHAR(255), PRIMARY KEY (id), FOREIGN KEY (user_id) REFERENCES users(id));