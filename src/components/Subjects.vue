<script setup>
import { Microscope, FlaskConical, Calculator, Landmark, Languages } from 'lucide-vue-next'

const subjects = [
  {
    category: 'Asosiy Fanlar',
    items: [
      { name: 'Biologiya', icon: Microscope, desc: 'Tibbiyot oliygohlari uchun chuqurlashtirilgan va mukammal tayyorlov.' },
      { name: 'Kimyo', icon: FlaskConical, desc: 'Nazariy va amaliy mashg\'ulotlar, murakkab masalalar yechish metodikasi.' }
    ]
  },
  {
    category: 'Majburiy Fanlar',
    items: [
      { name: 'Matematika', icon: Calculator, desc: 'Mantiqiy fikrlash va bazaviy bilimlar.' },
      { name: 'Tarix', icon: Landmark, desc: 'O\'zbekiston va jahon tarixi bo\'yicha mukammal bilim.' },
      { name: 'Ona tili', icon: Languages, desc: 'Ona tili bo\'yicha mukammal bilim.' }
    ]
  }
]
</script>

<template>
  <section id="subjects" class="section-padding bg-white">
    <div class="container">
      <div class="section-header">
        <h2 class="section-title">O'quv Yo'nalishlari</h2>
        <p class="section-desc">Akademiyamizda fanlar mutaxassislik darajasiga ko'ra guruhlangan.</p>
      </div>

      <div v-for="(cat, catIndex) in subjects" :key="cat.category" 
           :style="{ marginTop: catIndex > 0 ? '4rem' : '0' }">
        <h3 class="category-title">
          {{ cat.category }}
        </h3>
        <div class="features-grid">
          <div v-for="item in cat.items" :key="item.name" class="feature-card">
            <div class="feature-icon-box"
                 :style="{ background: catIndex === 0 ? 'rgba(0, 191, 166, 0.1)' : 'rgba(50, 140, 193, 0.1)', color: catIndex === 0 ? 'var(--color-accent)' : 'var(--color-secondary)' }">
              <component :is="item.icon" :size="32" />
            </div>
            <h4>{{ item.name }}</h4>
            <p class="feature-desc">{{ item.desc }}</p>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.category-title {
  color: white; 
  margin-bottom: 2rem; 
  border-left: 4px solid var(--color-accent); 
  padding-left: 1rem;
}
.feature-desc {
  color: rgba(255, 255, 255, 0.7); 
  margin-top: 0.5rem; 
  font-size: 0.95rem;
}
</style>
