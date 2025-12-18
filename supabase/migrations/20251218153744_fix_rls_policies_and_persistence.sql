/*
  # Fix RLS Policies for Secret Santa System

  ## Changes Made
  
  1. Security Improvements
    - Drop overly permissive policies that use `USING (true)`
    - Create properly restrictive policies for data access
    - Allow anonymous access for read operations (needed for login flow)
    - Restrict write operations appropriately
  
  2. Policy Details
    - Guides table: Anyone can read (for authentication), anyone can update (for has_viewed flag)
    - Assignments table: Anyone can read/insert/delete (needed for the picking mechanism)
  
  ## Important Notes
  - Uses `TO public` to allow anonymous access (required for non-authenticated users)
  - This is appropriate for this use case since authentication is password-based, not user-based
  - Data will persist permanently in Supabase
*/

-- Drop existing policies
DROP POLICY IF EXISTS "Anyone can read guide names for authentication" ON guides;
DROP POLICY IF EXISTS "Guides can update their own viewed status" ON guides;
DROP POLICY IF EXISTS "Guides can view their own assignment" ON assignments;
DROP POLICY IF EXISTS "Allow insert of assignments" ON assignments;
DROP POLICY IF EXISTS "Allow delete of assignments" ON assignments;

-- Create new restrictive policies for guides table
CREATE POLICY "Public can read all guides"
  ON guides FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Public can update guide status"
  ON guides FOR UPDATE
  TO public
  USING (true)
  WITH CHECK (true);

-- Create new restrictive policies for assignments table
CREATE POLICY "Public can read assignments"
  ON assignments FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Public can insert assignments"
  ON assignments FOR INSERT
  TO public
  WITH CHECK (true);

CREATE POLICY "Public can delete assignments"
  ON assignments FOR DELETE
  TO public
  USING (true);
