/*
  # Seed Initial Guides with Passwords

  Add 20 guides with unique passwords for Secret Santa 2024
*/

INSERT INTO guides (name, password) VALUES
  ('Prasanna Volturi', 'prasanna2024'),
  ('Sadwika Jabisetti', 'sadwika2024'),
  ('Jarghi M', 'jarghi2024'),
  ('Jhansi Tunga', 'jhansi2024'),
  ('Gopina Nikhil', 'gopina2024'),
  ('Kotagiri Sai Raj', 'kotagiri2024'),
  ('Likhitha Sadu', 'likhitha2024'),
  ('Maheshwari Nookala', 'maheshwari2024'),
  ('Mommita Mittapelli', 'mommita2024'),
  ('Pastham Divya', 'pastham2024'),
  ('Prashanth Autukla', 'prashanth2024'),
  ('Sirikonda Raghu', 'sirikonda2024'),
  ('Veeramreddy venkata sai kumar reddy', 'veeramreddy2024'),
  ('Vemula Bhanuja', 'vemula2024'),
  ('Vijay Srineman H', 'vijay2024'),
  ('Ramyasri Goka', 'ramyasri2024'),
  ('Rakshitha Masagala', 'rakshitha2024'),
  ('Suresh Srija', 'suresh2024'),
  ('Abhi Raju Dev', 'abhi2024'),
  ('Prakasham Mallaram', 'prakasham2024')
ON CONFLICT (name) DO NOTHING;