CREATE DATABASE myStore;
 USE myStore;

CREATE TABLE users
(
    f_name varchar(255) NOT NULL,
    l_name varchar(255) NOT NULL,
    email varchar(255) NULL,
    password text NOT NULL,
    city varchar(255) NULL,
    street varchar(255) NULL, 
    ID int NOT NULL,
    isAdmin boolean ,
    primary key(ID)
);

CREATE TABLE catagory
(
    id int auto_increment,
    theme varchar(255) NOT NULL,
    primary key (id)
);

CREATE TABLE products
(
    id int auto_increment,
    p_name varchar(255) NOT NULL,
    catagory_id int,
    price int NOT NULL, 
    picture text,
    foreign key(c_id) references catagory(id),
    primary key(id)
);

CREATE TABLE user_cart
(
    id int auto_increment,
    user_id int,
    creation_cart_date datetime default now(),
    foreign key(user_id) references users(ID),
    primary key(id)
);

CREATE TABLE cart_info
(
    id int auto_increment,
    product_id int,
    amount int,
    total_price int default 0,
    user_cart_id int,
    foreign key(product_id) references product(id),
    foreign key(user_cart_id) references user_cart(id),
    primary key(id)
);

CREATE TABLE orders
(
    id int auto_increment,
    user_id int,
    user_cart_id int,
    final_price int,
    city_shipping varchar(255),
    street_shipping varchar(255),
    date_order_toShipping datetime , 
    order_date datetime default now(),
    creditCard int ,
    foreign key(user_id) references users(ID),
    primary key(id)
);

.................................דוגמא...................................
select
 sum(products.price * cart_info.amount) as total_price
    from products
    inner join cart_info
    on products.id = cart_info.product_id