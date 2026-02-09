-- ============================================
-- ADMIN PANEL UCHUN TO'LIQ SUPABASE SOZLAMALARI
-- ============================================

-- 1. JADVALLARNI TOZALASH VA QAYTA YARATISH
DROP TABLE IF EXISTS audit_logs CASCADE;
DROP TABLE IF EXISTS gallery CASCADE;
DROP TABLE IF EXISTS certificates CASCADE;
DROP VIEW IF EXISTS student_certificates_view;

-- 2. ASOSIY JADVALLAR
CREATE TABLE certificates (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    student_name text NOT NULL,
    student_grade text,
    subject text NOT NULL,
    certificate_level text NOT NULL,
    dtm_score integer,
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
    admin_id uuid,
    action_type text NOT NULL,
    table_name text NOT NULL,
    record_id uuid,
    details jsonb,
    created_at timestamp WITH time zone DEFAULT now()
);

-- 3. VIEW (Frontend uchun)
CREATE OR REPLACE VIEW student_certificates_view AS
SELECT 
    min(id::text) as student_id,
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

-- 4. RLS (Row Level Security)
ALTER TABLE certificates ENABLE ROW LEVEL SECURITY;
ALTER TABLE gallery ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;

-- Eski policylarni o'chirish
DROP POLICY IF EXISTS "Public Read Certificates" ON certificates;
DROP POLICY IF EXISTS "Public Read Gallery" ON gallery;
DROP POLICY IF EXISTS "Admin All Certificates" ON certificates;
DROP POLICY IF EXISTS "Admin All Gallery" ON gallery;
DROP POLICY IF EXISTS "Admin Read Logs" ON audit_logs;

-- Yangi policylar
CREATE POLICY "Public Read Certificates" ON certificates FOR SELECT USING (true);
CREATE POLICY "Public Read Gallery" ON gallery FOR SELECT USING (true);
CREATE POLICY "Admin All Certificates" ON certificates TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Admin All Gallery" ON gallery TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Admin Read Logs" ON audit_logs TO authenticated FOR SELECT USING (true);

-- View uchun ruxsatlar
GRANT SELECT ON student_certificates_view TO anon;
GRANT SELECT ON student_certificates_view TO authenticated;

-- 5. STORAGE POLICIES (JUDA MUHIM!)
-- Avval eski policylarni o'chirish
DROP POLICY IF EXISTS "Public Read Storage" ON storage.objects;
DROP POLICY IF EXISTS "Admin Manage Storage" ON storage.objects;
DROP POLICY IF EXISTS "Public can view images" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can upload" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can update" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can delete" ON storage.objects;

-- Yangi storage policies
CREATE POLICY "Public can view images" 
ON storage.objects FOR SELECT 
USING (bucket_id = 'certificates');

CREATE POLICY "Authenticated users can upload" 
ON storage.objects FOR INSERT 
TO authenticated 
WITH CHECK (bucket_id = 'certificates');

CREATE POLICY "Authenticated users can update" 
ON storage.objects FOR UPDATE 
TO authenticated 
USING (bucket_id = 'certificates');

CREATE POLICY "Authenticated users can delete" 
ON storage.objects FOR DELETE 
TO authenticated 
USING (bucket_id = 'certificates');

-- 6. AUDIT TRIGGER
CREATE OR REPLACE FUNCTION log_change()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO audit_logs (admin_id, action_type, table_name, record_id, details)
    VALUES (
        auth.uid(), 
        TG_OP, 
        TG_TABLE_NAME, 
        CASE WHEN TG_OP = 'DELETE' THEN OLD.id ELSE NEW.id END,
        CASE WHEN TG_OP = 'DELETE' THEN to_jsonb(OLD) ELSE to_jsonb(NEW) END
    );
    RETURN NULL;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS tr_audit_certs ON certificates;
CREATE TRIGGER tr_audit_certs 
AFTER INSERT OR UPDATE OR DELETE ON certificates 
FOR EACH ROW EXECUTE FUNCTION log_change();

DROP TRIGGER IF EXISTS tr_audit_gallery ON gallery;
CREATE TRIGGER tr_audit_gallery 
AFTER INSERT OR UPDATE OR DELETE ON gallery 
FOR EACH ROW EXECUTE FUNCTION log_change();

-- 7. BUCKET YARATISH (Agar mavjud bo'lmasa)
INSERT INTO storage.buckets (id, name, public)
VALUES ('certificates', 'certificates', true)
ON CONFLICT (id) DO UPDATE SET public = true;
