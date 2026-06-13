-- Tabla de tokens de acceso al Portal del Huésped (QR por habitación).
-- Nota: con spring.jpa.hibernate.ddl-auto=update la tabla se crea sola
-- al levantar el backend; este CREATE TABLE es para carga manual.
CREATE TABLE IF NOT EXISTS token_acceso_huesped (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    token VARCHAR(255) NOT NULL UNIQUE,
    estadia_id INT NOT NULL,
    fecha_creacion DATE NOT NULL,
    activo BOOLEAN NOT NULL DEFAULT TRUE,
    CONSTRAINT fk_token_estadia FOREIGN KEY (estadia_id) REFERENCES estadia(id)
);
