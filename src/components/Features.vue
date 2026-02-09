<script setup>
import { Award, GraduationCap, Users, ClipboardCheck, Star } from 'lucide-vue-next'

const features = [
  { title: 'Milliy Sertifikatga tayyorlov', description: 'A+ va A darajadagi Milliy sertifikat olish uchun maxsus kurslar.', icon: Award },
  { title: 'Oliy o\'quv yurtlariga tayyorgarlik', description: 'Tibbiyot va boshqa yetakchi oliygohlarga kirish imtihonlariga tayyorlov.', icon: GraduationCap },
  { title: 'Tajribali ustozlar', description: 'O\'z sohasining mutaxassisi bo\'lgan oliy toifali mutaxassislar.', icon: Users },
  { title: 'Haftalik imtihonlar', description: 'Har haftalik nazorat testlari va natijalar monitoringi.', icon: ClipboardCheck },
  { title: 'Shaxsiy qo\'llab-quvvatlash', description: 'Har bir o\'quvchi bilan individual ishlash va natijaga yo\'naltirilganlik.', icon: Star }
]
</script>

<template>
  <section id="features" class="section-padding bg-white">
    <div class="container">
      <div class="section-header">
        <h2 class="section-title">Akademiya Afzalliklari</h2>
      </div>
      <div class="features-grid">
        <div v-for="f in features" :key="f.title" class="feature-card">
          <div class="feature-icon-box">
            <component :is="f.icon" :size="32" />
          </div>
          <h3>{{ f.title }}</h3>
          <p class="feature-desc">{{ f.description }}</p>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.feature-desc {
  color: rgba(255, 255, 255, 0.7); 
  margin-top: 0.75rem;
}
</style>
