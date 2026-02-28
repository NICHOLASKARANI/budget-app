-- Users table
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    currency VARCHAR(3) DEFAULT 'USD',
    starting_balance DECIMAL(10, 2) DEFAULT 0,
    pay_frequency VARCHAR(20) DEFAULT 'Monthly',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Settings table (matches Sheet 2)
CREATE TABLE IF NOT EXISTS settings (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    setting_key VARCHAR(50) NOT NULL,
    setting_value TEXT,
    UNIQUE(user_id, setting_key)
);

-- Income table (matches Sheet 3)
CREATE TABLE IF NOT EXISTS income (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    date DATE NOT NULL,
    source VARCHAR(100) NOT NULL,
    category VARCHAR(50) NOT NULL,
    amount DECIMAL(10, 2) NOT NULL,
    month VARCHAR(20) GENERATED ALWAYS AS (TO_CHAR(date, 'Month')) STORED,
    year INTEGER GENERATED ALWAYS AS (EXTRACT(YEAR FROM date)) STORED,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Expenses table (matches Sheet 4)
CREATE TABLE IF NOT EXISTS expenses (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    date DATE NOT NULL,
    name VARCHAR(100) NOT NULL,
    category VARCHAR(50) NOT NULL,
    type VARCHAR(20) CHECK (type IN ('Fixed', 'Variable')) NOT NULL,
    amount DECIMAL(10, 2) NOT NULL,
    month VARCHAR(20) GENERATED ALWAYS AS (TO_CHAR(date, 'Month')) STORED,
    year INTEGER GENERATED ALWAYS AS (EXTRACT(YEAR FROM date)) STORED,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Budget categories (matches Sheet 5)
CREATE TABLE IF NOT EXISTS budgets (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    category VARCHAR(50) NOT NULL,
    budget_amount DECIMAL(10, 2) NOT NULL,
    month INTEGER NOT NULL,
    year INTEGER NOT NULL,
    UNIQUE(user_id, category, month, year)
);

-- Net worth tracking (matches Sheet 8)
CREATE TABLE IF NOT EXISTS net_worth (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    month VARCHAR(20) NOT NULL,
    year INTEGER NOT NULL,
    assets DECIMAL(10, 2) DEFAULT 0,
    liabilities DECIMAL(10, 2) DEFAULT 0,
    net_worth DECIMAL(10, 2) GENERATED ALWAYS AS (assets - liabilities) STORED,
    UNIQUE(user_id, month, year)
);

-- Savings goals (matches Sheet 9)
CREATE TABLE IF NOT EXISTS savings_goals (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    goal_name VARCHAR(100) NOT NULL,
    target_amount DECIMAL(10, 2) NOT NULL,
    saved_amount DECIMAL(10, 2) DEFAULT 0,
    remaining DECIMAL(10, 2) GENERATED ALWAYS AS (target_amount - saved_amount) STORED,
    progress DECIMAL(5,2) GENERATED ALWAYS AS ((saved_amount / target_amount) * 100) STORED,
    target_date DATE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Subscriptions (matches Sheet 10 - HIGH VALUE FEATURE)
CREATE TABLE IF NOT EXISTS subscriptions (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    service_name VARCHAR(100) NOT NULL,
    cost DECIMAL(10, 2) NOT NULL,
    billing_cycle VARCHAR(20) CHECK (billing_cycle IN ('Monthly', 'Quarterly', 'Yearly')) NOT NULL,
    next_payment_date DATE NOT NULL,
    category VARCHAR(50) DEFAULT 'Subscriptions',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for better performance
CREATE INDEX idx_income_user_date ON income(user_id, date);
CREATE INDEX idx_expenses_user_date ON expenses(user_id, date);
CREATE INDEX idx_budgets_user_month ON budgets(user_id, year, month);
CREATE INDEX idx_subscriptions_next_payment ON subscriptions(next_payment_date);
