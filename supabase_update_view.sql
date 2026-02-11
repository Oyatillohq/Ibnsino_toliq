-- student_certificates_view ni yangilash: Fanlar va Darajalar filtrini osonlashtirish uchun
CREATE OR REPLACE VIEW student_certificates_view AS
SELECT 
    min(id::text) as student_id,
    student_name,
    student_grade,
    year,
    -- Jamlangan sertifikatlar
    jsonb_agg(
        jsonb_build_object(
            'id', id,
            'subject', subject,
            'level', certificate_level,
            'score', dtm_score,
            'image_url', image_url
        ) ORDER BY certificate_level ASC
    ) as certificates,
    -- Filtr uchun jamlangan fanlar va darajalar (array ko'rinishida)
    array_agg(DISTINCT subject) as subjects,
    array_agg(DISTINCT certificate_level) as levels,
    min(certificate_level) as max_level
FROM certificates
GROUP BY student_name, student_grade, year;

GRANT SELECT ON student_certificates_view TO anon;
GRANT SELECT ON student_certificates_view TO authenticated;
