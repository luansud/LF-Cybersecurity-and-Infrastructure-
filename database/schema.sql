


-- USERS
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  first_name VARCHAR(100) NOT NULL,
  last_name VARCHAR(100) NOT NULL,
  role VARCHAR(20) NOT NULL DEFAULT 'user' CHECK (role IN ('admin', 'company', 'user')),
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- COMPANIES
CREATE TABLE companies (
  id SERIAL PRIMARY KEY,
  user_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  company_name VARCHAR(255) NOT NULL,
  industry VARCHAR(100),
  company_size VARCHAR(50) CHECK (company_size IN ('1-10', '11-50', '51-200', '200+')),
  phone VARCHAR(20),
  website VARCHAR(255),
  created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- CONSULTATIONS
CREATE TABLE consultations (
  id SERIAL PRIMARY KEY,
  company_id INT NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  status VARCHAR(30) NOT NULL DEFAULT 'submitted' CHECK (status IN ('submitted', 'under_review', 'proposal_sent', 'in_progress', 'completed', 'cancelled')),
  priority VARCHAR(20) NOT NULL DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high')),
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- CONSULTATION NOTES
CREATE TABLE consultation_notes (
  id SERIAL PRIMARY KEY,
  consultation_id INT NOT NULL REFERENCES consultations(id) ON DELETE CASCADE,
  user_id INT REFERENCES users(id) ON DELETE SET NULL,
  note TEXT NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- REVIEWS
CREATE TABLE reviews (
  id SERIAL PRIMARY KEY,
  user_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  rating INT NOT NULL CHECK (rating >= 1 AND rating <= 5),
  review_type VARCHAR(20) NOT NULL CHECK (review_type IN ('course', 'consulting')),
  is_approved BOOLEAN NOT NULL DEFAULT false,
  is_flagged BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- TICKETS
CREATE TABLE tickets (
  id SERIAL PRIMARY KEY,
  user_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  subject VARCHAR(255) NOT NULL,
  message TEXT NOT NULL,
  status VARCHAR(20) NOT NULL DEFAULT 'open' CHECK (status IN ('open', 'in_progress', 'resolved', 'closed')),
  priority VARCHAR(20) NOT NULL DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high')),
  category VARCHAR(50) NOT NULL CHECK (category IN ('course', 'consulting', 'account', 'other')),
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- TICKET RESPONSES
CREATE TABLE ticket_responses (
  id SERIAL PRIMARY KEY,
  ticket_id INT NOT NULL REFERENCES tickets(id) ON DELETE CASCADE,
  user_id INT REFERENCES users(id) ON DELETE SET NULL,
  message TEXT NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- NEWS ARTICLES
CREATE TABLE news_articles (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  summary TEXT,
  content TEXT NOT NULL,
  category VARCHAR(30) NOT NULL CHECK (category IN ('cyber_world', 'articles', 'course_news')),
  image_url VARCHAR(500),
  is_published BOOLEAN NOT NULL DEFAULT false,
  author_id INT REFERENCES users(id) ON DELETE SET NULL,
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- SITE CONTENT (dynamic editable content)
CREATE TABLE site_content (
  id SERIAL PRIMARY KEY,
  section VARCHAR(50) NOT NULL,
  content_key VARCHAR(100) NOT NULL,
  content_value TEXT NOT NULL,
  updated_by INT REFERENCES users(id) ON DELETE SET NULL,
  updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
  UNIQUE(section, content_key)
);

-- INDEXES for performance
CREATE INDEX idx_consultations_company ON consultations(company_id);
CREATE INDEX idx_consultations_status ON consultations(status);
CREATE INDEX idx_tickets_user ON tickets(user_id);
CREATE INDEX idx_tickets_status ON tickets(status);
CREATE INDEX idx_reviews_user ON reviews(user_id);
CREATE INDEX idx_reviews_approved ON reviews(is_approved);
CREATE INDEX idx_news_category ON news_articles(category);
CREATE INDEX idx_news_published ON news_articles(is_published);

-- SEED DATA

-- Admin user (password: P@$$w0rd!)
-- bcrypt hash for P@$$w0rd!
INSERT INTO users (email, password_hash, first_name, last_name, role) VALUES
('admin@lfcyber.com', '$2a$10$XKvlSmQPyyJBKcjxf11bNuM4uQfL7LwvayHTLc1yHMSbTNKLkmwMe', 'Luã', 'Ferreira', 'admin');

-- Company client user
INSERT INTO users (email, password_hash, first_name, last_name, role) VALUES
('company@testcorp.com', '$2a$10$XKvlSmQPyyJBKcjxf11bNuM4uQfL7LwvayHTLc1yHMSbTNKLkmwMe', 'Maria', 'Santos', 'company');

-- Standard user
INSERT INTO users (email, password_hash, first_name, last_name, role) VALUES
('user@example.com', '$2a$10$XKvlSmQPyyJBKcjxf11bNuM4uQfL7LwvayHTLc1yHMSbTNKLkmwMe', 'João', 'Silva', 'user');

-- Company profile for company client
INSERT INTO companies (user_id, company_name, industry, company_size, phone) VALUES
(2, 'TestCorp Solutions', 'Technology', '51-200', '(555) 123-4567');


-- Sample consultation
INSERT INTO consultations (company_id, title, description, status, priority) VALUES
(1, 'Network Security Assessment', 'We need a comprehensive assessment of our corporate network security infrastructure, including firewall configuration, VPN setup, and intrusion detection systems.', 'in_progress', 'high');

-- Sample consultation notes
INSERT INTO consultation_notes (consultation_id, user_id, note) VALUES
(1, 1, 'Initial assessment scheduled. Will review firewall configurations and network topology.'),
(1, 2, 'Shared access credentials for the staging environment as requested.');

-- Sample review
INSERT INTO reviews (user_id, content, rating, review_type, is_approved) VALUES
(3, 'The cybersecurity course is extremely well structured. I learned so much about protecting my online accounts and identifying phishing attempts. Highly recommended for anyone who uses the internet daily.', 5, 'course', true);

-- Sample tickets
INSERT INTO tickets (user_id, subject, message, status, category) VALUES
(3, 'Cannot access course module 3', 'I completed modules 1 and 2 but module 3 shows as locked on Hotmart. Can you help?', 'open', 'course'),
(2, 'Request updated security report', 'Could you provide the latest vulnerability scan report for our Q1 assessment?', 'in_progress', 'consulting');

-- Sample ticket response
INSERT INTO ticket_responses (ticket_id, user_id, message) VALUES
(2, 1, 'Hi Maria, I am preparing the Q1 vulnerability report now. You should have it by end of this week.');

-- Site content
INSERT INTO site_content (section, content_key, content_value, updated_by) VALUES
('home', 'hero_title', 'Protect Your Digital World', 1),
('home', 'hero_subtitle', 'Expert cybersecurity education for individuals and consulting services for businesses', 1),
('home', 'course_banner_title', 'Video Course for Individuals', 1),
('home', 'course_banner_text', 'Learn to protect yourself online with our comprehensive cybersecurity fundamentals course', 1),
('home', 'consulting_banner_title', 'Consulting for Businesses', 1),
('home', 'consulting_banner_text', 'Professional cybersecurity assessment and infrastructure protection for your company', 1),
('course', 'page_title', 'Cybersecurity Fundamentals Course', 1),
('course', 'page_description', 'A comprehensive video course designed to teach you essential internet security practices', 1),
('course', 'hotmart_url', 'https://hotmart.com/your-course-link', 1),
('consulting', 'page_title', 'Cybersecurity Consulting Services', 1),
('consulting', 'page_description', 'Professional cybersecurity assessment, infrastructure protection, and ongoing security consulting for businesses of all sizes', 1),
('about', 'bio', 'Cybersecurity professional with experience in network security, penetration testing, and security awareness training.', 1);
