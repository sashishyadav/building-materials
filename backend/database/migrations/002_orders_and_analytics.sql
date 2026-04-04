CREATE TABLE IF NOT EXISTS orders (
  id SERIAL PRIMARY KEY,
  listing_type VARCHAR(10) NOT NULL,
  listing_id VARCHAR(50) NOT NULL,
  customer_name VARCHAR(200),
  customer_phone VARCHAR(20) NOT NULL,
  quantity NUMERIC,
  message TEXT,
  status VARCHAR(20) DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS page_views (
  id SERIAL PRIMARY KEY,
  page VARCHAR(100),
  viewed_at TIMESTAMP DEFAULT NOW()
);
