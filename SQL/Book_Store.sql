/*
 Navicat PostgreSQL Data Transfer

 Source Server         : postgresql

 Source Server Type    : PostgreSQL
 Source Server Version : 90514
 Source Host           : localhost:5432
 Source Catalog        : Book_Store
 Source Schema         : public

 Target Server Type    : PostgreSQL
 Target Server Version : 90514
 File Encoding         : 65012
*/


-- ----------------------------
-- Table structure for address
-- ----------------------------
DROP TABLE IF EXISTS "address";
CREATE TABLE "address" (
  "id" numeric(5) NOT NULL,
  "street_number" numeric(4),
  "street_name" varchar(30) COLLATE "pg_catalog"."default",
  "city" varchar(20) COLLATE "pg_catalog"."default",
  "province" varchar(25) COLLATE "pg_catalog"."default",
  "postal_code" varchar(6) COLLATE "pg_catalog"."default"
)
;

-- ----------------------------
-- Records of address
-- ----------------------------
BEGIN;
INSERT INTO "address" VALUES (1, 3005, 'Book Avenue', 'New Book City', 'New Book', 'B00K5');
INSERT INTO "address" VALUES (2, 1125, 'Colonel By Drive', 'Ottawa', 'Ontario', 'K1S5B6');
INSERT INTO "address" VALUES (3, 404, 'Street Not Found', 'Ottawa', 'Ontario', 'K2B5G6');
INSERT INTO "address" VALUES (4, 2404, 'Christine Avenue', 'Kanata', 'Ontario', 'J9K2L3');
INSERT INTO "address" VALUES (5, 3804, 'Jorg Sack Street', 'Montreal', 'Quebec', 'Q1C8E6');
INSERT INTO "address" VALUES (18512, 12, 'dfd', 'dfdf', 'British Columbia', 'dfdf');
COMMIT;

-- ----------------------------
-- Table structure for book
-- ----------------------------
DROP TABLE IF EXISTS "book";
CREATE TABLE "book" (
  "isbn" numeric(13) NOT NULL,
  "title" varchar(255) COLLATE "pg_catalog"."default" NOT NULL,
  "author" varchar(50) COLLATE "pg_catalog"."default" NOT NULL,
  "genre" varchar(50) COLLATE "pg_catalog"."default"
)
;

-- ----------------------------
-- Records of book
-- ----------------------------
BEGIN;
INSERT INTO "book" VALUES (9781593275846, 'Eloquent JavaScript, Second Edition', 'Marijn Haverbeke', 'Educational');
INSERT INTO "book" VALUES (9781449331818, 'Learning JavaScript Design Patterns', 'Addy Osmani', 'Educational');
INSERT INTO "book" VALUES (9781449365125, 'Speaking JavaScript', 'Axel Rauschmayer', 'Educational');
INSERT INTO "book" VALUES (9781491950296, 'Programming JavaScript Applications', 'Eric Elliott', 'Educational');
INSERT INTO "book" VALUES (9781593277574, 'Understanding ECMAScript 6', 'Nicholas C. Zakas', 'Educational');
INSERT INTO "book" VALUES (9781449325862, 'Git Pocket Guide', 'Richard E. Silverman', 'Educational');
INSERT INTO "book" VALUES (9781137279129, 'Riveted: The Science of Why Jokes Make Us Laugh', 'Jim Davies', 'Educational');
INSERT INTO "book" VALUES (9780071841612, 'ITIL Foundation All-in-One Exam Guide', 'Jim Davies', 'Educational');
INSERT INTO "book" VALUES (9780747546245, 'Harry Potter and the Goblet of Fire', 'J.K. Rowling', 'Fiction');
COMMIT;

-- ----------------------------
-- Table structure for order
-- ----------------------------
DROP TABLE IF EXISTS "order";
CREATE TABLE "order" (
  "id" numeric(8) NOT NULL,
  "date" timestamp(6),
  "tracking_number" varchar(24) COLLATE "pg_catalog"."default",
  "shipping_company" varchar(50) COLLATE "pg_catalog"."default",
  "billing_address" numeric(5),
  "shipping_address" numeric(5),
  "payment_method" varchar(6) COLLATE "pg_catalog"."default"
)
;

-- ----------------------------
-- Records of order
-- ----------------------------
BEGIN;
INSERT INTO "order" VALUES (1, '2021-12-06 12:05:00', '1Z2938882012920', 'UPS', 5, 5, 'VISA');
INSERT INTO "order" VALUES (2, '2021-12-15 08:23:00', '1Z9382838378283', 'UPS', 2, 3, 'VISA');
COMMIT;

-- ----------------------------
-- Table structure for order_book
-- ----------------------------
DROP TABLE IF EXISTS "order_book";
CREATE TABLE "order_book" (
  "order_id" numeric(8) NOT NULL,
  "isbn" numeric(13) NOT NULL,
  "quantity" numeric(3)
)
;

-- ----------------------------
-- Records of order_book
-- ----------------------------
BEGIN;
INSERT INTO "order_book" VALUES (1, 9780071841612, 1);
INSERT INTO "order_book" VALUES (1, 9781137279129, 1);
INSERT INTO "order_book" VALUES (1, 9781593275846, 1);
INSERT INTO "order_book" VALUES (2, 9781137279129, 3);
COMMIT;

-- ----------------------------
-- Table structure for ordered
-- ----------------------------
DROP TABLE IF EXISTS "ordered";
CREATE TABLE "ordered" (
  "order_id" numeric(8) NOT NULL,
  "username" varchar(30) COLLATE "pg_catalog"."default"
)
;

-- ----------------------------
-- Records of ordered
-- ----------------------------
BEGIN;
INSERT INTO "ordered" VALUES (1, 'vinh');
INSERT INTO "ordered" VALUES (2, 'tim');
COMMIT;

-- ----------------------------
-- Table structure for published
-- ----------------------------
DROP TABLE IF EXISTS "published";
CREATE TABLE "published" (
  "isbn" numeric(13) NOT NULL,
  "publisher_id" numeric(5) NOT NULL,
  "pub_percentage" numeric(3,2) DEFAULT 0.02
)
;

-- ----------------------------
-- Records of published
-- ----------------------------
BEGIN;
INSERT INTO "published" VALUES (9781137279129, 3, 0.02);
INSERT INTO "published" VALUES (9780747546245, 2, 0.02);
INSERT INTO "published" VALUES (9780747546245, 1, 0.02);
INSERT INTO "published" VALUES (9780071841612, 3, 0.02);
INSERT INTO "published" VALUES (9781449325862, 2, 0.02);
INSERT INTO "published" VALUES (9781593277574, 2, 0.02);
INSERT INTO "published" VALUES (9781491950296, 1, 0.02);
INSERT INTO "published" VALUES (9781491950296, 2, 0.02);
INSERT INTO "published" VALUES (9781449331818, 2, 0.02);
INSERT INTO "published" VALUES (9781593275846, 2, 0.02);
COMMIT;

-- ----------------------------
-- Table structure for publisher
-- ----------------------------
DROP TABLE IF EXISTS "publisher";
CREATE TABLE "publisher" (
  "id" numeric(5) NOT NULL,
  "publisher_name" varchar(50) COLLATE "pg_catalog"."default",
  "banking_account" varchar(20) COLLATE "pg_catalog"."default" NOT NULL,
  "address_id" numeric(5),
  "email" varchar(100) COLLATE "pg_catalog"."default",
  "phone_number" numeric(10)
)
;

-- ----------------------------
-- Records of publisher
-- ----------------------------
BEGIN;
INSERT INTO "publisher" VALUES (1, 'Books R Us', '127412204', 1, 'b424242424@126.com', 6134551212);
INSERT INTO "publisher" VALUES (2, 'Coder Pro', '127412128', 3, 'c1522424@qq.com', 6133080400);
INSERT INTO "publisher" VALUES (3, 'Carleton Bookstore', '127410129', 2, 'c5252525e@163.com', 6138082400);
COMMIT;

-- ----------------------------
-- Table structure for store
-- ----------------------------
DROP TABLE IF EXISTS "store";
CREATE TABLE "store" (
  "store_name" varchar(50) COLLATE "pg_catalog"."default" NOT NULL,
  "username" varchar(30) COLLATE "pg_catalog"."default"
)
;

-- ----------------------------
-- Records of store
-- ----------------------------
BEGIN;
INSERT INTO "store" VALUES ('tom', 'tim');
INSERT INTO "store" VALUES ('VV Books', 'vinh');
COMMIT;

-- ----------------------------
-- Table structure for store_books
-- ----------------------------
DROP TABLE IF EXISTS "store_books";
CREATE TABLE "store_books" (
  "store_name" varchar(50) COLLATE "pg_catalog"."default" NOT NULL,
  "isbn" numeric(13) NOT NULL,
  "retail_price" numeric(5,2),
  "wholesale_price" numeric(5,2),
  "stock_quantity" numeric(4),
  "warning_quantity" numeric(4)
)
;

-- ----------------------------
-- Records of store_books
-- ----------------------------
BEGIN;
INSERT INTO "store_books" VALUES ('tom', 9781137279129, 14.99, 19.99, 20, 5);
INSERT INTO "store_books" VALUES ('VV Books', 9780071841612, 12.99, 20.99, 15, 5);
INSERT INTO "store_books" VALUES ('VV Books', 9781137279129, 18.99, 24.99, 15, 5);
INSERT INTO "store_books" VALUES ('VV Books', 9781593275846, 69.99, 109.99, 65, 20);
COMMIT;

-- ----------------------------
-- Table structure for user
-- ----------------------------
DROP TABLE IF EXISTS "user";
CREATE TABLE "user" (
  "username" varchar(30) COLLATE "pg_catalog"."default" NOT NULL,
  "password" varchar(30) COLLATE "pg_catalog"."default" NOT NULL,
  "first_name" varchar(25) COLLATE "pg_catalog"."default",
  "last_name" varchar(25) COLLATE "pg_catalog"."default",
  "address_id" numeric(5),
  "email" varchar(50) COLLATE "pg_catalog"."default" NOT NULL,
  "phone_number" numeric(10),
  "gender" varchar(1) COLLATE "pg_catalog"."default",
  "age" numeric(3)
)
;

-- ----------------------------
-- Records of user
-- ----------------------------
BEGIN;
INSERT INTO "user" VALUES ('tim', 'tim', 'Nicolas', 'El-Khoury', 4, 'tim@gmail.com', 6132405900, 'm', 20);
INSERT INTO "user" VALUES ('vinh', 'vinh', 'Vinh', 'Nguyen', 3, 'vinh@gmail.com', 6133164004, 'm', 20);
INSERT INTO "user" VALUES ('deen', 'deen', 'Deen', 'Albert', 2, 'deen@yahoo.ca', 4162012400, 'o', 32);
INSERT INTO "user" VALUES ('bill', 'bill', 'Bill', 'Morin', 5, 'billzz@gmail.com', 8521230840, 'm', 19);
COMMIT;

-- ----------------------------
-- Primary Key structure for table address
-- ----------------------------
ALTER TABLE "address" ADD CONSTRAINT "address_pkey" PRIMARY KEY ("id");

-- ----------------------------
-- Primary Key structure for table book
-- ----------------------------
ALTER TABLE "book" ADD CONSTRAINT "book_pkey" PRIMARY KEY ("isbn");

-- ----------------------------
-- Primary Key structure for table order
-- ----------------------------
ALTER TABLE "order" ADD CONSTRAINT "order_pkey" PRIMARY KEY ("id");

-- ----------------------------
-- Checks structure for table order_book
-- ----------------------------
ALTER TABLE "order_book" ADD CONSTRAINT "order_book_quantity_check" CHECK ((quantity > (0)::numeric));

-- ----------------------------
-- Primary Key structure for table order_book
-- ----------------------------
ALTER TABLE "order_book" ADD CONSTRAINT "order_book_pkey" PRIMARY KEY ("order_id", "isbn");

-- ----------------------------
-- Primary Key structure for table ordered
-- ----------------------------
ALTER TABLE "ordered" ADD CONSTRAINT "ordered_pkey" PRIMARY KEY ("order_id");

-- ----------------------------
-- Primary Key structure for table published
-- ----------------------------
ALTER TABLE "published" ADD CONSTRAINT "published_pkey" PRIMARY KEY ("isbn", "publisher_id");

-- ----------------------------
-- Primary Key structure for table publisher
-- ----------------------------
ALTER TABLE "publisher" ADD CONSTRAINT "publisher_pkey" PRIMARY KEY ("id");

-- ----------------------------
-- Primary Key structure for table store
-- ----------------------------
ALTER TABLE "store" ADD CONSTRAINT "store_pkey" PRIMARY KEY ("store_name");

-- ----------------------------
-- Checks structure for table store_books
-- ----------------------------
ALTER TABLE "store_books" ADD CONSTRAINT "store_books_check" CHECK ((stock_quantity > warning_quantity));
ALTER TABLE "store_books" ADD CONSTRAINT "store_books_wholesale_price_check" CHECK ((wholesale_price > (0)::numeric));
ALTER TABLE "store_books" ADD CONSTRAINT "store_books_retail_price_check" CHECK ((retail_price > (0)::numeric));
ALTER TABLE "store_books" ADD CONSTRAINT "store_books_warning_quantity_check" CHECK ((warning_quantity >= (0)::numeric));

-- ----------------------------
-- Primary Key structure for table store_books
-- ----------------------------
ALTER TABLE "store_books" ADD CONSTRAINT "store_books_pkey" PRIMARY KEY ("store_name", "isbn");

-- ----------------------------
-- Checks structure for table user
-- ----------------------------
ALTER TABLE "user" ADD CONSTRAINT "user_age_check" CHECK (((age > (0)::numeric) AND (age < (122)::numeric)));

-- ----------------------------
-- Primary Key structure for table user
-- ----------------------------
ALTER TABLE "user" ADD CONSTRAINT "user_pkey" PRIMARY KEY ("username");

-- ----------------------------
-- Foreign Keys structure for table order
-- ----------------------------
ALTER TABLE "order" ADD CONSTRAINT "order_billing_address_fkey" FOREIGN KEY ("billing_address") REFERENCES "address" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION;
ALTER TABLE "order" ADD CONSTRAINT "order_shipping_address_fkey" FOREIGN KEY ("shipping_address") REFERENCES "address" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- ----------------------------
-- Foreign Keys structure for table order_book
-- ----------------------------
ALTER TABLE "order_book" ADD CONSTRAINT "order_book_isbn_fkey" FOREIGN KEY ("isbn") REFERENCES "book" ("isbn") ON DELETE NO ACTION ON UPDATE NO ACTION;
ALTER TABLE "order_book" ADD CONSTRAINT "order_book_order_id_fkey" FOREIGN KEY ("order_id") REFERENCES "order" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- ----------------------------
-- Foreign Keys structure for table ordered
-- ----------------------------
ALTER TABLE "ordered" ADD CONSTRAINT "ordered_order_id_fkey" FOREIGN KEY ("order_id") REFERENCES "order" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION;
ALTER TABLE "ordered" ADD CONSTRAINT "ordered_username_fkey" FOREIGN KEY ("username") REFERENCES "user" ("username") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- ----------------------------
-- Foreign Keys structure for table published
-- ----------------------------
ALTER TABLE "published" ADD CONSTRAINT "published_isbn_fkey" FOREIGN KEY ("isbn") REFERENCES "book" ("isbn") ON DELETE NO ACTION ON UPDATE NO ACTION;
ALTER TABLE "published" ADD CONSTRAINT "published_publisher_id_fkey" FOREIGN KEY ("publisher_id") REFERENCES "publisher" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- ----------------------------
-- Foreign Keys structure for table publisher
-- ----------------------------
ALTER TABLE "publisher" ADD CONSTRAINT "publisher_address_id_fkey" FOREIGN KEY ("address_id") REFERENCES "address" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- ----------------------------
-- Foreign Keys structure for table store
-- ----------------------------
ALTER TABLE "store" ADD CONSTRAINT "store_username_fkey" FOREIGN KEY ("username") REFERENCES "user" ("username") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- ----------------------------
-- Foreign Keys structure for table store_books
-- ----------------------------
ALTER TABLE "store_books" ADD CONSTRAINT "store_books_isbn_fkey" FOREIGN KEY ("isbn") REFERENCES "book" ("isbn") ON DELETE NO ACTION ON UPDATE NO ACTION;
ALTER TABLE "store_books" ADD CONSTRAINT "store_books_store_name_fkey" FOREIGN KEY ("store_name") REFERENCES "store" ("store_name") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- ----------------------------
-- Foreign Keys structure for table user
-- ----------------------------
ALTER TABLE "user" ADD CONSTRAINT "user_address_id_fkey" FOREIGN KEY ("address_id") REFERENCES "address" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION;
