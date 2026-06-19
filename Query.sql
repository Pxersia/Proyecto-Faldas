cat > /mnt/user-data/outputs/faldas_custom.sql << 'SQLEOF'
-- ============================================================
--  Faldas Custom — Script de Base de Datos
--  Motor   : MySQL 8
--  Charset : utf8mb4 / utf8mb4_unicode_ci
--  Autor   : Generado automáticamente
-- ============================================================

-- ------------------------------------------------------------
-- 0. Base de datos
-- ------------------------------------------------------------
DROP DATABASE IF EXISTS faldas_custom;
CREATE DATABASE faldas_custom
    CHARACTER SET utf8mb4
    COLLATE utf8mb4_unicode_ci;

USE faldas_custom;

-- ------------------------------------------------------------
-- 1. Tabla: users
-- ------------------------------------------------------------
CREATE TABLE users (
                       id          BIGINT          NOT NULL AUTO_INCREMENT,
                       name        VARCHAR(120)    NOT NULL,
                       email       VARCHAR(180)    NOT NULL,
                       password    VARCHAR(255)    NOT NULL,
                       role        ENUM('USER','ADMIN') NOT NULL DEFAULT 'USER',
                       created_at  DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP,

                       CONSTRAINT pk_users         PRIMARY KEY (id),
                       CONSTRAINT uq_users_email   UNIQUE      (email)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ------------------------------------------------------------
-- 2. Tabla: products
-- ------------------------------------------------------------
CREATE TABLE products (
                          id          BIGINT              NOT NULL AUTO_INCREMENT,
                          name        VARCHAR(200)        NOT NULL,
                          description TEXT,
                          price       DECIMAL(10, 2)      NOT NULL,
                          stock       INT                 NOT NULL DEFAULT 0,
                          image_url   VARCHAR(500),
                          active      TINYINT(1)          NOT NULL DEFAULT 1,

                          CONSTRAINT pk_products      PRIMARY KEY (id),
                          CONSTRAINT chk_price        CHECK (price > 0),
                          CONSTRAINT chk_stock        CHECK (stock >= 0)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ------------------------------------------------------------
-- 3. Tabla: orders
-- ------------------------------------------------------------
CREATE TABLE orders (
                        id          BIGINT      NOT NULL AUTO_INCREMENT,
                        user_id     BIGINT      NOT NULL,
                        total       DECIMAL(10, 2) NOT NULL,
                        status      ENUM('PENDING','PAID','SHIPPED','DELIVERED','CANCELLED')
                            NOT NULL DEFAULT 'PENDING',
                        created_at  DATETIME    NOT NULL DEFAULT CURRENT_TIMESTAMP,

                        CONSTRAINT pk_orders        PRIMARY KEY (id),
                        CONSTRAINT fk_orders_user   FOREIGN KEY (user_id)
                            REFERENCES users (id)
                            ON UPDATE CASCADE
                            ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ------------------------------------------------------------
-- 4. Tabla: order_items
-- ------------------------------------------------------------
CREATE TABLE order_items (
                             id          BIGINT          NOT NULL AUTO_INCREMENT,
                             order_id    BIGINT          NOT NULL,
                             product_id  BIGINT          NOT NULL,
                             quantity    INT             NOT NULL,
                             price       DECIMAL(10, 2)  NOT NULL,

                             CONSTRAINT pk_order_items           PRIMARY KEY (id),
                             CONSTRAINT fk_order_items_order     FOREIGN KEY (order_id)
                                 REFERENCES orders (id)
                                 ON UPDATE CASCADE
                                 ON DELETE CASCADE,
                             CONSTRAINT fk_order_items_product   FOREIGN KEY (product_id)
                                 REFERENCES products (id)
                                 ON UPDATE CASCADE
                                 ON DELETE RESTRICT,
                             CONSTRAINT chk_quantity             CHECK (quantity > 0),
                             CONSTRAINT chk_item_price           CHECK (price > 0)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ------------------------------------------------------------
-- 5. Tabla: addresses
-- ------------------------------------------------------------
CREATE TABLE addresses (
                           id          BIGINT          NOT NULL AUTO_INCREMENT,
                           user_id     BIGINT          NOT NULL,
                           street      VARCHAR(255)    NOT NULL,
                           city        VARCHAR(100)    NOT NULL,
                           region      VARCHAR(100)    NOT NULL,
                           zip_code    VARCHAR(20),
                           is_default  TINYINT(1)      NOT NULL DEFAULT 0,

                           CONSTRAINT pk_addresses         PRIMARY KEY (id),
                           CONSTRAINT fk_addresses_user    FOREIGN KEY (user_id)
                               REFERENCES users (id)
                               ON UPDATE CASCADE
                               ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ------------------------------------------------------------
-- 6. Tabla: payment_methods
-- ------------------------------------------------------------
CREATE TABLE payment_methods (
                                 id              BIGINT          NOT NULL AUTO_INCREMENT,
                                 user_id         BIGINT          NOT NULL,
                                 card_holder     VARCHAR(150)    NOT NULL,
                                 masked_number   CHAR(4)         NOT NULL,
                                 type            VARCHAR(30)     NOT NULL,

                                 CONSTRAINT pk_payment_methods       PRIMARY KEY (id),
                                 CONSTRAINT fk_payment_methods_user  FOREIGN KEY (user_id)
                                     REFERENCES users (id)
                                     ON UPDATE CASCADE
                                     ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- ÍNDICES DE RENDIMIENTO
-- ============================================================
CREATE INDEX idx_orders_user_id        ON orders       (user_id);
CREATE INDEX idx_orders_status         ON orders       (status);
CREATE INDEX idx_order_items_order_id  ON order_items  (order_id);
CREATE INDEX idx_order_items_product   ON order_items  (product_id);
CREATE INDEX idx_addresses_user_id     ON addresses    (user_id);
CREATE INDEX idx_payment_user_id       ON payment_methods (user_id);
CREATE INDEX idx_products_active       ON products     (active);

-- ============================================================
-- DATOS INICIALES
-- ============================================================

-- ------------------------------------------------------------
-- Admin inicial
-- Contraseña: Admin1234!
-- Hash BCrypt generado con strength 10
-- ------------------------------------------------------------
INSERT INTO users (name, email, password, role, created_at) VALUES
    (
        'Administrador',
        'admin@faldascustom.cl',
        '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2uheWG/igi.',
        'ADMIN',
        NOW()
    );

-- ------------------------------------------------------------
-- Usuario de prueba
-- Contraseña: User1234!
-- ------------------------------------------------------------
INSERT INTO users (name, email, password, role, created_at) VALUES
    (
        'María González',
        'maria@ejemplo.cl',
        '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy',
        'USER',
        NOW()
    );

-- ------------------------------------------------------------
-- Productos — colección inicial Faldas Custom
-- ------------------------------------------------------------
INSERT INTO products (name, description, price, stock, image_url, active) VALUES
                                                                              (
                                                                                  'Falda Bohemia Midi',
                                                                                  'Falda midi bohemia confeccionada en lino premium con detalles florales bordados. Perfecta para ocasiones especiales y salidas de verano.',
                                                                                  45990.00, 12, NULL, 1
                                                                              ),
                                                                              (
                                                                                  'Falda Clásica Lápiz',
                                                                                  'Falda lápiz en satén de alta calidad. Silueta elegante que favorece toda figura. Ideal para el trabajo o eventos formales.',
                                                                                  35990.00, 8, NULL, 1
                                                                              ),
                                                                              (
                                                                                  'Falda Plisada Mini',
                                                                                  'Falda mini plisada en tul con volumen perfecto. Un toque juvenil y romántico para cualquier ocasión casual o festiva.',
                                                                                  29990.00, 15, NULL, 1
                                                                              );

-- ------------------------------------------------------------
-- Dirección de prueba para María
-- ------------------------------------------------------------
INSERT INTO addresses (user_id, street, city, region, zip_code, is_default) VALUES
    (2, 'Av. Las Condes 456, Dpto 3B', 'Santiago', 'Región Metropolitana', '7500000', 1);

-- ------------------------------------------------------------
-- Pedido de prueba para María
-- ------------------------------------------------------------
INSERT INTO orders (user_id, total, status, created_at) VALUES
    (2, 45990.00, 'DELIVERED', DATE_SUB(NOW(), INTERVAL 30 DAY));

INSERT INTO order_items (order_id, product_id, quantity, price) VALUES
    (1, 1, 1, 45990.00);

INSERT INTO orders (user_id, total, status, created_at) VALUES
    (2, 71980.00, 'SHIPPED', DATE_SUB(NOW(), INTERVAL 7 DAY));

INSERT INTO order_items (order_id, product_id, quantity, price) VALUES
    (2, 2, 2, 35990.00);

-- ============================================================
-- VERIFICACIÓN FINAL
-- ============================================================
SELECT 'users'           AS tabla, COUNT(*) AS registros FROM users
UNION ALL
SELECT 'products',                  COUNT(*)             FROM products
UNION ALL
SELECT 'orders',                    COUNT(*)             FROM orders
UNION ALL
SELECT 'order_items',               COUNT(*)             FROM order_items
UNION ALL
SELECT 'addresses',                 COUNT(*)             FROM addresses
UNION ALL
SELECT 'payment_methods',           COUNT(*)             FROM payment_methods;

SQLEOF
echo "SQL generado OK"