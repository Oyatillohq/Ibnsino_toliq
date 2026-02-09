<script setup>
import { ref, onMounted } from 'vue'
import { certificateService } from '../api/certificateService'
import CertificateCard from './CertificateCard.vue'
import { X, ChevronLeft, ChevronRight } from 'lucide-vue-next'

const groups = ref([])
const loading = ref(true)
const page = ref(1)
const yearFilter = ref('')

const selectedGroup = ref(null)
const currentCertIndex = ref(0)
const isModalActive = ref(false)
const errorMessage = ref('')

const loadData = async (resetPage = false) => {
  if (resetPage) page.value = 1
  loading.value = true
  try {
    const result = await certificateService.getGroupedCertificates({
      year: yearFilter.value,
      page: page.value
    })
    groups.value = result.data || []
    if (result.error) errorMessage.value = result.error
    else errorMessage.value = ''
  } catch (err) {
    console.error("Ma'lumot yuklashda xatolik:", err)
    errorMessage.value = err.message
  } finally {
    loading.value = false
  }
}

const openModal = (group) => {
  selectedGroup.value = group
  currentCertIndex.value = 0
  isModalActive.value = true
  document.body.style.overflow = 'hidden'
}

const closeModal = () => {
  isModalActive.value = false
  setTimeout(() => {
    selectedGroup.value = null
    document.body.style.overflow = ''
  }, 400)
}

const prevCert = () => {
  if (currentCertIndex.value > 0) {
    currentCertIndex.value--
  }
}

const nextCert = () => {
  if (currentCertIndex.value < selectedGroup.value.certificates.length - 1) {
    currentCertIndex.value++
  }
}

const handleKeydown = (e) => {
  if (!isModalActive.value) return
  if (e.key === 'Escape') closeModal()
  if (e.key === 'ArrowLeft') prevCert()
  if (e.key === 'ArrowRight') nextCert()
}

onMounted(() => {
  loadData()
  window.addEventListener('keydown', handleKeydown)
})

import { onUnmounted } from 'vue'
onUnmounted(() => {
  window.removeEventListener('keydown', handleKeydown)
})
</script>

<template>
  <section id="certificates" class="section-padding" aria-labelledby="certs-title">
    <div class="container">
      <div class="section-header reveal reveal-left">
        <h2 id="certs-title" class="section-title">O'quvchilar Natijalari</h2>
        <div class="filters">
          <select v-model="yearFilter" @change="loadData(true)" class="filter-select" aria-label="Filter by year">
            <option value="">Barcha yillar</option>
            <option value="2024">2024</option>
            <option value="2025">2025</option>
          </select>
        </div>
      </div>

      <div v-if="loading" class="loading" role="status">Yuklanmoqda...</div>

      <div v-else-if="groups.length > 0" class="certificate-grid reveal reveal-left">
        <CertificateCard v-for="group in groups" :key="group.student_id" :group="group" @select="openModal" />
      </div>

      <div v-else class="empty-state">
        <p v-if="errorMessage" style="color: #ff8a80;">Xatolik: {{ errorMessage }}</p>
        <p v-else>Hozircha natijalar mavjud emas.</p>
        <small style="display: block; margin-top: 1rem; opacity: 0.6;">
          (Eslatma: Agar sertifikatlar yuklangan bo'lsa, xizmat ko'rsatuvchi SQL ko'rinishlarini (view) yaratishni
          unutmang. Shuningdek, ma'lumotlar bazasida SQL migratsiyasini ishga tushirganingizga ishonch hosil qiling.)
        </small>
      </div>

      <!-- Pagination -->
      <div v-if="groups.length > 0" class="pagination reveal reveal-up">
        <button @click="page--; loadData()" :disabled="page === 1" class="btn-nav" aria-label="Oldingi sahifa">
          <ChevronLeft :size="20" />
          <span>Oldingi</span>
        </button>
        <span class="page-info">Sahifa {{ page }}</span>
        <button @click="page++; loadData()" :disabled="groups.length < 12" class="btn-nav" aria-label="Keyingi sahifa">
          <span>Keyingi</span>
          <ChevronRight :size="20" />
        </button>
      </div>
    </div>

    <!-- Modal for viewing certificates -->
    <div class="modal" :class="{ active: isModalActive }" @click.self="closeModal" role="dialog" aria-modal="true"
      :aria-label="selectedGroup ? selectedGroup.student_name + ' sertifikatlari' : 'Sertifikat ko\'rish'">
      <div class="modal-content" v-if="selectedGroup" @click.stop>
        <button class="modal-close" @click="closeModal" aria-label="Close modal">
          <X :size="32" />
        </button>

        <div class="modal-image-wrapper">
          <img :src="selectedGroup.certificates[currentCertIndex].image_url" class="full-cert-img"
            alt="Sertifikat rasmi" loading="lazy">

          <button v-if="selectedGroup.certificates.length > 1" class="nav-btn prev" @click="prevCert"
            :disabled="currentCertIndex === 0" aria-label="Previous certificate">
            <ChevronLeft :size="40" />
          </button>

          <button v-if="selectedGroup.certificates.length > 1" class="nav-btn next" @click="nextCert"
            :disabled="currentCertIndex === selectedGroup.certificates.length - 1" aria-label="Next certificate">
            <ChevronRight :size="40" />
          </button>
        </div>

        <div class="modal-info">
          <h3>{{ selectedGroup.student_name }}</h3>
          <p>{{ selectedGroup.certificates[currentCertIndex].level }} - {{ selectedGroup.year }}</p>
          <div class="cert-counter" v-if="selectedGroup.certificates.length > 1">
            {{ currentCertIndex + 1 }} / {{ selectedGroup.certificates.length }}
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.loading {
  text-align: center;
  padding: 4rem;
  color: var(--color-accent);
  font-weight: bold;
}

.empty-state {
  text-align: center;
  padding: 4rem;
  color: var(--color-text-light);
}

.filters {
  margin-bottom: 2rem;
  display: flex;
  justify-content: center;
}

.filter-select {
  background: var(--color-surface);
  color: var(--color-text);
  border: 1px solid var(--color-border);
  padding: 0.5rem 1rem;
  border-radius: 8px;
  cursor: pointer;
  outline: none;
  transition: 0.3s;
}

.filter-select:hover {
  border-color: var(--color-accent);
}

.modal-image-wrapper {
  position: relative;
  display: flex;
  align-items: center;
}

.full-cert-img {
  max-width: 90vw;
  max-height: 70vh;
  border-radius: 12px;
  box-shadow: 0 0 50px rgba(0, 0, 0, 0.5);
  object-fit: contain;
}

.nav-btn {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  background: rgba(0, 0, 0, 0.5);
  border: none;
  color: white;
  width: 60px;
  height: 60px;
  border-radius: 50%;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: 0.3s;
  z-index: 10;
}

.nav-btn:hover:not(:disabled) {
  background: var(--color-accent);
}

.nav-btn:disabled {
  opacity: 0.3;
  cursor: not-allowed;
}

.nav-btn.prev {
  left: -80px;
}

.nav-btn.next {
  right: -80px;
}

@media (max-width: 1200px) {
  .nav-btn.prev {
    left: 10px;
  }

  .nav-btn.next {
    right: 10px;
  }
}

.modal-info {
  margin-top: 2rem;
  text-align: center;
  color: white;
}

.modal-info h3 {
  font-size: 1.8rem;
  color: var(--color-accent);
  margin-bottom: 0.5rem;
}

.cert-counter {
  margin-top: 1rem;
  background: rgba(255, 255, 255, 0.1);
  padding: 0.3rem 1rem;
  border-radius: 50px;
  display: inline-block;
  font-size: 0.9rem;
}

.pagination {
  margin-top: 4rem;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 2rem;
}

.btn-nav {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  color: white;
  padding: 0.6rem 1.2rem;
  border-radius: 12px;
  cursor: pointer;
  transition: 0.3s;
  font-weight: 600;
}

.btn-nav:hover:not(:disabled) {
  border-color: var(--color-accent);
  background: rgba(0, 191, 166, 0.1);
}

.btn-nav:disabled {
  opacity: 0.3;
  cursor: not-allowed;
}

.page-info {
  font-weight: 700;
  color: var(--color-accent);
  font-size: 1.1rem;
}
</style>
