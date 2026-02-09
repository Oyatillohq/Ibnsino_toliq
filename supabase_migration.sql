-- 1. CLEAN UP (Optional - be careful if existing data exists)
-- DROP VIEW IF EXISTS student_albums;
-- DROP TABLE IF EXISTS audit_logs;
-- DROP TABLE IF EXISTS certificates;
-- DROP TABLE IF EXISTS students;
-- DROP TABLE IF EXISTS subjects;

-- 2. CREATE TABLES
CREATE TABLE students (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    name text NOT NULL UNIQUE,
    grade text, -- e.g. '7', '11', 'Bitiruvchi'
    created_at timestamp WITH time zone DEFAULT now()
);

CREATE TABLE subjects (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    name text NOT NULL UNIQUE,
    created_at timestamp WITH time zone DEFAULT now()
);

CREATE TABLE certificates (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    student_id uuid REFERENCES students(id) ON DELETE CASCADE,
    subject_id uuid REFERENCES subjects(id) ON DELETE RESTRICT,
    score integer,
    level text NOT NULL, -- A+, A, B, etc.
    year integer NOT NULL,
    image_url text NOT NULL,
    created_at timestamp WITH time zone DEFAULT now()
);

CREATE TABLE gallery (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    image_url text NOT NULL,
    description text,
    created_at timestamp WITH time zone DEFAULT now()
);

CREATE TABLE audit_logs (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    admin_id uuid REFERENCES auth.users(id),
    action_type text NOT NULL, -- 'INSERT', 'UPDATE', 'DELETE'
    table_name text NOT NULL,
    record_id uuid,
    details jsonb,
    created_at timestamp WITH time zone DEFAULT now()
);

-- 3. INSERT INITIAL SUBJECTS
INSERT INTO subjects (name) VALUES 
('Kimyo'), ('Biologiya'), ('Ona tili'), ('Rus tili'), ('Tarix'), ('Matematika')
ON CONFLICT (name) DO NOTHING;

-- 4. VIEWS FOR AGGREGATION
-- This view replaces the need for complex frontend reduction
CREATE OR REPLACE VIEW student_certificates_view AS
SELECT 
    s.id as student_id,
    s.name as student_name,
    s.grade as student_grade,
    c.year,
    jsonb_agg(
        jsonb_build_object(
            'id', c.id,
            'subject', sub.name,
            'level', c.level,
            'score', c.score,
            'image_url', c.image_url
        ) ORDER BY c.level ASC
    ) as certificates,
    min(c.level) as max_level -- Simplistic approach: A+ < A < B
FROM students s
JOIN certificates c ON s.id = c.student_id
JOIN subjects sub ON c.subject_id = sub.id
GROUP BY s.id, s.name, s.grade, c.year;

-- 5. STORAGE BUCKETS
-- (Note: Bucket creation usually happens via Dashboard or Admin API, 
-- but we define policies here)
-- Bucket name: 'certificates'

-- 6. SECURITY (RLS)
ALTER TABLE students ENABLE ROW LEVEL SECURITY;
ALTER TABLE subjects ENABLE ROW LEVEL SECURITY;
ALTER TABLE certificates ENABLE ROW LEVEL SECURITY;
ALTER TABLE gallery ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;

-- 6.1 Public Access
CREATE POLICY "Public Read Students" ON students FOR SELECT USING (true);
CREATE POLICY "Public Read Subjects" ON subjects FOR SELECT USING (true);
CREATE POLICY "Public Read Certificates" ON certificates FOR SELECT USING (true);
CREATE POLICY "Public Read Gallery" ON gallery FOR SELECT USING (true);

-- 6.2 Admin Access (Authenticated)
CREATE POLICY "Admin All Students" ON students TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Admin All Subjects" ON subjects TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Admin All Certificates" ON certificates TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Admin All Gallery" ON gallery TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Admin Read Logs" ON audit_logs TO authenticated USING (true);

-- 6.3 Storage Policies
-- Assuming bucket name is 'media'
-- Policy for public read from public bucket is default. 
-- Policy for authenticated upload:
/*
CREATE POLICY "Admin Upload" ON storage.objects FOR INSERT TO authenticated 
WITH CHECK (bucket_id = 'media');
*/

-- 7. AUDIT TRIGGER FUNCTION
CREATE OR REPLACE FUNCTION log_change()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO audit_logs (admin_id, action_type, table_name, record_id, details)
    VALUES (auth.uid(), TG_OP, TG_TABLE_NAME, 
            CASE WHEN TG_OP = 'DELETE' THEN OLD.id ELSE NEW.id END,
            CASE WHEN TG_OP = 'DELETE' THEN to_jsonb(OLD) ELSE to_jsonb(NEW) END);
    RETURN NULL;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER tr_audit_certs AFTER INSERT OR UPDATE OR DELETE ON certificates FOR EACH ROW EXECUTE FUNCTION log_change();
CREATE TRIGGER tr_audit_gallery AFTER INSERT OR UPDATE OR DELETE ON gallery FOR EACH ROW EXECUTE FUNCTION log_change();
