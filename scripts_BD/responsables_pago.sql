-- ============================================================
-- Responsables de Pago (personas fisicas y juridicas)
-- Ejecutar DESPUES de huesped.sql
-- ============================================================

-- Personas Juridicas (empresas que pagan facturas a nombre de terceros)
-- Primero insertar en la tabla padre responsable_pago, luego en persona_juridica

INSERT INTO responsable_pago (razon_social) VALUES
('TECHSOLUTIONS S.R.L.'),        -- ID 1
('AGROSANTAFE S.A.'),             -- ID 2
('CONSTRUCTORA DEL LITORAL S.A.'),-- ID 3
('LOGISTICA FEDERAL S.R.L.'),     -- ID 4
('IMPORTADORA BUENOS AIRES S.A.');-- ID 5

INSERT INTO persona_juridica (id, cuit, telefono, calle, numero, codigo_postal, localidad, provincia, pais) VALUES
(1, '30-71234567-8', '1140001111', 'Av. Corrientes', '1500', '1043', 'CABA', 'Buenos Aires', 'Argentina'),
(2, '30-71345678-9', '3414002222', 'Bv. Oroño', '3000', '2000', 'Rosario', 'Santa Fe', 'Argentina'),
(3, '30-71456789-0', '3514003333', 'Av. Colon', '800', '5000', 'Cordoba', 'Cordoba', 'Argentina'),
(4, '30-71567890-1', '3814004444', 'San Martin', '200', '4000', 'Tucuman', 'Tucuman', 'Argentina'),
(5, '30-71678901-2', '1140005555', 'Av. Madero', '100', '1106', 'CABA', 'Buenos Aires', 'Argentina');

-- Personas Fisicas (huespedes que son responsables de pago)
-- Se crean a partir de huespedes existentes

INSERT INTO responsable_pago (razon_social) VALUES
('GARCIA JUAN CARLOS'),    -- ID 6 -> Huesped 1
('FERNANDEZ CARLOS'),      -- ID 7 -> Huesped 5
('VIDAL MARCOS'),           -- ID 8 -> Huesped 21
('FIGUEROA MONICA');        -- ID 9 -> Huesped 20

INSERT INTO persona_fisica (id, huesped_id) VALUES
(6, 1),
(7, 5),
(8, 21),
(9, 20);
