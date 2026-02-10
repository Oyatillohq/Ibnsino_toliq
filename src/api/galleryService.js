import { supabase } from './supabase'

export const galleryService = {
    async getGalleryItems() {
        if (!supabase) return { data: [], error: "Supabase not initialized" }
        try {
            const { data, error } = await supabase
                .from('gallery')
                .select('*')
                .order('created_at', { ascending: false })

            if (error) throw error
            return { data: data || [], error: null }
        } catch (err) {
            console.error("Gallery load error:", err)
            return { data: [], error: err.message }
        }
    }
}
