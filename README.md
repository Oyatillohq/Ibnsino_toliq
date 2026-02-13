# Ibn Sino Akademiyasi - O'quv Platformasi (Loyiha Hujjatlari)

## Loyiha Haqida (Project Overview)
Ushbu loyiha **Ibn Sino Akademiyasi** uchun maxsus ishlab chiqilgan veb-platforma hisoblanadi. Sayt o'quv markazi faoliyati, kurslar, o'qituvchilar va eng asosiysi - **o'quvchilar natijalari va sertifikatlarini** onlayn ko'rish imkoniyatini beradi.

## Asosiy Imkoniyatlar (Key Features)
*   **Zamonaviy Dizayn**: Foydalanuvchi uchun qulay, animatsiyaga boy va responsiv interfeys (Vue 3).
*   **Sertifikatlar Bazasi**: O'quvchilar o'z natijalarini yil, fan va daraja bo'yicha qidirishlari mumkin.
*   **Sertifikat Ko'rish (Modal)**: Sertifikat ustiga bosilganda to'liq ekranli modal oynada ochiladi.
*   **Filtrlash Tizimi**: Yil, Fan va Daraja (A+, B, C...) bo'yicha saralash.
*   **Admin Panel (API)**: Supabase Edge Functions orqali sertifikatlarni yuklash va boshqarish (xavfsiz API).

## Texnologiyalar (Tech Stack)
Loyiha eng so'nggi va tezkor texnologiyalar asosida qurilgan:

*   **Frontend**: [Vue.js 3](https://vuejs.org/) (Composition API), [Vite](https://vitejs.dev/)
*   **Styling**: CSS Variables, Glassmorphism, Responsive Design
*   **Backend / Database**: [Supabase](https://supabase.com/) (PostgreSQL)
*   **API / Serverless**: [Supabase Edge Functions](https://supabase.com/edge-functions) (Deno)
*   **Icons**: [Lucide Vue](https://lucide.dev/)

## O'rnatish va Ishga Tushirish (Installation)

Loyihani mahalliy kompyuterda ishga tushirish uchun quyidagi qadamlarni bajaring:

### 1. Loyihani yuklab olish
```bash
git clone https://github.com/Oyatillohq/Ibnsino_toliq.git
cd Ibnsino_toliq
```

### 2. Kutubxonalarni o'rnatish
```bash
npm install
```

### 3. Loyihani ishga tushirish
```bash
npm run dev
```
Sayt `http://localhost:5173` manzili orqali ochiladi.

## Supabase (Backend) Sozlamalari

Loyihaning backend qismi Supabase da joylashgan. `.env` faylida quyidagi kalitlar bo'lishi kerak:
```
VITE_SUPABASE_URL=sizning_supabase_url
VITE_SUPABASE_ANON_KEY=sizning_supabase_anon_key
```

### Edge Functions (Deno)
API Gateway funksiyasi `supabase/functions/api-gateway` papkasida joylashgan.
Uni yangilash uchun:
```bash
supabase functions deploy api-gateway
```
*Eslatma: Bu funksiya Deno muhitida ishlaydi va `deno.json` orqali JSR importlaridan foydalanadi.*

## Muallif
Loyiha **Antigravity** (AI Assistant) va **Oyatillohq** hamkorligida ishlab chiqildi.
