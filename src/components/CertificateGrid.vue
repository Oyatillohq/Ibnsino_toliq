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

const loadData = async () => {
  loading.value = true
  try {
    const result = await certificateService.getGroupedCertificates({ 
      year: yearFilter.value, 
      page: page.value 
    })
    groups.value = result.data || []
  } catch (err) {
    console.error("Ma'lumot yuklashda xatolik:", err)
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

onMounted(loadData)
</script>

<template>
  <section id="certificates" class="section-padding">
    <div class="container">
      <div class="section-header reveal reveal-left">
        <h2 class="section-title">O'quvchilar Natijalari</h2>
        <div class="filters">
           <select v-model="yearFilter" @change="loadData" class="filter-select">
             <option value="">Barcha yillar</option>
             <option value="2024">2024</option>
             <option value="2025">2025</option>
           </select>
        </div>
      </div>

      <div v-if="loading" class="loading">Yuklanmoqda...</div>
      
      <div v-else-if="groups.length > 0" class="certificate-grid reveal reveal-left">
        <CertificateCard 
          v-for="group in groups" 
          :key="group.student_id" 
          :group="group" 
          @select="openModal"
        />
      </div>
      
      <div v-else class="empty-state">
        <p>Hozircha tanlangan yil bo'yicha natijalar mavjud emas.</p>
      </div>
    </div>

    <!-- Modal for viewing certificates -->
    <div class="modal" :class="{ active: isModalActive }" @click.self="closeModal">
      <div class="modal-content" v-if="selectedGroup">
        <button class="modal-close" @click="closeModal">
          <X :size="32" />
        </button>
        
        <div class="modal-image-wrapper">
          <img :src="selectedGroup.certificates[currentCertIndex].image_url" 
               class="full-cert-img" 
               alt="Certificate">
          
          <button v-if="selectedGroup.certificates.length > 1" 
                  class="nav-btn prev" 
                  @click="prevCert" 
                  :disabled="currentCertIndex === 0">
            <ChevronLeft :size="40" />
          </button>
          
          <button v-if="selectedGroup.certificates.length > 1" 
                  class="nav-btn next" 
                  @click="nextCert" 
                  :disabled="currentCertIndex === selectedGroup.certificates.length - 1">
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
.loading { text-align: center; padding: 4rem; color: var(--color-accent); font-weight: bold; }
.empty-state { text-align: center; padding: 4rem; color: var(--color-text-light); }
.filters { margin-bottom: 2rem; display: flex; justify-content: center; }
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
    box-shadow: 0 0 50px rgba(0,0,0,0.5);
    object-fit: contain;
}

.nav-btn {
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    background: rgba(0,0,0,0.5);
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

.nav-btn.prev { left: -80px; }
.nav-btn.next { right: -80px; }

@media (max-width: 1200px) {
    .nav-btn.prev { left: 10px; }
    .nav-btn.next { right: 10px; }
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
    background: rgba(255,255,255,0.1);
    padding: 0.3rem 1rem;
    border-radius: 50px;
    display: inline-block;
    font-size: 0.9rem;
}
</style>
