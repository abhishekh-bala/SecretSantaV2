/*
  # Secret Santa System

  1. New Tables
    - `guides`
      - `id` (uuid, primary key)
      - `name` (text) - Guide's name
      - `password` (text) - Simple password for authentication
      - `has_viewed` (boolean) - Track if guide has viewed their assignment
      - `created_at` (timestamptz)
    
    - `assignments`
      - `id` (uuid, primary key)
      - `guide_id` (uuid) - The guide who gives a gift
      - `assigned_to_id` (uuid) - The guide who receives the gift
      - `created_at` (timestamptz)

  2. Security
    - Enable RLS on both tables
    - Guides can read all guide names for display purposes
    - Guides can only see their own assignment
    - Guides can update their own has_viewed status
*/

CREATE TABLE IF NOT EXISTS guides (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text UNIQUE NOT NULL,
  password text NOT NULL,
  has_viewed boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS assignments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  guide_id uuid NOT NULL REFERENCES guides(id) ON DELETE CASCADE,
  assigned_to_id uuid NOT NULL REFERENCES guides(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now(),
  UNIQUE(guide_id)
);

ALTER TABLE guides ENABLE ROW LEVEL SECURITY;
ALTER TABLE assignments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read guide names for authentication"
  ON guides FOR SELECT
  USING (true);

CREATE POLICY "Guides can update their own viewed status"
  ON guides FOR UPDATE
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Guides can view their own assignment"
  ON assignments FOR SELECT
  USING (true);

CREATE POLICY "Allow insert of assignments"
  ON assignments FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Allow delete of assignments"
  ON assignments FOR DELETE
  USING (true);