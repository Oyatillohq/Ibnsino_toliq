<script setup>
import { ref, onMounted, watch, nextTick } from 'vue'
import { useRoute } from 'vue-router'
import { certificateService } from '../api/certificateService'
import CertificateCard from './CertificateCard.vue'
import { X, ChevronLeft, ChevronRight } from 'lucide-vue-next'

const groups = ref([])
const loading = ref(true)
const page = ref(1)
const yearFilter = ref('')

const route = useRoute()

const initAnimations = () => {
  const elements = document.querySelectorAll('.reveal, .reveal-up, .reveal-left, .reveal-right, .reveal-scale')

  if (elements.length === 0) {
    setTimeout(initAnimations, 100)
    return
  }

  const observerOptions = {
    threshold: 0.05,
    rootMargin: '0px 0px 50px 0px'
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('reveal-visible')
      }
    })
  }, observerOptions)

  elements.forEach(el => {
    const rect = el.getBoundingClientRect()
    if (rect.top < window.innerHeight && rect.bottom > 0) {
      el.classList.add('reveal-visible')
    }
    observer.observe(el)
  })

  // Fallback: Reveal everything after 1s
  setTimeout(() => {
    document.querySelectorAll('.reveal, .reveal-up, .reveal-left, .reveal-right, .reveal-scale')
      .forEach(el => el.classList.add('reveal-visible'))
  }, 1000)
}

const selectedGroup = ref(null)
const currentCertIndex = ref(0)
const isModalActive = ref(false)
const subjectFilter = ref('')
const levelFilter = ref('')

const loadData = async (resetPage = false) => {
  if (resetPage) page.value = 1
  loading.value = true
  try {
    const result = await certificateService.getGroupedCertificates({
      year: yearFilter.value,
      subject: subjectFilter.value,
      level: levelFilter.value,
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
  setTimeout(initAnimations, 300)
})

watch(() => route.path, () => {
  // Hide current reveals to re-trigger on new page
  document.querySelectorAll('.reveal-visible').forEach(el => el.classList.remove('reveal-visible'))

  // Wait for page transition
  setTimeout(() => {
    nextTick(() => {
      initAnimations()
    })
  }, 400)
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
        <div class="filters-container">
          <!-- Yillar -->
          <div class="filter-group">
            <span class="filter-label">Yil:</span>
            <div class="filter-tabs">
              <button class="filter-tab" :class="{ active: yearFilter === '' }"
                @click="yearFilter = ''; loadData(true)">
                Hammasi
              </button>
              <button v-for="year in ['2024', '2025']" :key="year" class="filter-tab"
                :class="{ active: yearFilter === year }" @click="yearFilter = year; loadData(true)">
                {{ year }}
              </button>
            </div>
          </div>

          <!-- Fanlar -->
          <div class="filter-group">
            <span class="filter-label">Fan:</span>
            <div class="filter-tabs">
              <button class="filter-tab" :class="{ active: subjectFilter === '' }"
                @click="subjectFilter = ''; loadData(true)">
                Hammasi
              </button>
              <button v-for="subj in ['Biologiya', 'Kimyo', 'Ona tili', 'Rus tili', 'Tarix', 'Matematika']" :key="subj"
                class="filter-tab" :class="{ active: subjectFilter === subj }"
                @click="subjectFilter = subj; loadData(true)">
                {{ subj }}
              </button>
            </div>
          </div>

          <!-- Darajalar -->
          <div class="filter-group">
            <span class="filter-label">Daraja:</span>
            <div class="filter-tabs">
              <button class="filter-tab" :class="{ active: levelFilter === '' }"
                @click="levelFilter = ''; loadData(true)">
                Hammasi
              </button>
              <button v-for="lvl in ['A+', 'A', 'B+', 'B', 'C+', 'C', 'DTM']" :key="lvl" class="filter-tab"
                :class="{ active: levelFilter === lvl }" @click="levelFilter = lvl; loadData(true)">
                {{ lvl }}
              </button>
            </div>
          </div>
        </div>
      </div>

      <div v-if="loading" class="loading" role="status">Yuklanmoqda...</div>

      <div v-else-if="!groups || groups.length === 0" class="empty-state">
        <p v-if="errorMessage" style="color: #ff8a80;">Xatolik: {{ errorMessage }}</p>
        <div v-else>
          <p>Hozircha natijalar mavjud emas.</p>
          <small style="display: block; margin-top: 1rem; opacity: 0.6;">
            (Eslatma: Agar ma'lumot yuklagan bo'lsangiz, SQL VIEW yaratilganiga va Supabase ulanishi to'g'riligiga
            ishonch hosil qiling.)
          </small>
        </div>
      </div>

      <div v-else class="certificate-grid reveal reveal-left">
        <CertificateCard v-for="group in groups" :key="group.student_id" :group="group" @select="openModal" />
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

.filters-container {
  margin-top: 2rem;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  align-items: center;
}

.filter-group {
  display: flex;
  align-items: center;
  gap: 1rem;
  flex-wrap: wrap;
  justify-content: center;
}

.filter-label {
  font-weight: 800;
  color: var(--color-accent);
  font-size: 0.9rem;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  min-width: 60px;
}

.filter-tabs {
  display: flex;
  background: rgba(255, 255, 255, 0.03);
  padding: 0.4rem;
  border-radius: 100px;
  border: 1px solid var(--color-border);
  gap: 0.25rem;
  flex-wrap: wrap;
  justify-content: center;
}

.filter-tab {
  background: transparent;
  border: none;
  color: var(--color-text-light);
  padding: 0.5rem 1.2rem;
  border-radius: 100px;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  font-size: 0.85rem;
  white-space: nowrap;
}

.filter-tab:hover {
  color: white;
  background: rgba(255, 255, 255, 0.05);
}

.filter-tab.active {
  background: var(--grad-button);
  color: white;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.3);
}

@media (max-width: 768px) {
  .filter-group {
    flex-direction: column;
    gap: 0.5rem;
  }

  .filter-tabs {
    border-radius: 20px;
    padding: 0.5rem;
  }
}

.modal-image-wrapper {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  max-width: 1000px;
  margin: 0 auto;
}

.full-cert-img {
  max-width: 90vw;
  max-height: 80vh;
  border-radius: 16px;
  box-shadow: 0 40px 100px rgba(0, 0, 0, 0.8);
  object-fit: contain;
  border: 1px solid rgba(255, 255, 255, 0.1);
  background: #000;
}

.nav-btn {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  color: white;
  width: 70px;
  height: 70px;
  border-radius: 20px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  z-index: 10;
}

.nav-btn:hover:not(:disabled) {
  background: var(--color-accent);
  border-color: var(--color-accent);
  transform: translateY(-50%) scale(1.1);
  box-shadow: 0 0 30px rgba(0, 191, 166, 0.4);
}

.nav-btn:disabled {
  opacity: 0.1;
  cursor: not-allowed;
}

.nav-btn.prev {
  left: -100px;
}

.nav-btn.next {
  right: -100px;
}

@media (max-width: 1300px) {
  .nav-btn.prev {
    left: 20px;
  }

  .nav-btn.next {
    right: 20px;
  }
}

.modal-info {
  margin-top: 3rem;
  text-align: center;
  color: white;
  max-width: 600px;
  margin-left: auto;
  margin-right: auto;
}

.modal-info h3 {
  font-size: 2.5rem;
  font-weight: 800;
  color: #fff;
  margin-bottom: 0.8rem;
  letter-spacing: -0.02em;
}

.modal-info p {
  font-size: 1.2rem;
  color: var(--color-accent);
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.1em;
}

.cert-counter {
  margin-top: 1.5rem;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  padding: 0.5rem 1.5rem;
  border-radius: 100px;
  display: inline-block;
  font-size: 1rem;
  font-weight: 600;
  color: rgba(255, 255, 255, 0.6);
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
