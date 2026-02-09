<script setup>
const academyInfo = {
  mission: '7-sinfdan boshlab o\'quvchilarni tibbiyot va tabiiy fanlar yo\'nalishidagi oliygohlarga kirish uchun professional tayyorlov.',
}
</script>

<template>
  <section id="about" class="section-padding bg-light">
    <div class="container">
      <div class="about-content">
        <h2 class="section-title">Biz Haqimizda</h2>
        <p class="mission-text">
          {{ academyInfo.mission }}
        </p>
        <div class="about-card">
          <p class="about-desc">
            O'quv markazimiz 20 yildan ortiq vaqtdan beri bo'lajak shifokorlar va olimlarni
            tayyorlab kelmoqda. 7-sinfdan boshlab qabul qilinadigan o'quv dasturi DTM va xalqaro
            standartlar asosida ham O'zbek, ham Rus tillarida olib boriladi.
          </p>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.about-content {
  max-width: 800px; 
  margin: 0 auto; 
  text-align: center;
}
.mission-text {
  font-size: 1.25rem; 
  color: rgba(255, 255, 255, 0.8); 
  margin-bottom: 2rem; 
  line-height: 1.8;
}
.about-card {
  background: rgba(255, 255, 255, 0.05); 
  padding: 3rem; 
  border-radius: 32px; 
  box-shadow: 0 10px 30px rgba(0,0,0,0.1); 
  backdrop-filter: blur(10px); 
  border: 1px solid rgba(255,255,255,0.1);
}
.about-desc {
  color: rgba(255, 255, 255, 0.8); 
  font-size: 1.1rem;
}
</style>
