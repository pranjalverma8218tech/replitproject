-- ============================================================
-- Radhe Digital — MySQL Setup Script
-- Run this once on Hostinger (phpMyAdmin or CLI)
-- ============================================================

CREATE DATABASE IF NOT EXISTS radhedigital CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE radhedigital;

-- Orders table
CREATE TABLE IF NOT EXISTS orders (
  id            VARCHAR(30)     NOT NULL PRIMARY KEY,
  customer_name VARCHAR(100)    NOT NULL,
  mobile        VARCHAR(15)     NOT NULL,
  product_name  VARCHAR(250)    NOT NULL,
  category      VARCHAR(80)     NOT NULL,
  quantity      INT             NOT NULL DEFAULT 1,
  total         DECIMAL(10,2)   NOT NULL,
  status        VARCHAR(30)     NOT NULL DEFAULT 'New Order',
  address       TEXT            NOT NULL,
  email         VARCHAR(100)    DEFAULT NULL,
  notes         TEXT            DEFAULT NULL,
  is_whatsapp   TINYINT(1)      NOT NULL DEFAULT 0,
  created_at    DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at    DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Products table
CREATE TABLE IF NOT EXISTS products (
  id              VARCHAR(30)       NOT NULL PRIMARY KEY,
  name            VARCHAR(150)      NOT NULL,
  category        VARCHAR(80)       NOT NULL,
  description     TEXT              DEFAULT NULL,
  price           DECIMAL(10,2)     NOT NULL,
  price_label     VARCHAR(60)       DEFAULT NULL COMMENT 'e.g. ₹199 or From ₹149',
  badge           VARCHAR(60)       DEFAULT NULL COMMENT 'e.g. Best Seller, Trending',
  tags            TEXT              DEFAULT NULL COMMENT 'JSON array of tag strings',
  images          TEXT              DEFAULT NULL COMMENT 'JSON array of {view,label,url} objects',
  features        TEXT              DEFAULT NULL COMMENT 'JSON array of feature strings',
  specifications  TEXT              DEFAULT NULL COMMENT 'JSON array of {label,value} objects',
  image_url       VARCHAR(255)      DEFAULT NULL COMMENT 'Legacy single image (deprecated)',
  status          ENUM('Active','Inactive') NOT NULL DEFAULT 'Active',
  stock           INT               NOT NULL DEFAULT 0,
  created_at      DATETIME          NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at      DATETIME          NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Customers table
CREATE TABLE IF NOT EXISTS customers (
  id               VARCHAR(30)    NOT NULL PRIMARY KEY,
  name             VARCHAR(100)   NOT NULL,
  mobile           VARCHAR(15)    NOT NULL UNIQUE,
  email            VARCHAR(100)   DEFAULT NULL,
  total_orders     INT            NOT NULL DEFAULT 0,
  total_spent      DECIMAL(10,2)  NOT NULL DEFAULT 0.00,
  ordered_products TEXT           DEFAULT NULL COMMENT 'JSON array of product names',
  last_order_date  VARCHAR(20)    DEFAULT NULL,
  created_at       DATETIME       NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at       DATETIME       NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Admin users table
CREATE TABLE IF NOT EXISTS admin_users (
  id            INT             NOT NULL AUTO_INCREMENT PRIMARY KEY,
  username      VARCHAR(50)     NOT NULL UNIQUE,
  email         VARCHAR(100)    NOT NULL UNIQUE,
  password_hash VARCHAR(255)    NOT NULL,
  role          ENUM('super_admin','admin') NOT NULL DEFAULT 'admin',
  is_active     TINYINT(1)      NOT NULL DEFAULT 1,
  last_login    DATETIME        DEFAULT NULL,
  created_at    DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at    DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Indexes for common queries
CREATE INDEX IF NOT EXISTS idx_orders_status     ON orders(status);
CREATE INDEX IF NOT EXISTS idx_orders_mobile     ON orders(mobile);
CREATE INDEX IF NOT EXISTS idx_orders_created    ON orders(created_at);
CREATE INDEX IF NOT EXISTS idx_orders_whatsapp   ON orders(is_whatsapp);
CREATE INDEX IF NOT EXISTS idx_products_status   ON products(status);
CREATE INDEX IF NOT EXISTS idx_customers_mobile  ON customers(mobile);
