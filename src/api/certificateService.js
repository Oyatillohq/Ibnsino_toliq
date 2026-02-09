import { supabase } from './supabase'

export const certificateService = {
    async getGroupedCertificates({ year, page = 1 }) {
        if (!supabase) {
            return {
                data: [],
                count: 0,
                error: "Supabase ulanishi mavjud emas. Netlify-da VITE_SUPABASE_URL va VITE_SUPABASE_ANON_KEY sozlangani va sayt qayta deploy qilinganiga ishonch hosil qiling."
            }
        }
        try {
            const pageSize = 12
            // View-dan ma'lumot olish
            let query = supabase.from('student_certificates_view').select('*', { count: 'exact' })

            if (year) query = query.eq('year', year)

            const { data, count, error } = await query
                .order('max_level', { ascending: true })
                .range((page - 1) * pageSize, page * pageSize - 1)

            if (error) {
                // Agar view bo'lmasa, certificates jadvalini o'zidan olishga harakat qilamiz
                console.warn("View topilmadi, jadvaldan olinmoqda...");
                let fallbackQuery = supabase.from('certificates').select('*')
                if (year) fallbackQuery = fallbackQuery.eq('year', year)
                const { data: fallbackData, error: fallbackError } = await fallbackQuery;
                if (fallbackError) throw fallbackError;

                // Gruppalash (Simplified)
                const groups = [];
                const students = [...new Set(fallbackData.map(d => d.student_name))];
                students.forEach(name => {
                    const studentCerts = fallbackData.filter(d => d.student_name === name);
                    groups.push({
                        student_id: studentCerts[0].id,
                        student_name: name,
                        student_grade: studentCerts[0].student_grade,
                        year: studentCerts[0].year,
                        certificates: studentCerts,
                        max_level: studentCerts[0].certificate_level
                    });
                });
                return { data: groups, count: groups.length }
            }
            return { data: data || [], count: count || 0 }
        } catch (err) {
            console.error("Certificate load error:", err)
            return { data: [], count: 0, error: err.message }
        }
    }
}
