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
    const { data, count } = await certificateService.getGroupedCertificates({ 
      year: yearFilter.value, 
      page: page.value 
    })
    groups.value = data
    total.value = count
  } catch (err) {
    console.error(err)
  } finally {
    loading.value = false
  }
}

onMounted(loadData)
</script>

<template>
  <section id="certificates" class="section-padding">
    <div class="container">
      <div class="section-header">
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
      
      <div v-else class="certificate-grid">
        <CertificateCard 
          v-for="group in groups" 
          :key="group.student_id" 
          :group="group" 
        />
      </div>
    </div>
  </section>
</template>

<style scoped>
.loading { text-align: center; padding: 4rem; color: var(--color-accent); font-weight: bold; }
.filters { margin-bottom: 2rem; display: flex; justify-content: center; }
.filter-select { 
  background: var(--color-surface); 
  color: var(--color-text); 
  border: 1px solid var(--color-border); 
  padding: 0.5rem 1rem;
  border-radius: 8px;
}
</style>
