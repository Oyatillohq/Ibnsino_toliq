<script setup>
import { Phone, Send } from 'lucide-vue-next'

const contactData = {
  phones: ['+998 94 444 33 66', '+998 94 855 33 66', '+998 91 659 07 93', '+998 90 634 88 98', '+998 94 494 12 03'],
  telegram: 'https://t.me/Ibn_Sino_Education'
}
</script>

<template>
  <section id="contact" class="section-padding bg-light">
    <div class="container">
      <div class="section-header reveal reveal-up">
        <h2 class="section-title">Bizning Manzilimiz</h2>
      </div>
      <div class="contact-layout">
        <div class="contact-card reveal reveal-left">
          <h3 class="contact-title">Bog'lanish</h3>
          <div class="phone-list">
            <a v-for="phone in contactData.phones" :key="phone"
               :href="'tel:' + phone.replace(/\s/g, '')" class="phone-item">
              <Phone :size="24" /> {{ phone }}
            </a>
            <a :href="contactData.telegram" class="phone-item" target="_blank">
              <Send :size="24" /> @Ibn_Sino_Education
            </a>
          </div>
        </div>
        <div class="map-container reveal reveal-right">
          <div class="map-placeholder">
            <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3245.895943717643!2d71.2522892718998!3d40.38575108464176!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x38bb01cce3a664bf%3A0x655ad28fe9cf1574!2sIbn%20Sino%20Education!5e0!3m2!1suz!2s!4v1770474783215!5m2!1suz!2s"
                allowfullscreen="" loading="lazy" referrerpolicy="no-referrer-when-downgrade">
            </iframe>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.contact-title {
  color: white;
  margin-bottom: 1.5rem;
}
.phone-list {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}
</style>
