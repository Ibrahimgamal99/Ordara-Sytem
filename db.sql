CREATE TABLE `User`(
    user_id int(11) NOT NULL PRIMARY KEY AUTO_INCREMENT,
    First_name VARCHAR(25) NOT NULL,
    last_name VARCHAR(255) NOT NULL,
    password VARCHAR(255) NOT NULL,
    Email VARCHAR(255) NOT NULL,
    Location VARCHAR(255) NOT NULL
);

CREATE TABLE `waiting_list`(
    id int(11) NOT NULL PRIMARY KEY AUTO_INCREMENT,
    First_name VARCHAR(25) NOT NULL,
    last_name VARCHAR(255) NOT NULL,
    password VARCHAR(255) NOT NULL,
    Email VARCHAR(255) NOT NULL 
)
CREATE TABLE `Admin`(
    name VARCHAR(25) NOT NULL,
    password VARCHAR(255) NOT NULL,
);
CREATE TABLE `Restaurants`(
    restaurants_id int(11) NOT NULL PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(25) NOT NULL,
    description VARCHAR(255) NOT NULL,
    location VARCHAR(255) NOT NULL,
    image VARCHAR(255) NOT NULL
);
CREATE TABLE `foods`(
    restaurants_id INT(11) NOT NULL,
    name VARCHAR(25) NOT NULL,
    description VARCHAR(255) NOT NULL,
    price FLOAT(11) NOT NULL,
    image VARCHAR(255) NOT NULL,
    CONSTRAINT fk_food FOREIGN KEY(restaurants_id) REFERENCES Restaurants(restaurants_id) ON DELETE CASCADE ON UPDATE CASCADE
);


CREATE TABLE `library`(
    library_id int(11) NOT NULL PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(25) NOT NULL,
    description VARCHAR(255) NOT NULL,
    location VARCHAR(255) NOT NULL,
    image VARCHAR(255) NOT NULL
);
CREATE TABLE `tools`(
    library_id INT(11) NOT NULL,
    name VARCHAR(25) NOT NULL,
    description VARCHAR(255) NOT NULL,
    price FLOAT(11) NOT NULL,
    image VARCHAR(255) NOT NULL,
    CONSTRAINT fk_tools FOREIGN KEY(library_id) REFERENCES library(library_id) ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE `supermarket`(
    supermarket_id int(11) NOT NULL PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(25) NOT NULL,
    description VARCHAR(255) NOT NULL,
    location VARCHAR(255) NOT NULL,
    image VARCHAR(255) NOT NULL
);
CREATE TABLE `groceries`(
    supermarket_id INT(11) NOT NULL,
    name VARCHAR(25) NOT NULL,
    description VARCHAR(255) NOT NULL,
    price FLOAT(11) NOT NULL,
    image VARCHAR(255) NOT NULL,
    CONSTRAINT fk_groceries FOREIGN KEY(supermarket_id) REFERENCES supermarket(supermarket_id) ON DELETE CASCADE ON UPDATE CASCADE
);


CREATE TABLE `carts`(
    user_id INT(11) NOT NULL,
    product_name VARCHAR(255) NOT NULL,
    image VARCHAR(255) NOT NULL,
    qty INT(11) NOT NULL,
    price FLOAT(11) NOT NULL,
    total FLOAT(22) NOT NULL,
    time TIME NOT NULL,
    user_location VARCHAR(255) NOT NULL,
    prudect_location VARCHAR(255) NOT NULL,
    CONSTRAINT fk_carts FOREIGN KEY(user_id) REFERENCES User(user_id) ON DELETE CASCADE ON UPDATE CASCADE
);
CREATE TABLE `captain`(
    delvary_id int(11) NOT NULL PRIMARY KEY AUTO_INCREMENT,
 First_name VARCHAR(25) NOT NULL ,
    last_name VARCHAR(255) NOT NULL,
    password VARCHAR(255) NOT NULL,
    Email VARCHAR(255) NOT NULL ,
    Scooter VARCHAR(10) NOT NULL,
    location VARCHAR(10) NOT NULL,
    online_status boolean ,
    translation_status boolean 
);
CREATE TABLE `captain_trans`(
    delevry int(11) NOT NULL PRIMARY KEY ,
    From_location VARCHAR(25) NOT NULL,
    to_location VARCHAR(255) NOT NULL,
    distance VARCHAR(255) NOT NULL,
    duration VARCHAR(255) NOT NULL
);
CREATE TABLE `rate`(
    captain_id INT(11) NOT NULL,
    rate INT(1) NOT NULL,
    CONSTRAINT fk_rate FOREIGN KEY(captain_id) REFERENCES captain(delvary_id) ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE `captain_delivery`(
    delevry INT(11) NOT NULL,
    place_name VARCHAR(255) NOT NULL,
    from_location VARCHAR(255) NOT NULL,
    to_location VARCHAR(255) NOT NULL
);
CREATE TABLE `captain_delivery_menu`(
    delevry INT(11) NOT NULL,
    place_name VARCHAR(255) NOT NULL,
    product_name VARCHAR(255) NOT NULL,
    qty INT(11) NOT NULL,
    total FLOAT(11) NOT NULL
)

