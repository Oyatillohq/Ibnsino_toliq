const { createApp, ref, onMounted, onUnmounted, computed } = Vue;

/* 
================================================================
    SUPABASE CONFIGURATION
================================================================
*/
const SUPABASE_URL = 'https://llektzzukijtzjzionct.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxsZWt0enp1a2lqdHpqemlvbmN0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzA1NDUzMTEsImV4cCI6MjA4NjEyMTMxMX0.hRtbOuKe3rBPeY2Jm-O1ELMB6gu_5P6Hu4AjA57yKX8';
const supabaseClient = (typeof supabase !== 'undefined') ? supabase.createClient(SUPABASE_URL, SUPABASE_KEY) : null;

/* 
================================================================
    VUE.JS APPLICATION SETUP
================================================================
*/
const app = createApp({
    setup() {
        /* --- STATE MANAGEMENT --- */
        const isMenuOpen = ref(false);
        const isScrolled = ref(false);
        const loading = ref(false);

        /* 
        ================================================================
            DATA CENTER
        ================================================================
        */
        const menuItems = [
            { text: 'Bosh Sahifa', link: 'index.html' },
            { text: 'Natijalar', link: 'index.html#results' },
            { text: 'Fanlar', link: 'index.html#subjects' },
            { text: 'Sertifikatlar', link: 'certificates.html' },
            { text: 'Biz Haqimizda', link: 'index.html#about' },
            { text: 'Aloqa', link: 'index.html#contact' }
        ];

        const academyInfo = {
            name: 'IBN SINO EDUCATION',
            mission: '7-sinfdan boshlab o\'quvchilarni tibbiyot va tabiiy fanlar yo\'nalishidagi oliygohlarga kirish uchun professional tayyorlov.',
            languages: ['O\'zbek', 'Rus']
        };

        const contactData = {
            phones: ['+998 94 444 33 66', '+998 94 855 33 66', '+998 91 659 07 93', '+998 90 634 88 98', '+998 94 494 12 03'],
            telegram: 'https://t.me/Ibn_Sino_Education'
        };

        const gallery = ref([]);
        const stats = [
            { label: 'O\'quvchilar', value: 1500, suffix: '+' },
            { label: 'Oliy o\'quv yurtlariga kirganlar', value: 300, suffix: '+' },
            { label: 'Yillik Tajriba', value: 20, suffix: '+' },
            { label: 'Muvaffaqiyat ko\'rsatkichi', value: 95, suffix: '%' }
        ];

        const subjects = [
            {
                category: 'Asosiy Fanlar',
                items: [
                    { name: 'Biologiya', icon: 'microscope', desc: 'Tibbiyot oliygohlari uchun chuqurlashtirilgan va mukammal tayyorlov.' },
                    { name: 'Kimyo', icon: 'flask-conical', desc: 'Nazariy va amaliy mashg\'ulotlar, murakkab masalalar yechish metodikasi.' }
                ]
            },
            {
                category: 'Majburiy Fanlar',
                items: [
                    { name: 'Matematika', icon: 'calculator', desc: 'Mantiqiy fikrlash va bazaviy bilimlar.' },
                    { name: 'Tarix', icon: 'landmark', desc: 'O\'zbekiston va jahon tarixi bo\'yicha mukammal bilim.' },
                    { name: 'Ona tili', icon: 'languages', desc: 'Ona tili bo\'yicha mukammal bilim.' }
                ]
            }
        ];

        const features = [
            { title: 'Milliy Sertifikatga tayyorlov', description: 'A+ va A darajadagi Milliy sertifikat olish uchun maxsus kurslar.', icon: 'award' },
            { title: 'Oliy o\'quv yurtlariga tayyorgarlik', description: 'Tibbiyot va boshqa yetakchi oliygohlarga kirish imtihonlariga tayyorlov.', icon: 'graduation-cap' },
            { title: 'Tajribali ustozlar', description: 'O\'z sohasining mutaxassisi bo\'lgan oliy toifali mutaxassislar.', icon: 'users' },
            { title: 'Haftalik imtihonlar', description: 'Har haftalik nazorat testlari va natijalar monitoringi.', icon: 'clipboard-check' },
            { title: 'Shaxsiy qo\'llab-quvvatlash', description: 'Har bir o\'quvchi bilan individual ishlash va natijaga yo\'naltirilganlik.', icon: 'star' }
        ];

        /* --- CERTIFICATES STATE --- */
        const certificates = ref([]);
        const currentPage = ref(1);
        const totalPages = ref(1);
        const pageSize = 12;
        const totalCount = ref(0);
        const years = ref([]);
        const filters = ref({ year: '', subject: '', level: '' });
        const selectedCert = ref(null);

        const fetchCertificates = async () => {
            if (!supabaseClient) return;
            loading.value = true;
            try {
                // 'certificates' o'rniga 'student_albums' dan olamiz
                let query = supabaseClient.from('student_albums').select('*', { count: 'exact' });

                if (filters.value.year) query = query.eq('year', filters.value.year);
                // Izoh: subject va level bo'yicha qidiruv bazada murakkabroq bo'lgani uchun, 
                // hozircha oddiy Albom ko'rinishida ko'rsatamiz.

                const { data, count, error } = await query
                    .order('max_level', { ascending: true }) // Eng yuqori natijalar birinchi
                    .range((currentPage.value - 1) * pageSize, currentPage.value * pageSize - 1);

                if (error) throw error;

                // Ma'lumotlarni frontend'ga moslashtirish
                certificates.value = data.map(item => ({
                    student_name: item.student_name,
                    student_grade: item.student_grade,
                    year: item.year,
                    maxLevel: item.max_level,
                    images: item.details.map(d => d.image_url), // Barcha rasmlar
                    details: item.details,
                    subject: item.details[0].subject // Birinchi fanni asosiy qilib ko'rsatish
                }));

                totalCount.value = count || 0;
                totalPages.value = Math.ceil((count || 0) / pageSize);
            } catch (error) {
                console.error("Fetch error:", error.message);
            } finally {
                loading.value = false;
            }
        };

        const fetchGalleryList = async () => {
            if (!supabaseClient) {
                gallery.value = [
                    "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&w=600&q=80",
                    "https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=600&q=80",
                    "https://images.unsplash.com/photo-1571260899304-425eee4c7efc?auto=format&fit=crop&w=600&q=80",
                    "https://images.unsplash.com/photo-1577896851231-70ef18881754?auto=format&fit=crop&w=600&q=80",
                    "https://images.unsplash.com/photo-1606761568499-6d2451b23c66?auto=format&fit=crop&w=600&q=80",
                    "https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&w=600&q=80"
                ];
                return;
            }
            try {
                const { data, error } = await supabaseClient
                    .from('gallery')
                    .select('image_url')
                    .order('created_at', { ascending: false });
                if (error) throw error;
                if (data && data.length > 0) gallery.value = data.map(i => i.image_url);
            } catch (err) {
                console.error("Gallery error:", err.message);
            }
        };

        const fetchYears = async () => {
            if (!supabaseClient) return;
            const { data } = await supabaseClient.from('certificates').select('year');
            if (data) years.value = [...new Set(data.map(d => d.year))].sort((a, b) => b - a);
        };

        /* --- UI LOGIC --- */
        const currentImageIndex = ref(0);
        const openModal = (cert) => {
            selectedCert.value = cert;
            currentImageIndex.value = 0;
            document.body.style.overflow = 'hidden';
        };
        const closeModal = () => { selectedCert.value = null; if (!isMenuOpen.value) document.body.style.overflow = ''; };
        const toggleMenu = () => { isMenuOpen.value = !isMenuOpen.value; document.body.style.overflow = isMenuOpen.value ? 'hidden' : ''; };
        const handleScroll = () => { isScrolled.value = window.scrollY > 20; };
        const changeFilter = () => { currentPage.value = 1; fetchCertificates(); };
        const nextPage = () => { if (currentPage.value < totalPages.value) { currentPage.value++; fetchCertificates(); window.scrollTo({ top: 0, behavior: 'smooth' }); } };
        const prevPage = () => { if (currentPage.value > 1) { currentPage.value--; fetchCertificates(); window.scrollTo({ top: 0, behavior: 'smooth' }); } };

        const nextImage = () => {
            if (selectedCert.value && currentImageIndex.value < selectedCert.value.images.length - 1) {
                currentImageIndex.value++;
            } else { currentImageIndex.value = 0; }
        };

        const prevImage = () => {
            if (selectedCert.value && currentImageIndex.value > 0) {
                currentImageIndex.value--;
            } else if (selectedCert.value) { currentImageIndex.value = selectedCert.value.images.length - 1; }
        };

        /* --- ANIMATIONS --- */
        const animatedStats = ref(stats.map(s => ({ ...s, currentValue: 0 })));
        let hasAnimated = false;
        const runStatsAnimation = () => {
            if (hasAnimated) return;
            hasAnimated = true;
            animatedStats.value.forEach(stat => {
                const totalFrames = 120;
                const increment = stat.value / totalFrames;
                let current = 0;
                const timer = setInterval(() => {
                    current += increment;
                    if (current >= stat.value) { stat.currentValue = stat.value; clearInterval(timer); }
                    else { stat.currentValue = Math.floor(current); }
                }, 16);
            });
        };

        const heroParticles = ref([]);
        const generateParticles = () => {
            const count = window.innerWidth < 768 ? 20 : 40;
            const particles = [];
            for (let i = 0; i < count; i++) {
                particles.push({
                    id: i, x: Math.random() * 100, y: Math.random() * 100,
                    size: Math.random() * 4 + 2, delay: Math.random() * 5,
                    duration: Math.random() * 10 + 10, opacity: Math.random() * 0.15 + 0.05
                });
            }
            heroParticles.value = particles;
        };

        const initReveal = () => {
            setTimeout(() => {
                const revealElements = document.querySelectorAll('.reveal');
                const observer = new IntersectionObserver((entries) => {
                    entries.forEach(entry => {
                        if (entry.isIntersecting) {
                            entry.target.classList.add('reveal-visible');
                            if (entry.target.id === 'results') runStatsAnimation();
                        }
                    });
                }, { threshold: 0.1, rootMargin: "0px 0px -50px 0px" });
                revealElements.forEach(el => observer.observe(el));
            }, 500);
        };

        onMounted(() => {
            generateParticles();
            window.addEventListener('resize', generateParticles);
            window.addEventListener('scroll', handleScroll);
            fetchGalleryList();
            if (document.getElementById('certificates-page')) {
                fetchCertificates();
                fetchYears();
            } else {
                initReveal();
            }
            if (window.lucide) window.lucide.createIcons();
        });

        onUnmounted(() => {
            window.removeEventListener('resize', generateParticles);
            window.removeEventListener('scroll', handleScroll);
        });

        return {
            isMenuOpen, isScrolled, menuItems, academyInfo, contactData,
            gallery, certificates, years, filters, loading, subjects, features,
            currentPage, totalPages, selectedCert, animatedStats, heroParticles,
            currentImageIndex, nextImage, prevImage,
            openModal, closeModal, toggleMenu, changeFilter, nextPage, prevPage
        };
    }
});

app.mount('#app');
