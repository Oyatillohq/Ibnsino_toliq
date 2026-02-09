<script setup>
import { Phone, Send, MapPin } from 'lucide-vue-next'

const contactData = {
  phones: ['+998 94 444 33 66', '+998 94 855 33 66', '+998 91 659 07 93', '+998 90 634 88 98', '+998 94 494 12 03'],
  telegram: 'https://t.me/Ibn_Sino_Education',
  address: "Farg'ona viloyati, Marg'ilon shahri, Ashurali Zokirov ko'chasi"
}
</script>

<template>
  <section id="contact" class="section-padding">
    <div class="container">
      <div class="section-header reveal reveal-left">
        <h2 class="section-title">Bizning Manzilimiz</h2>
        <p class="section-desc">Biz bilan bog'laning yoki markazimizga tashrif buyuring</p>
      </div>

      <div class="contact-layout">
        <div class="contact-card reveal reveal-left">
          <div class="contact-info-group">
            <h3 class="contact-sub-title">Bog'lanish uchun</h3>
            <div class="phone-list">
              <a v-for="phone in contactData.phones" :key="phone"
                 :href="'tel:' + phone.replace(/\s/g, '')" class="phone-item">
                <div class="icon-circle"><Phone :size="20" /></div>
                <span>{{ phone }}</span>
              </a>
            </div>
          </div>

          <div class="contact-info-group">
            <h3 class="contact-sub-title">Telegram kanalimiz</h3>
            <a :href="contactData.telegram" class="phone-item telegram-link" target="_blank">
               <div class="icon-circle"><Send :size="20" /></div>
               <span>@Ibn_Sino_Education</span>
            </a>
          </div>

        </div>

        <div class="map-container reveal reveal-left">
          <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3245.895943717643!2d71.2522892718998!3d40.38575108464176!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x38bb01cce3a664bf%3A0x655ad28fe9cf1574!2sIbn%20Sino%20Education!5e0!3m2!1suz!2s!4v1770474783215!5m2!1suz!2s"
              allowfullscreen="" loading="lazy">
          </iframe>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.contact-layout {
  display: grid;
  grid-template-columns: 1fr;
  gap: 3rem;
  align-items: start;
}

@media (min-width: 1024px) {
  .contact-layout {
    grid-template-columns: 1fr 1.5fr;
  }
}

.contact-card {
  background: var(--color-surface);
  padding: 3rem;
  border-radius: 32px;
  border: 1px solid var(--color-border);
  backdrop-filter: blur(10px);
}

.contact-info-group {
  margin-bottom: 2.5rem;
}

.contact-info-group:last-child {
  margin-bottom: 0;
}

.contact-sub-title {
  font-size: 1.1rem;
  font-weight: 800;
  color: var(--color-accent);
  margin-bottom: 1.25rem;
  text-transform: uppercase;
  letter-spacing: 0.1em;
}

.phone-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.phone-item {
  display: flex;
  align-items: center;
  gap: 1.25rem;
  color: #FFFFFF;
  text-decoration: none;
  font-size: 1.1rem;
  font-weight: 600;
  transition: 0.3s;
}

.phone-item:hover {
  color: var(--color-accent);
  transform: translateX(10px);
}

.icon-circle {
  width: 44px;
  height: 44px;
  background: rgba(0, 191, 166, 0.1);
  color: var(--color-accent);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: 0.3s;
}

.phone-item:hover .icon-circle {
  background: var(--color-accent);
  color: white;
}

.map-container {
  width: 100%;
  height: 500px;
  border-radius: 32px;
  overflow: hidden;
  border: 1px solid var(--color-border);
  box-shadow: var(--shadow-premium);
}

.map-container iframe {
  width: 100%;
  height: 100%;
  border: none;
}

.address-item:hover {
  transform: none;
}
</style>
