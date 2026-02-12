import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from "@supabase/supabase-js"

const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
    // Handle CORS
    if (req.method === 'OPTIONS') {
        return new Response('ok', { headers: corsHeaders })
    }

    try {
        const supabaseUrl = Deno.env.get('SUPABASE_URL') ?? ''
        const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
        const supabase = createClient(supabaseUrl, supabaseKey)

        const url = new URL(req.url)
        const path = url.pathname.split('/').pop()
        const method = req.method

        // GET /certificates
        if (method === 'GET' && path === 'certificates') {
            const year = url.searchParams.get('year')
            const page = parseInt(url.searchParams.get('page') || '1')
            const pageSize = 12

            let query = supabase.from('student_certificates_view').select('*', { count: 'exact' })
            if (year) query = query.eq('year', year)

            const { data, count, error } = await query
                .order('max_level', { ascending: false })
                .range((page - 1) * pageSize, page * pageSize - 1)

            if (error) throw error
            return new Response(JSON.stringify({ data, count }), {
                headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            })
        }

        // POST /upload (Admin only)
        if (method === 'POST' && path === 'upload') {
            // Basic Auth Check
            const authHeader = req.headers.get('Authorization')
            const token = authHeader?.replace('Bearer ', '') || ''
            const { data: { user }, error: authError } = await supabase.auth.getUser(token)
            if (authError || !user) {
                return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401, headers: corsHeaders })
            }

            const formData = await req.formData()
            const studentName = formData.get('student_name') as string
            const grade = formData.get('grade') as string
            const year = formData.get('year') as string
            const subjectId = formData.get('subject_id') as string
            const level = formData.get('level') as string
            const file = formData.get('file') as File

            // Validation
            if (!file || file.size > 2 * 1024 * 1024) {
                return new Response(JSON.stringify({ error: 'File too large (max 2MB)' }), { status: 400, headers: corsHeaders })
            }
            if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) {
                return new Response(JSON.stringify({ error: 'Invalid file type' }), { status: 400, headers: corsHeaders })
            }

            // 1. Find or Create Student
            let { data: student, error: sErr } = await supabase
                .from('students')
                .select('id')
                .eq('name', studentName)
                .single()

            if (!student) {
                const { data: newStudent, error: nsErr } = await supabase
                    .from('students')
                    .insert({ name: studentName, grade })
                    .select('id')
                    .single()
                if (nsErr) throw nsErr
                student = newStudent
            }

            if (!student) {
                throw new Error('Could not find or create student')
            }

            // 2. Upload to Storage
            const fileExt = file.name.split('.').pop()
            const fileName = `${student.id}/${Date.now()}.${fileExt}`
            const { data: uploadData, error: uErr } = await supabase.storage
                .from('media')
                .upload(fileName, file)
            if (uErr) throw uErr

            const imageUrl = supabase.storage.from('media').getPublicUrl(fileName).data.publicUrl

            // 3. Insert Certificate
            const { error: cErr } = await supabase.from('certificates').insert({
                student_id: student.id,
                subject_id: subjectId,
                level,
                year,
                image_url: imageUrl
            })
            if (cErr) throw cErr

            return new Response(JSON.stringify({ success: true }), {
                headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            })
        }

        return new Response(JSON.stringify({ error: 'Not Found' }), { status: 404, headers: corsHeaders })

    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error'
        return new Response(JSON.stringify({ error: errorMessage }), {
            status: 500,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        })
    }
})
