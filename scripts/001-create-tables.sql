-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create news_articles table
CREATE TABLE IF NOT EXISTS news_articles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  content TEXT NOT NULL,
  image TEXT NOT NULL,
  date DATE NOT NULL,
  category TEXT NOT NULL,
  views INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create statements table
CREATE TABLE IF NOT EXISTS statements (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  content TEXT NOT NULL,
  image TEXT NOT NULL,
  date DATE NOT NULL,
  views INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create page_content table
CREATE TABLE IF NOT EXISTS page_content (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  page_id TEXT UNIQUE NOT NULL,
  page_title TEXT NOT NULL,
  hero_image TEXT,
  last_modified TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create page_sections table
CREATE TABLE IF NOT EXISTS page_sections (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  page_id TEXT NOT NULL,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  image TEXT,
  order_number INTEGER NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  FOREIGN KEY (page_id) REFERENCES page_content(page_id) ON DELETE CASCADE
);

-- Create leaders table
CREATE TABLE IF NOT EXISTS leaders (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  position TEXT NOT NULL,
  is_main BOOLEAN DEFAULT FALSE,
  image TEXT,
  order_number INTEGER NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_news_date ON news_articles(date DESC);
CREATE INDEX IF NOT EXISTS idx_news_category ON news_articles(category);
CREATE INDEX IF NOT EXISTS idx_statements_date ON statements(date DESC);
CREATE INDEX IF NOT EXISTS idx_page_sections_page_id ON page_sections(page_id);
CREATE INDEX IF NOT EXISTS idx_page_sections_order ON page_sections(page_id, order_number);
CREATE INDEX IF NOT EXISTS idx_leaders_order ON leaders(order_number);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Add triggers for updated_at
CREATE TRIGGER update_news_articles_updated_at BEFORE UPDATE ON news_articles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_statements_updated_at BEFORE UPDATE ON statements
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_page_content_updated_at BEFORE UPDATE ON page_content
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_page_sections_updated_at BEFORE UPDATE ON page_sections
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_leaders_updated_at BEFORE UPDATE ON leaders
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Enable Row Level Security (RLS)
ALTER TABLE news_articles ENABLE ROW LEVEL SECURITY;
ALTER TABLE statements ENABLE ROW LEVEL SECURITY;
ALTER TABLE page_content ENABLE ROW LEVEL SECURITY;
ALTER TABLE page_sections ENABLE ROW LEVEL SECURITY;
ALTER TABLE leaders ENABLE ROW LEVEL SECURITY;

-- Create policies for public read access
CREATE POLICY "Allow public read access on news_articles" ON news_articles FOR SELECT USING (true);
CREATE POLICY "Allow public read access on statements" ON statements FOR SELECT USING (true);
CREATE POLICY "Allow public read access on page_content" ON page_content FOR SELECT USING (true);
CREATE POLICY "Allow public read access on page_sections" ON page_sections FOR SELECT USING (true);
CREATE POLICY "Allow public read access on leaders" ON leaders FOR SELECT USING (true);

-- Create policies for authenticated users (admin) to manage data
CREATE POLICY "Allow authenticated insert on news_articles" ON news_articles FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow authenticated update on news_articles" ON news_articles FOR UPDATE USING (true);
CREATE POLICY "Allow authenticated delete on news_articles" ON news_articles FOR DELETE USING (true);

CREATE POLICY "Allow authenticated insert on statements" ON statements FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow authenticated update on statements" ON statements FOR UPDATE USING (true);
CREATE POLICY "Allow authenticated delete on statements" ON statements FOR DELETE USING (true);

CREATE POLICY "Allow authenticated insert on page_content" ON page_content FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow authenticated update on page_content" ON page_content FOR UPDATE USING (true);
CREATE POLICY "Allow authenticated delete on page_content" ON page_content FOR DELETE USING (true);

CREATE POLICY "Allow authenticated insert on page_sections" ON page_sections FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow authenticated update on page_sections" ON page_sections FOR UPDATE USING (true);
CREATE POLICY "Allow authenticated delete on page_sections" ON page_sections FOR DELETE USING (true);

CREATE POLICY "Allow authenticated insert on leaders" ON leaders FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow authenticated update on leaders" ON leaders FOR UPDATE USING (true);
CREATE POLICY "Allow authenticated delete on leaders" ON leaders FOR DELETE USING (true);
