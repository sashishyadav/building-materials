-- Construction Material Marketplace Database Schema

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Suppliers table
CREATE TABLE suppliers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    phone VARCHAR(15) UNIQUE NOT NULL,
    name VARCHAR(100),
    type VARCHAR(20) DEFAULT 'supplier',
    is_verified BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- OTP table
CREATE TABLE otps (
    id SERIAL PRIMARY KEY,
    phone VARCHAR(15) NOT NULL,
    otp VARCHAR(6) NOT NULL,
    expires_at TIMESTAMP NOT NULL,
    verified BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Mandis table
CREATE TABLE mandis (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    district VARCHAR(100) NOT NULL DEFAULT 'Ambedkar Nagar',
    slug VARCHAR(100) UNIQUE NOT NULL,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Vehicles table
CREATE TABLE vehicles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    registration_number VARCHAR(20) UNIQUE NOT NULL,
    vehicle_type VARCHAR(50) DEFAULT 'Tata Signa',
    gross_weight_tonnes DECIMAL(6,2) NOT NULL,
    driver_name VARCHAR(100),
    driver_phone VARCHAR(15),
    owner_name VARCHAR(100),
    owner_phone VARCHAR(15),
    mandi_id INTEGER REFERENCES mandis(id),
    supplier_id UUID REFERENCES suppliers(id),
    availability VARCHAR(20) DEFAULT 'available',
    parivahan_verified BOOLEAN DEFAULT FALSE,
    parivahan_data JSONB,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Gitti listings table
CREATE TABLE gitti_listings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    size VARCHAR(30) NOT NULL,
    crusher_name VARCHAR(100) NOT NULL,
    crusher_location VARCHAR(100) NOT NULL,
    price_per_cft DECIMAL(10,2) NOT NULL,
    district VARCHAR(100) DEFAULT 'Ambedkar Nagar',
    vehicle_id UUID REFERENCES vehicles(id),
    supplier_id UUID REFERENCES suppliers(id),
    availability VARCHAR(20) DEFAULT 'available',
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Morang listings table
CREATE TABLE morang_listings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    type VARCHAR(20) NOT NULL,
    use_case VARCHAR(100),
    source_location VARCHAR(100) NOT NULL,
    price_per_tonne DECIMAL(10,2) NOT NULL,
    district VARCHAR(100) DEFAULT 'Ambedkar Nagar',
    vehicle_id UUID REFERENCES vehicles(id),
    supplier_id UUID REFERENCES suppliers(id),
    availability VARCHAR(20) DEFAULT 'available',
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Price history table (tracks all price changes)
CREATE TABLE price_history (
    id SERIAL PRIMARY KEY,
    listing_type VARCHAR(10) NOT NULL,
    listing_id UUID NOT NULL,
    old_price DECIMAL(10,2),
    new_price DECIMAL(10,2) NOT NULL,
    changed_by UUID REFERENCES suppliers(id),
    created_at TIMESTAMP DEFAULT NOW()
);

-- Onboarding requests table
CREATE TABLE onboarding_requests (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    owner_name VARCHAR(100) NOT NULL,
    driver_name VARCHAR(100),
    driver_phone VARCHAR(15) NOT NULL,
    owner_phone VARCHAR(15),
    registration_number VARCHAR(20) NOT NULL,
    gross_weight_tonnes DECIMAL(6,2),
    product_type VARCHAR(20),
    product_variant VARCHAR(50),
    price DECIMAL(10,2),
    source_location VARCHAR(100),
    mandi VARCHAR(100),
    status VARCHAR(20) DEFAULT 'pending',
    parivahan_verified BOOLEAN DEFAULT FALSE,
    parivahan_data JSONB,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Seed mandis
INSERT INTO mandis (name, district, slug) VALUES
    ('Akbarpur', 'Ambedkar Nagar', 'akbarpur'),
    ('Tanda', 'Ambedkar Nagar', 'tanda'),
    ('Iltifatganj', 'Ambedkar Nagar', 'iltifatganj'),
    ('Baskhari', 'Ambedkar Nagar', 'baskhari'),
    ('Gosaiganj', 'Ambedkar Nagar', 'gosaiganj');

-- Seed suppliers
INSERT INTO suppliers (phone, name, is_verified) VALUES
    ('8687882832', 'Rajan', true),
    ('9876543212', 'Ram Kumar', true),
    ('9569045102', 'Raj Bhadur', true);

-- Seed vehicles
INSERT INTO vehicles (registration_number, vehicle_type, gross_weight_tonnes, driver_name, driver_phone, owner_name, owner_phone, mandi_id, supplier_id, availability) VALUES
    ('BR28GB8126', 'Tata Signa', 42, 'Rajan', '8687882832', 'Rajan', '8687882832', 1, (SELECT id FROM suppliers WHERE phone='8687882832'), 'available'),
    ('UP45AT9694', 'Tata Signa', 40, 'Mukesh', '9876543212', 'Ram Kumar', '9876543213', 2, (SELECT id FROM suppliers WHERE phone='9876543212'), 'available'),
    ('UP45AT7064', 'Tata Signa', 40, 'Abhishek', '9569045102', 'Raj Bhadur', '9876543215', 3, (SELECT id FROM suppliers WHERE phone='9569045102'), 'in_transit');

-- Seed gitti listings
INSERT INTO gitti_listings (size, crusher_name, crusher_location, price_per_cft, vehicle_id, supplier_id) VALUES
    ('6mm (Jeera)', 'Pragati Crusher', 'Kabrai', 45, (SELECT id FROM vehicles WHERE registration_number='BR28GB8126'), (SELECT id FROM suppliers WHERE phone='8687882832')),
    ('12mm (Half-Inch)', 'Murli Crusher', 'Jhansi', 48, (SELECT id FROM vehicles WHERE registration_number='UP45AT9694'), (SELECT id FROM suppliers WHERE phone='9876543212')),
    ('18mm', 'Maa Durga Crusher', 'Kabrai', 52, (SELECT id FROM vehicles WHERE registration_number='UP45AT7064'), (SELECT id FROM suppliers WHERE phone='9569045102')),
    ('20mm', 'Pragati Crusher', 'Jhansi', 55, (SELECT id FROM vehicles WHERE registration_number='BR28GB8126'), (SELECT id FROM suppliers WHERE phone='8687882832'));

-- Seed morang listings
INSERT INTO morang_listings (type, use_case, source_location, price_per_tonne, vehicle_id, supplier_id) VALUES
    ('mota', 'Foundation filling', 'Dehri, Bihar', 1100, (SELECT id FROM vehicles WHERE registration_number='BR28GB8126'), (SELECT id FROM suppliers WHERE phone='8687882832')),
    ('medium', 'Plastering', 'Patna, Bihar', 1250, (SELECT id FROM vehicles WHERE registration_number='UP45AT9694'), (SELECT id FROM suppliers WHERE phone='9876543212')),
    ('fine', 'Brick laying', 'Banda, UP', 1400, (SELECT id FROM vehicles WHERE registration_number='UP45AT7064'), (SELECT id FROM suppliers WHERE phone='9569045102'));

-- Indexes
CREATE INDEX idx_vehicles_supplier ON vehicles(supplier_id);
CREATE INDEX idx_vehicles_mandi ON vehicles(mandi_id);
CREATE INDEX idx_gitti_vehicle ON gitti_listings(vehicle_id);
CREATE INDEX idx_gitti_supplier ON gitti_listings(supplier_id);
CREATE INDEX idx_morang_vehicle ON morang_listings(vehicle_id);
CREATE INDEX idx_morang_supplier ON morang_listings(supplier_id);
CREATE INDEX idx_price_history_listing ON price_history(listing_type, listing_id);
CREATE INDEX idx_otps_phone ON otps(phone, expires_at);
CREATE INDEX idx_onboarding_status ON onboarding_requests(status);
