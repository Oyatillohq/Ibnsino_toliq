# IBN SINO Project Migration Guide

## 1. Project Structure
- `legacy/` : Original CDN-based version.
- `src/` : New Vite + Vue 3 Single File Components.
- `supabase/functions/` : Edge Functions for secure API.
- `supabase_migration.sql` : New SQL schema and RLS policies.

## 2. Backend Setup
1. Go to Supabase Dashboard -> SQL Editor.
2. Run the code in `supabase_migration.sql`.
3. Go to Storage -> Create bucket named `media` (Public: true).
4. Set up Environment Variables in Supabase (Settings -> API):
   - `SUPABASE_URL`
   - `SUPABASE_SERVICE_ROLE_KEY`

## 3. Edge Function Deployment
Run these commands if you have Supabase CLI installed:
```bash
supabase functions deploy api-gateway
```

## 4. Frontend Setup
1. Install dependencies:
   ```bash
   npm install
   ```
2. Create `.env` file:
   ```env
   VITE_SUPABASE_URL=your_project_url
   VITE_SUPABASE_ANON_KEY=your_anon_key
   ```
3. Run development server:
   ```bash
   npm run dev
   ```

## 5. Security & Features
- **Validation**: Edge Function redirects all DB calls and validates file sizes/types.
- **Normalization**: Students, Subjects, and Certificates are now in separate tables.
- **Grouping**: Handled via SQL VIEW `student_certificates_view` for maximum efficiency.
- **Audit**: Every admin action is automatically logged via Postgres Triggers.
