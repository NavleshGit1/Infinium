-- Create users table
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    age INTEGER,
    gender VARCHAR(50),
    allergies TEXT[],
    dietary_preferences TEXT[],
    calorie_goal INTEGER DEFAULT 2000,
    fitness_goal VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create family members table
CREATE TABLE IF NOT EXISTS family_members (
    id UUID PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    age INTEGER,
    gender VARCHAR(50),
    relationship VARCHAR(100),
    allergies TEXT[],
    dietary_restrictions TEXT[],
    medical_conditions TEXT[],
    calorie_goal INTEGER,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create food analysis table
CREATE TABLE IF NOT EXISTS food_analysis (
    id UUID PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    image_url VARCHAR(500) NOT NULL,
    cloudinary_public_id VARCHAR(255),
    analysis_data JSONB NOT NULL,
    date DATE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT unique_user_image_date UNIQUE(user_id, cloudinary_public_id, date)
);

-- Create diet plans table
CREATE TABLE IF NOT EXISTS diet_plans (
    id UUID PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    plan_data JSONB NOT NULL,
    duration_days INTEGER DEFAULT 7,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create nutrition recommendations table
CREATE TABLE IF NOT EXISTS nutrition_recommendations (
    id UUID PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    recommendations_data JSONB NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    valid_until TIMESTAMP
);

-- Create shopping list table
CREATE TABLE IF NOT EXISTS shopping_lists (
    id UUID PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    items JSONB NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create alerts table
CREATE TABLE IF NOT EXISTS alerts (
    id UUID PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    item_name VARCHAR(255) NOT NULL,
    category VARCHAR(100),
    expiration_date DATE,
    severity VARCHAR(50),
    message TEXT,
    dismissed BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_food_analysis_user ON food_analysis(user_id);
CREATE INDEX IF NOT EXISTS idx_food_analysis_date ON food_analysis(date);
CREATE INDEX IF NOT EXISTS idx_diet_plans_user ON diet_plans(user_id);
CREATE INDEX IF NOT EXISTS idx_diet_plans_active ON diet_plans(user_id, is_active);
CREATE INDEX IF NOT EXISTS idx_nutrition_recs_user ON nutrition_recommendations(user_id);
CREATE INDEX IF NOT EXISTS idx_family_members_user ON family_members(user_id);
CREATE INDEX IF NOT EXISTS idx_alerts_user ON alerts(user_id);

-- Enable Row Level Security
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE family_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE food_analysis ENABLE ROW LEVEL SECURITY;
ALTER TABLE diet_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE nutrition_recommendations ENABLE ROW LEVEL SECURITY;
ALTER TABLE shopping_lists ENABLE ROW LEVEL SECURITY;
ALTER TABLE alerts ENABLE ROW LEVEL SECURITY;

-- RLS Policies (users can only see their own data)
CREATE POLICY "Users can view own data" ON users
    FOR SELECT USING (auth.uid()::text = id::text);

CREATE POLICY "Users can update own data" ON users
    FOR UPDATE USING (auth.uid()::text = id::text);

CREATE POLICY "Users can view own family members" ON family_members
    FOR SELECT USING (auth.uid()::text = user_id::text);

CREATE POLICY "Users can insert own family members" ON family_members
    FOR INSERT WITH CHECK (auth.uid()::text = user_id::text);

CREATE POLICY "Users can view own food analysis" ON food_analysis
    FOR SELECT USING (auth.uid()::text = user_id::text);

CREATE POLICY "Users can insert own food analysis" ON food_analysis
    FOR INSERT WITH CHECK (auth.uid()::text = user_id::text);

CREATE POLICY "Users can view own diet plans" ON diet_plans
    FOR SELECT USING (auth.uid()::text = user_id::text);

CREATE POLICY "Users can insert own diet plans" ON diet_plans
    FOR INSERT WITH CHECK (auth.uid()::text = user_id::text);

CREATE POLICY "Users can view own recommendations" ON nutrition_recommendations
    FOR SELECT USING (auth.uid()::text = user_id::text);

CREATE POLICY "Users can view own shopping lists" ON shopping_lists
    FOR SELECT USING (auth.uid()::text = user_id::text);

CREATE POLICY "Users can view own alerts" ON alerts
    FOR SELECT USING (auth.uid()::text = user_id::text);

-- Note: If not using Supabase Auth, comment out RLS policies and modify your backend
-- to handle authorization manually
