<script setup>
const academyInfo = {
  mission: '7-sinfdan boshlab o\'quvchilarni tibbiyot va tabiiy fanlar yo\'nalishidagi oliygohlarga kirish uchun professional tayyorlov.',
}
</script>

<template>
  <section id="about" class="section-padding bg-light">
    <div class="container">
      <div class="about-content reveal reveal-left">
        <h2 class="section-title">Biz Haqimizda</h2>
        <p class="mission-text">
          {{ academyInfo.mission }}
        </p>
        <div class="about-card reveal reveal-left delay-200">
          <p class="about-desc">
            O'quv markazimiz 20 yildan ortiq vaqtdan beri bo'lajak shifokorlar va olimlarni
            tayyorlab kemoqda. 7-sinfdan boshlab qabul qilinadigan o'quv dasturi DTM va xalqaro
            standartlar asosida ham O'zbek, ham Rus tillarida olib boriladi.
          </p>
          <div class="dormitory-info reveal reveal-up delay-400">
            <div class="dorm-icon">🏠</div>
            <h3>Yotoqxona Xizmati</h3>
            <p>
              Uzoq viloyatlardan kelgan o'quvchilarimiz uchun barcha sharoitlarga ega,
              shinam va xavfsiz yotoqxona xizmati mavjud. O'quvchilar uchun 3 mahal issiq ovqat,
              dars tayyorlash uchun maxsus xonalar va doimiy nazorat ta'minlangan.
            </p>
          </div>
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
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.about-desc {
  color: rgba(255, 255, 255, 0.8);
  font-size: 1.1rem;
  margin-bottom: 2rem;
}

.dormitory-info {
  margin-top: 2rem;
  padding-top: 2rem;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  text-align: center;
}

.dorm-icon {
  font-size: 3rem;
  margin-bottom: 1rem;
}

.dormitory-info h3 {
  color: var(--color-accent);
  font-size: 1.5rem;
  margin-bottom: 1rem;
  font-weight: 800;
}

.dormitory-info p {
  color: rgba(255, 255, 255, 0.7);
  font-size: 1rem;
  line-height: 1.6;
}
</style>
