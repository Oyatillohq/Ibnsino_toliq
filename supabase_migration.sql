-- 1. BACKUP OLD TABLES (Instead of dropping, we rename them to keep data)
DO $$ 
BEGIN
    IF EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'students') THEN
        ALTER TABLE students RENAME TO students_backup;
    END IF;
    IF EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'subjects') THEN
        ALTER TABLE subjects RENAME TO subjects_backup;
    END IF;
    -- Note: if 'certificates' already exists with old schema, we might need to recreate it
    -- For safety, if it doesn't have student_name column, rename it
    IF EXISTS (SELECT FROM information_schema.columns WHERE table_name = 'certificates' AND column_name = 'student_id') THEN
        ALTER TABLE certificates RENAME TO certificates_old;
    END IF;
END $$;

-- 2. CREATE NEW FLAT STRUCTURE (Matches Admin JS)
CREATE TABLE IF NOT EXISTS gallery (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    image_url text NOT NULL,
    description text,
    created_at timestamp WITH time zone DEFAULT now()
);

-- Flat table for certificates (Matches Admin JS code)
CREATE TABLE IF NOT EXISTS certificates (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    student_name text NOT NULL,
    student_grade text, -- e.g. '7', '11', 'Bitiruvchi'
    subject text NOT NULL, -- e.g. 'Kimyo', 'Biologiya'
    certificate_level text NOT NULL, -- A+, A, DTM etc.
    dtm_score integer,
    year integer NOT NULL,
    image_url text NOT NULL,
    created_at timestamp WITH time zone DEFAULT now()
);

CREATE TABLE IF NOT EXISTS audit_logs (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    admin_id uuid,
    action_type text NOT NULL,
    table_name text NOT NULL,
    record_id uuid,
    details jsonb,
    created_at timestamp WITH time zone DEFAULT now()
);

-- 3. CREATE VIEW FOR FRONTEND (Grouping by student)
DROP VIEW IF EXISTS student_certificates_view;
CREATE OR REPLACE VIEW student_certificates_view AS
SELECT 
    min(id::text) as student_id, -- Used by Frontend as key
    student_name,
    student_grade,
    year,
    jsonb_agg(
        jsonb_build_object(
            'id', id,
            'subject', subject,
            'level', certificate_level,
            'score', dtm_score,
            'image_url', image_url
        ) ORDER BY certificate_level ASC
    ) as certificates,
    min(certificate_level) as max_level
FROM certificates
GROUP BY student_name, student_grade, year;

-- 4. SECURITY (RLS)
ALTER TABLE certificates ENABLE ROW LEVEL SECURITY;
ALTER TABLE gallery ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;

-- Public Access
CREATE POLICY "Public Read Certificates" ON certificates FOR SELECT USING (true);
CREATE POLICY "Public Read Gallery" ON gallery FOR SELECT USING (true);

-- Admin Access
CREATE POLICY "Admin All Certificates" ON certificates TO authenticated USING (auth.uid() IS NOT NULL) WITH CHECK (auth.uid() IS NOT NULL);
CREATE POLICY "Admin All Gallery" ON gallery TO authenticated USING (auth.uid() IS NOT NULL) WITH CHECK (auth.uid() IS NOT NULL);
CREATE POLICY "Admin Read Logs" ON audit_logs TO authenticated USING (auth.uid() IS NOT NULL);

-- GRANT permissions for the view
GRANT SELECT ON student_certificates_view TO anon;
GRANT SELECT ON student_certificates_view TO authenticated;

-- 5. STORAGE POLICIES (Bucket: certificates)
-- Note: Make sure the bucket 'certificates' is set to public in Supabase dashboard
CREATE POLICY "Public Read Storage" ON storage.objects FOR SELECT USING (bucket_id = 'certificates');
CREATE POLICY "Admin Manage Storage" ON storage.objects FOR ALL TO authenticated USING (bucket_id = 'certificates') WITH CHECK (bucket_id = 'certificates');

-- 6. AUDIT TRIGGER
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

DROP TRIGGER IF EXISTS tr_audit_certs ON certificates;
CREATE TRIGGER tr_audit_certs AFTER INSERT OR UPDATE OR DELETE ON certificates FOR EACH ROW EXECUTE FUNCTION log_change();

DROP TRIGGER IF EXISTS tr_audit_gallery ON gallery;
CREATE TRIGGER tr_audit_gallery AFTER INSERT OR UPDATE OR DELETE ON gallery FOR EACH ROW EXECUTE FUNCTION log_change();
