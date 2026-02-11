const { createApp, ref, onMounted, watch } = Vue;

// Supabase konfiguratsiyasi
const SUPABASE_URL = 'https://llektzzukijtzjzionct.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxsZWt0enp1a2lqdHpqemlvbmN0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzA1NDUzMTEsImV4cCI6MjA4NjEyMTMxMX0.hRtbOuKe3rBPeY2Jm-O1ELMB6gu_5P6Hu4AjA57yKX8';
const supabaseClient = (typeof supabase !== 'undefined') ? supabase.createClient(SUPABASE_URL, SUPABASE_KEY) : null;

const app = createApp({
    setup() {
        // --- UI HELPERS ---
        const triggerFileInput = (index) => {
            const el = document.getElementById('file-' + index);
            if (el) el.click();
        };

        const validateFile = (file) => {
            const validTypes = ['image/jpeg', 'image/png', 'image/webp'];
            if (!validTypes.includes(file.type)) {
                return "Faqat JPG, PNG yoki WEBP rasmlarni yuklash mumkin.";
            }
            if (file.size > 5 * 1024 * 1024) { // 5MB limit
                return "Rasm hajmi 5MB dan oshmasligi kerak.";
            }
            return null;
        };

        // --- AUTH & COMMON STATE ---
        const email = ref('');
        const password = ref('');
        const session = ref(null);
        const loading = ref(false);
        const error = ref(null);
        const success = ref(null);
        const activeTab = ref('add');

        // --- MULTI-CERTIFICATE FORM STATE ---
        const studentInfo = ref({ name: '', grade: null, year: new Date().getFullYear() });
        const certificateSlots = ref([
            { subject: 'Kimyo', level: 'A+', score: null, file: null, preview: null, progress: 0 }
        ]);

        const addSlot = () => {
            if (certificateSlots.value.length < 5) {
                certificateSlots.value.push({ subject: 'Kimyo', level: 'A+', score: null, file: null, preview: null, progress: 0 });
            }
        };

        const removeSlot = (index) => {
            if (certificateSlots.value.length > 1) {
                certificateSlots.value.splice(index, 1);
            }
        };

        const onFileChange = (event, index) => {
            const file = event.target.files[0];
            if (file) {
                const errorMsg = validateFile(file);
                if (errorMsg) {
                    alert(errorMsg);
                    event.target.value = '';
                    return;
                }
                certificateSlots.value[index].file = file;
                certificateSlots.value[index].preview = URL.createObjectURL(file);
            }
        };

        // --- MANAGEMENT STATE ---
        const certList = ref([]);
        const loadingList = ref(false);
        const adminSearch = ref('');
        const adminPage = ref(1);
        const adminTotalPages = ref(1);
        const adminPageSize = 15;

        // --- GALLERY STATE ---
        const galleryList = ref([]);
        const loadingGallery = ref(false);
        const loadingGalleryList = ref(false);
        const galleryPreview = ref(null);
        const galleryFileInput = ref(null);

        // --- AUDIT LOGS STATE ---
        const auditList = ref([]);
        const loadingLogs = ref(false);

        // --- FETCH FUNCTIONS ---
        const fetchCertList = async () => {
            if (!supabaseClient) return;
            loadingList.value = true;
            try {
                let query = supabaseClient.from('certificates').select('*', { count: 'exact' });
                if (adminSearch.value) query = query.ilike('student_name', `%${adminSearch.value}%`);
                const { data, count, error: err } = await query
                    .order('created_at', { ascending: false })
                    .range((adminPage.value - 1) * adminPageSize, adminPage.value * adminPageSize - 1);
                if (err) throw err;
                certList.value = data;
                adminTotalPages.value = Math.ceil(count / adminPageSize);
            } catch (err) { console.error("Fetch error:", err.message); }
            finally { loadingList.value = false; }
        };

        const fetchGalleryList = async () => {
            if (!supabaseClient) return;
            loadingGalleryList.value = true;
            try {
                const { data, error: err } = await supabaseClient.from('gallery').select('*').order('created_at', { ascending: false });
                if (err) throw err;
                galleryList.value = data;
            } catch (err) { console.error("Gallery fetch error:", err.message); }
            finally { loadingGalleryList.value = false; }
        };

        const fetchAuditList = async () => {
            if (!supabaseClient) return;
            loadingLogs.value = true;
            try {
                const { data, error: err } = await supabaseClient.from('audit_logs').select('*').order('created_at', { ascending: false }).limit(50);
                if (err) throw err;
                auditList.value = data;
            } catch (err) { console.error("Audit log error:", err.message); }
            finally { loadingLogs.value = false; }
        };

        onMounted(async () => {
            if (!supabaseClient) return;
            const { data } = await supabaseClient.auth.getSession();
            session.value = data.session;
            if (session.value) { fetchCertList(); fetchGalleryList(); fetchAuditList(); }
            supabaseClient.auth.onAuthStateChange((_event, _session) => {
                session.value = _session;
                if (_session) { fetchCertList(); fetchGalleryList(); fetchAuditList(); }
            });
        });

        watch(activeTab, (newTab) => {
            if (newTab === 'logs') fetchAuditList();
            if (newTab === 'manage') fetchCertList();
            if (newTab === 'gallery') fetchGalleryList();
        });

        let searchTimeout;
        watch(adminSearch, () => {
            clearTimeout(searchTimeout);
            searchTimeout = setTimeout(() => { adminPage.value = 1; fetchCertList(); }, 500);
        });

        // --- HANDLERS ---
        const handleLogin = async () => {
            loading.value = true; error.value = null;
            try {
                const { error: err } = await supabaseClient.auth.signInWithPassword({ email: email.value, password: password.value });
                if (err) throw err;
            } catch (err) { error.value = "Xato: " + err.message; }
            finally { loading.value = false; }
        };

        const handleLogout = async () => { await supabaseClient.auth.signOut(); certList.value = []; galleryList.value = []; };

        const handleUploadAll = async () => {
            if (!studentInfo.value.name) { error.value = "Ismni kiriting."; return; }

            error.value = null; success.value = null; loading.value = true;
            let successCount = 0;

            try {
                for (let i = 0; i < certificateSlots.value.length; i++) {
                    const slot = certificateSlots.value[i];
                    if (!slot.file) continue;

                    slot.progress = 10;
                    const fileExt = slot.file.name.split('.').pop();
                    const fileName = `${Date.now()}_${i}.${fileExt}`;
                    const filePath = `certificates/${fileName}`;

                    const { error: upErr } = await supabaseClient.storage.from('certificates').upload(filePath, slot.file);
                    if (upErr) throw upErr;
                    slot.progress = 50;

                    const { data: { publicUrl } } = supabaseClient.storage.from('certificates').getPublicUrl(filePath);

                    const { error: dbErr } = await supabaseClient.from('certificates').insert([{
                        student_name: studentInfo.value.name,
                        student_grade: studentInfo.value.grade,
                        year: studentInfo.value.year,
                        subject: slot.subject,
                        certificate_level: slot.level,
                        dtm_score: slot.score,
                        image_url: publicUrl
                    }]);
                    if (dbErr) throw dbErr;

                    slot.progress = 100;
                    successCount++;
                }

                if (successCount > 0) {
                    success.value = `${successCount} ta sertifikat saqlandi!`;
                    studentInfo.value = { name: '', grade: null, year: new Date().getFullYear() };
                    certificateSlots.value = [{ subject: 'Kimyo', level: 'A+', score: null, file: null, preview: null, progress: 0 }];
                    fetchCertList();
                    setTimeout(() => { success.value = null; }, 4000);
                } else {
                    error.value = "Rasm yuklanmadi.";
                }
            } catch (err) { error.value = "Xato: " + err.message; }
            finally { loading.value = false; }
        };

        const handleGalleryUpload = async () => {
            if (!galleryFileInput.value || !galleryFileInput.value.files[0]) return;
            loadingGallery.value = true;
            try {
                const file = galleryFileInput.value.files[0];
                const fileName = `${Date.now()}_gallery.${file.name.split('.').pop()}`;
                const filePath = `gallery/${fileName}`;
                const { error: upErr } = await supabaseClient.storage.from('certificates').upload(filePath, file);
                if (upErr) throw upErr;
                const { data: { publicUrl } } = supabaseClient.storage.from('certificates').getPublicUrl(filePath);
                const { error: dbErr } = await supabaseClient.from('gallery').insert([{ image_url: publicUrl }]);
                if (dbErr) throw dbErr;
                galleryPreview.value = null; galleryFileInput.value.value = ''; fetchGalleryList();
                alert("Galereyaga rasm qo'shildi!");
            } catch (err) { alert("Xato: " + err.message); }
            finally { loadingGallery.value = false; }
        };

        const extractFilePath = (url) => {
            if (!url) return null;
            // Supabase URL format: .../storage/v1/object/public/bucket-name/file-path
            // We need to extract the part after /public/bucket-name/
            const parts = url.split('/public/certificates/');
            return parts.length > 1 ? parts[1] : null;
        };

        const handleDelete = async (cert) => {
            if (!confirm(`"${cert.student_name}" sertifikatini o'chirmoqchimisiz?`)) return;
            loadingList.value = true;
            try {
                // 1. Storage'dan o'chirish
                const filePath = extractFilePath(cert.image_url);
                if (filePath) {
                    await supabaseClient.storage.from('certificates').remove([filePath]);
                }

                // 2. Database'dan o'chirish
                const { error: dbErr } = await supabaseClient.from('certificates').delete().eq('id', cert.id);
                if (dbErr) throw dbErr;

                certList.value = certList.value.filter(c => c.id !== cert.id);
                alert("Muvaffaqiyatli o'chirildi.");
            } catch (err) {
                alert("O'chirishda xatolik: " + err.message);
            } finally {
                loadingList.value = false;
            }
        };

        const handleDeleteGallery = async (item) => {
            if (!confirm("O'chirilsinmi?")) return;
            try {
                // 1. Storage'dan o'chirish
                const filePath = extractFilePath(item.image_url);
                if (filePath) {
                    await supabaseClient.storage.from('certificates').remove([filePath]);
                }

                // 2. Database'dan o'chirish
                await supabaseClient.from('gallery').delete().eq('id', item.id);
                galleryList.value = galleryList.value.filter(g => g.id !== item.id);
            } catch (err) { alert(err.message); }
        };

        const previewGalleryImage = (event) => {
            const file = event.target.files[0];
            if (file) {
                const errorMsg = validateFile(file);
                if (errorMsg) {
                    alert(errorMsg);
                    event.target.value = '';
                    return;
                }
                galleryPreview.value = URL.createObjectURL(file);
            }
        };


        // --- SYSTEM CLEANUP ---
        const cleaning = ref(false);
        const cleanupResult = ref('');

        const cleanupStorage = async () => {
            if (!confirm("Diqqat! Bu amal bazada mavjud bo'lmagan barcha rasmlarni butunlay o'chirib yuboradi. Davom etishni xohlaysizmi?")) return;
            cleaning.value = true;
            cleanupResult.value = "Tahlil qilinmoqda...";

            try {
                // 1. Bazadagi ishlatilayotgan barcha rasmlar ro'yxatini olish (Certificates va Gallery)
                const { data: certs, error: cErr } = await supabaseClient.from('certificates').select('image_url');
                const { data: galleries, error: gErr } = await supabaseClient.from('gallery').select('image_url');

                if (cErr || gErr) throw new Error("Ma'lumotlar bazasini o'qishda xatolik");

                // Faqat fayl nomlarini ajratib olamiz (URL ichidan)
                const usedFileNames = new Set();
                const extractName = (url) => {
                    if (!url) return null;
                    const parts = url.split('/');
                    return parts[parts.length - 1]; // Oxirgi qism (masalan: 123_cert.jpg)
                };

                certs?.forEach(c => { const n = extractName(c.image_url); if (n) usedFileNames.add(n); });
                galleries?.forEach(g => { const n = extractName(g.image_url); if (n) usedFileNames.add(n); });

                // 2. Storage'dagi barcha fayllarni olish (certificates papkasi)
                const { data: certFiles, error: sfErr1 } = await supabaseClient.storage.from('certificates').list('certificates', { limit: 1000 });
                if (sfErr1) throw sfErr1;

                // Storage'dagi barcha fayllarni olish (gallery papkasi)
                const { data: gallFiles, error: sfErr2 } = await supabaseClient.storage.from('certificates').list('gallery', { limit: 1000 });
                if (sfErr2) throw sfErr2;

                // 3. Solishtirish va o'chirish ro'yxatini tuzish (Fayl nomi bo'yicha)
                const filesToDelete = [];

                if (certFiles) {
                    certFiles.forEach(f => {
                        if (f.name === '.emptyFolderPlaceholder') return;
                        if (!usedFileNames.has(f.name)) {
                            filesToDelete.push(`certificates/${f.name}`);
                        }
                    });
                }

                if (gallFiles) {
                    gallFiles.forEach(f => {
                        if (f.name === '.emptyFolderPlaceholder') return;
                        if (!usedFileNames.has(f.name)) {
                            filesToDelete.push(`gallery/${f.name}`);
                        }
                    });
                }

                if (filesToDelete.length === 0) {
                    cleanupResult.value = "Tozalash shart emas. Ortiqcha fayllar topilmadi.";
                    alert("Xotira toza! Ortiqcha fayllar yo'q.");
                    return;
                }

                const confirmMsg = `${filesToDelete.length} ta keraksiz rasm topildi.\nUlarni o'chirib tashlaymi?`;
                if (!confirm(confirmMsg)) {
                    cleanupResult.value = "Amal bekor qilindi.";
                    return;
                }

                // 4. O'chirish (Batch delete)
                const { error: delErr } = await supabaseClient.storage.from('certificates').remove(filesToDelete);

                if (delErr) throw delErr;

                cleanupResult.value = `Muvaffaqiyatli! ${filesToDelete.length} ta keraksiz rasm o'chirildi.`;
                alert(`Tozalandi! ${filesToDelete.length} ta fayl o'chirildi.`);

            } catch (err) {
                console.error(err);
                cleanupResult.value = "Xatolik: " + err.message;
            } finally {
                cleaning.value = false;
            }
        };

        return {
            cleanupStorage, cleaning, cleanupResult,
            email, password, session, loading, error, success, activeTab,
            studentInfo, certificateSlots, addSlot, removeSlot, onFileChange,
            certList, loadingList, adminSearch, adminPage, adminTotalPages,
            galleryList, loadingGallery, loadingGalleryList, galleryPreview, galleryFileInput,
            auditList, loadingLogs,
            handleLogin, handleLogout, handleUploadAll, handleDelete,
            handleGalleryUpload, previewGalleryImage, handleDeleteGallery, triggerFileInput,
            changeAdminPage: (p) => { adminPage.value = p; fetchCertList(); }
        };
    }
});

app.mount('#admin-app');
