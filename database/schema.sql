-- Drop tables in reverse dependency order
DROP TABLE IF EXISTS ticket_responses CASCADE;
DROP TABLE IF EXISTS tickets CASCADE;
DROP TABLE IF EXISTS consultation_notes CASCADE;
DROP TABLE IF EXISTS consultations CASCADE;
DROP TABLE IF EXISTS reviews CASCADE;
DROP TABLE IF EXISTS news_articles CASCADE;
DROP TABLE IF EXISTS site_content CASCADE;
DROP TABLE IF EXISTS companies CASCADE;
DROP TABLE IF EXISTS users CASCADE;

-- USERS
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  first_name VARCHAR(100) NOT NULL,
  last_name VARCHAR(100) NOT NULL,
  role VARCHAR(20) NOT NULL DEFAULT 'user' CHECK (role IN ('admin', 'company', 'user')),
  phone VARCHAR(20) NOT NULL,
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
INSERT INTO users (email, password_hash, first_name, last_name, phone, role) VALUES
('admin@lfcyber.com', '$2a$10$VvRb0PQINA/65Y9p5kIloeuFUUyrr2SxHCnnmBoB8QEPuYdnAaVi2', 'Luã', 'Ferreira','555-555-5555', 'admin');

-- Company client user
INSERT INTO users (email, password_hash, first_name, last_name, phone, role) VALUES
('company@testcorp.com', '$2a$10$VvRb0PQINA/65Y9p5kIloeuFUUyrr2SxHCnnmBoB8QEPuYdnAaVi2', 'Maria', 'Santos', '555-555-5555', 'company');

-- Standard user
INSERT INTO users (email, password_hash, first_name, last_name, phone, role) VALUES
('user@example.com', '$2a$10$VvRb0PQINA/65Y9p5kIloeuFUUyrr2SxHCnnmBoB8QEPuYdnAaVi2', 'João', 'Silva', '555-555-5555', 'user');

-- Company profile for company client
INSERT INTO companies (user_id, company_name, industry, company_size, phone) VALUES
(2, 'TestCorp Solutions', 'Technology', '51-200', '(555) 123-4567');

-- Sample news articles
INSERT INTO news_articles (title, summary, content, category, is_published, author_id) VALUES
('Major Data Breach Exposes 50 Million Records',
 'A leading tech company suffered a massive data breach affecting millions of users worldwide.',
 'I don’t know if you’ve been following the news today, but it’s happened again. A tech giant has just suffered a massive data leak, exposing the information of no fewer than 50 million users worldwide.\n It’s the kind of thing you read and immediately think: "Here we go again, I have to change all my passwords." And yes, the short answer is that you probably really do need to change them.\n Having worked on the front lines of IT for years—and now diving headfirst into cybersecurity engineering—I see this script repeat itself with frightening frequency. We harbor the illusion that, simply because a company is a tech giant, it possesses impenetrable, bulletproof systems. But the day-to-day reality is that, often, what brings an operation crashing down is a very simple flaw. It could be a silly cloud configuration error, an employee falling for a well-crafted phishing email, or simply a lack of basic risk management and access controls.\n This only reinforces a point I’m constantly hammering home—a point that lies at the very foundation of the material I’ve been putting together on How Not to Get Hacked: true security starts with the basics.\n So, what was leaked this time? The usual package: names, email addresses, account details, and—most likely—passwords.\n So, setting the panic aside, what can we actually do right now to protect ourselves?\n Change the affected passwords: If you have an account with this service, change your password immediately. If you’ve committed the cardinal sin of reusing that same password for your bank account or personal email... change it there, too.\n Enable two-step verification (MFA): You know that extra code the app asks for in addition to your password? Turn that on for everything you possibly can. It might feel like a bit of a hassle when logging in, but it’s what will truly save your skin if someone ever gets hold of your password. Stay alert regarding emails and SMS: When a massive database like this ends up on the internet, the volume of targeted scams skyrockets. Be suspicious of any urgent message asking you to confirm your details or click a link to prevent your account from being blocked.\n The hard truth is that our data is out there, and leaks like this will continue to happen. Our role isn’t to try to control major corporations, but rather to do our homework—taking the necessary steps to make life as difficult as possible for anyone who tries to misuse our information.\n Stay safe!',
 'cyber_world', true, 1),

('New Cybersecurity Fundamentals Module Released',
 'Our latest course module covers essential password management and social engineering awareness.',
 'Anyone who has been following what I write here has likely noticed that I constantly harp on the importance of "doing the basics right." We see news of massive data breaches every day, but the truth is that most people aren''t hacked because of some ultra-complex software straight out of a Hollywood movie. They get hacked because they made simple mistakes in their day-to-day lives. \n That is exactly why I am thrilled to announce that I’ve just released a brand-new module for my course: *How Not to Get Hacked*. \n This time, I focused on two key pillars that—if you master them—can immediately cut your chances of facing online headaches by about 90%: Password Management and Social Engineering. \n Drawing on what I’ve seen in practice—both during my years in IT and now, with my focus on cybersecurity—here’s a sneak peek: \n 1. The End of the Password Notebook\n We already know that using "password123" your dog''s name, or your date of birth just doesn''t cut it anymore. And reusing the same strong password across every website is even worse (remember that article about data breaches?). But how is a normal human being supposed to remember 50 different, complex passwords? They can''t. In this module, I demystify password managers. I show you how you can create a single, strong password—a "master password"—and let a secure digital vault create, remember, and auto-fill all your other passwords for you. It takes a huge weight off your mind. \n \n2. The Famous "Gift of Gab" (Social Engineering)\n The modern hacker is, first and foremost, a skilled liar. It is far cheaper and easier to send you a fake email about an "overdue credit card bill"—or to message you on WhatsApp while pretending to be from your bank''s support team—than it is to attempt to breach a financial institution’s massive servers. They don’t hack machines; they hack emotions—usually fear or a sense of urgency. \nIn this lesson, I reveal the patterns that these scammers use. Once you understand how the trick works, you’ll never click a link on impulse again. \n The goal of this material—as always—is to steer clear of boring technical jargon. It’s information security translated into the real world, ready for you to apply right now. \n If you’d like to take a look and protect your own accounts (as well as your family’s), just check out the new module. \n All the best, and stay safe!',
 'course_news', true, 1),

('Why Two-Factor Authentication Is No Longer Optional',
 'Understanding the critical importance of 2FA in today’s threat landscape.',
 'You know that feeling of annoyance that hits when you type in your password perfectly, yet the site still asks for an extra code sent to your phone? I get it—it really breaks your flow. But we need to have a serious conversation about this.\n Having worked on the front lines of IT for nearly a decade—and now living and breathing cybersecurity engineering every single day, I can state one thing with absolute certainty: the password, on its own, is dead.\n In the old days, creating a strong password packed with special characters was enough. Today? With the massive data breaches occurring every week (like that leak involving 50 million users I mentioned the other day), your passwords are likely already circulating on some list somewhere on the internet. Cybercriminals no longer waste time "guessing" passwords; instead, they use bots to test thousands of leaked passwords across various websites every minute. If you reuse your email password for your social media accounts or your bank, it’s only a matter of time before someone gains access.\n That is why Two-Factor Authentication (2FA or MFA) is no longer optional. It has evolved from being just an "extra layer for the paranoid" into a fundamental requirement for digital survival. In fact, whenever I’m structuring the course materials for *How Not to Get Hacked*, I really hammer this point home. 2FA is the number one pillar. It’s completely pointless to worry about elaborate defensive tactics if your front door is left unlocked.\n 2FA acts like a bouncer at a nightclub. Even if an intruder has your ticket (your password), they still won’t get in without the VIP wristband (the unique code that only you have on your phone).\n In practical terms, here is what you need to do right now—without putting it off:\n Fortify your primary email: Enable 2FA on your Gmail, Outlook, or similar accounts. Your email acts as your master key; if someone gains access to it, they can reset the passwords for all your other accounts.\n Protect your inner circle: Enable 2FA on your WhatsApp and Instagram accounts. This eliminates 99% of the risk that you’ll fall victim to that classic scam involving a cloned profile asking your family for money.\n Move beyond SMS: Using SMS to receive your code is better than nothing, but the ideal solution is to use a code-generating app (such as Google Authenticator, Authy, or Microsoft Authenticator). It is far more secure against interception.\n Does it take a few extra seconds to log in? Yes, it does. But it saves you months of headaches trying to recover an entire digital life that has been compromised.\n Best regards, and stay safe!\n',
 'articles', true, 1);

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
