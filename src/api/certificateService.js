import { supabase } from './supabase'

const EDGE_FUNCTION_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/api-gateway`

export const certificateService = {
    async getGroupedCertificates({ year, page = 1 }) {
        const params = new URLSearchParams({ year: year || '', page: page.toString() })
        const { data, error } = await supabase.functions.invoke('api-gateway/certificates', {
            method: 'GET',
            queryParams: params
        })
        if (error) throw error
        return data
    },

    async uploadCertificate(formData) {
        // We send form data to the Edge Function
        const { data, error } = await supabase.functions.invoke('api-gateway/upload', {
            method: 'POST',
            body: formData
        })
        if (error) throw error
        return data
    },

    async getSubjects() {
        const { data, error } = await supabase.from('subjects').select('*')
        if (error) throw error
        return data
    }
}
