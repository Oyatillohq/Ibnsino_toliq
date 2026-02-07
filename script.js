const { createApp, ref, onMounted, onUnmounted } = Vue;

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

        /* 
        ================================================================
            DATA CENTER - [ EDIT TEXTS/NUMBERS HERE ]
        ================================================================
        */
        const menuItems = [
            { text: 'Bosh Sahifa', link: '#' },
            { text: 'Natijalar', link: '#results' },
            { text: 'Fanlar', link: '#subjects' },
            { text: 'Sertifikatlar', link: '#certificates' },
            { text: 'Biz Haqimizda', link: '#about' },
            { text: 'Xususiyatlar', link: '#features' },
            { text: 'Aloqa', link: '#contact' }
        ];

        const academyInfo = {
            name: 'IBN SINO EDUCATION',
            mission: '7-sinfdan boshlab o\'quvchilarni tibbiyot va tabiiy fanlar yo\'nalishidagi oliygohlarga kirish uchun professional tayyorlov.',
            languages: ['O\'zbek', 'Rus']
        };

        const contactData = {
            phones: [
                '+998 94 444 33 66',
                '+998 94 855 33 66',
                '+998 91 659 07 93',
                '+998 90 634 88 98',
                '+998 94 494 12 03'
            ],
            telegram: 'https://t.me/Ibn_Sino_Education',
            location: 'Toshkent sh., Chilonzor tumani, Bunyodkor ko\'chasi, 42'
        };

        const gallery = [
            "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
            "https://images.unsplash.com/photo-1544717305-2782549b5136?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
            "https://images.unsplash.com/photo-1571260899304-425eee4c7efc?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
            "https://images.unsplash.com/photo-1577896851231-70ef18881754?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
            "https://images.unsplash.com/photo-1606761568499-6d2451b23c66?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
            "https://images.unsplash.com/photo-1509062522246-3755977927d7?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80"
        ];

        const stats = [
            { label: 'O\'quvchilar', value: 1500, suffix: '+' },
            { label: 'Oliy o\'quv yurtlariga kirganlar', value: 300, suffix: '+' },
            { label: 'Yillik Tajriba', value: 20, suffix: '+' },
            { label: 'Muvaffaqiyat ko\'rsatkichi', value: 95, suffix: '%' }
        ];

        const certificates = [
            { id: 1, type: 'Maksimal Natija', score: '189', date: '2023', image: 'https://images.unsplash.com/photo-1544717304-a2db0a7594d2?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80' },
            { id: 2, type: 'Ko\'p Karra G\'olib', score: '5+ Sertifikat', date: '2024', image: 'https://images.unsplash.com/photo-1517673132405-a56a62b18caf?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80' },
            { id: 3, type: 'A+ Daraja', score: '189', date: '2024', image: 'https://images.unsplash.com/photo-1589115436531-ec72f883259e?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80' }
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
                    { name: 'Ona tili & Rus tili', icon: 'languages', desc: 'Ona tili va Rus tilida o\'quvchilar uchun maxsus grammatika darslari.' }
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

        const testimonials = [
            { name: 'Sardorbek Alimov', text: 'Ibn Sino Education yordamida Kimyo fanidan Milliy Sertifikatda A darajaga erishdim va grant asosida o\'qishga kirdim.', image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80' },
            { name: 'Diana Raxmatova', text: 'Biologiya darslari juda yuqori saviyada o\'tildi. Hozirda Toshkent Tibbiyot Akademiyasi talabasiman.', image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80' }
        ];

        /* 
        ================================================================
            LOGIC CENTER - [ DO NOT EDIT UNLESS ADVANCED ]
        ================================================================
        */
        const toggleMenu = () => {
            isMenuOpen.value = !isMenuOpen.value;
            document.body.style.overflow = isMenuOpen.value ? 'hidden' : '';
        };

        const handleScroll = () => {
            isScrolled.value = window.scrollY > 20;
        };

        const animatedStats = ref(stats.map(s => ({ ...s, currentValue: 0 })));
        let hasAnimated = false;

        const runStatsAnimation = () => {
            if (hasAnimated) return;
            hasAnimated = true;

            animatedStats.value.forEach(stat => {
                const duration = 2000;
                const frameDuration = 1000 / 60;
                const totalFrames = Math.round(duration / frameDuration);
                const increment = stat.value / totalFrames;
                let current = 0;

                const timer = setInterval(() => {
                    current += increment;
                    if (current >= stat.value) {
                        stat.currentValue = stat.value;
                        clearInterval(timer);
                    } else {
                        stat.currentValue = Math.floor(current);
                    }
                }, frameDuration);
            });
        };

        const heroParticles = ref([]);
        const generateParticles = () => {
            const count = window.innerWidth < 768 ? 20 : 40;
            const particles = [];
            for (let i = 0; i < count; i++) {
                particles.push({
                    id: i,
                    x: Math.random() * 100,
                    y: Math.random() * 100,
                    size: Math.random() * 4 + 2,
                    delay: Math.random() * 5,
                    duration: Math.random() * 10 + 10,
                    opacity: Math.random() * 0.15 + 0.05
                });
            }
            heroParticles.value = particles;
        };

        onMounted(() => {
            generateParticles();
            window.addEventListener('resize', generateParticles);
            window.addEventListener('scroll', handleScroll);

            const scrollObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('reveal-visible');
                        if (entry.target.id === 'results') {
                            runStatsAnimation();
                        }
                        scrollObserver.unobserve(entry.target);
                    }
                });
            }, {
                threshold: 0.1,
                rootMargin: "0px 0px -50px 0px"
            });

            setTimeout(() => {
                const revealElements = document.querySelectorAll('.reveal, .reveal-up, .reveal-left, .reveal-right, .reveal-scale');
                revealElements.forEach(el => scrollObserver.observe(el));
                if (window.lucide) {
                    window.lucide.createIcons();
                }
            }, 100);
        });

        onUnmounted(() => {
            window.removeEventListener('resize', generateParticles);
            window.removeEventListener('scroll', handleScroll);
        });

        return {
            isMenuOpen,
            isScrolled,
            menuItems,
            academyInfo,
            contactData,
            gallery,
            subjects,
            certificates,
            features,
            testimonials,
            animatedStats,
            heroParticles,
            toggleMenu
        };
    }
});

app.mount('#app');
