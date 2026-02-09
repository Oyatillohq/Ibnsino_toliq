import { supabase } from './supabase'

const EDGE_FUNCTION_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/api-gateway`

export const certificateService = {
    async getGroupedCertificates({ year, page = 1 }) {
        if (!supabase) return { data: [], count: 0 }
        try {
            const pageSize = 12
            let query = supabase.from('student_certificates_view').select('*', { count: 'exact' })

            if (year) query = query.eq('year', year)

            const { data, count, error } = await query
                .order('max_level', { ascending: true })
                .range((page - 1) * pageSize, page * pageSize - 1)

            if (error) throw error
            return { data: data || [], count: count || 0 }
        } catch (err) {
            console.error("Certificate load error:", err)
            return { data: [], count: 0, error: err.message }
        }
    },

    async uploadCertificate(formData) {
        if (!supabase) throw new Error("Supabase is not initialized")
        const { data, error } = await supabase.functions.invoke('api-gateway/upload', {
            method: 'POST',
            body: formData
        })
        if (error) throw error
        return data
    },

    async getSubjects() {
        if (!supabase) return []
        try {
            const { data, error } = await supabase.from('subjects').select('*')
            if (error) throw error
            return data || []
        } catch (err) {
            console.error("Subjects load error:", err)
            return []
        }
    }
}
