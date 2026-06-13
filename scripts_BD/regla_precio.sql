-- Tabla de reglas del motor de precios dinámicos.
-- Nota: con spring.jpa.hibernate.ddl-auto=update la tabla se crea sola
-- al levantar el backend; este CREATE TABLE es para carga manual.
CREATE TABLE IF NOT EXISTS regla_precio (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    nombre VARCHAR(255) NOT NULL,
    descripcion VARCHAR(255),
    tipo VARCHAR(50) NOT NULL,
    multiplicador FLOAT NOT NULL,
    umbral_ocupacion FLOAT,
    fecha_desde DATE,
    fecha_hasta DATE,
    min_noches INT,
    activa BOOLEAN NOT NULL,
    prioridad INT NOT NULL
);

INSERT INTO regla_precio (nombre, descripcion, tipo, multiplicador, umbral_ocupacion, fecha_desde, fecha_hasta, min_noches, activa, prioridad) VALUES
('Fin de semana', 'Recargo del 15% si alguna noche cae en viernes o sábado', 'FIN_DE_SEMANA', 1.15, NULL, NULL, NULL, NULL, true, 2),
('Alta ocupación', 'Recargo del 25% cuando la ocupación del hotel alcanza el 80%', 'OCUPACION_ALTA', 1.25, 0.80, NULL, NULL, NULL, true, 3),
('Estadía larga', 'Descuento del 10% para estadías de 7 o más noches', 'DESCUENTO_ESTADIA_LARGA', 0.90, NULL, NULL, NULL, 7, true, 1);
