<script setup>
import { ref, onMounted } from 'vue'
import { certificateService } from '../api/certificateService'
import CertificateCard from './CertificateCard.vue'

const groups = ref([])
const loading = ref(true)
const page = ref(1)
const total = ref(0)
const yearFilter = ref('')

const loadData = async () => {
  loading.value = true
  try {
    const result = await certificateService.getGroupedCertificates({ 
      year: yearFilter.value, 
      page: page.value 
    })
    groups.value = result.data || []
    total.value = result.count || 0
  } catch (err) {
    console.error("Ma'lumot yuklashda xatolik:", err)
  } finally {
    loading.value = false
  }
}

onMounted(loadData)
</script>

<template>
  <section id="certificates" class="section-padding">
    <div class="container">
      <div class="section-header reveal reveal-up">
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
      
      <div v-else-if="groups.length > 0" class="certificate-grid reveal reveal-scale">
        <CertificateCard 
          v-for="group in groups" 
          :key="group.student_id" 
          :group="group" 
        />
      </div>
      
      <div v-else class="empty-state">
        <p>Hozircha tanlangan yil bo'yicha natijalar mavjud emas.</p>
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
}
</style>
