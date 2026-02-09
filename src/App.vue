<script setup>
import Navbar from './components/Navbar.vue'
import Hero from './components/Hero.vue'
import Stats from './components/Stats.vue'
import Subjects from './components/Subjects.vue'
import CertificateGrid from './components/CertificateGrid.vue'
import About from './components/About.vue'
import Gallery from './components/Gallery.vue'
import Features from './components/Features.vue'
import Contact from './components/Contact.vue'
import Footer from './components/Footer.vue'
import { onMounted } from 'vue'

onMounted(() => {
  const observerOptions = {
    threshold: 0.15,
    rootMargin: '0px 0px -50px 0px'
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('reveal-visible')
      }
    })
  }, observerOptions)

  document.querySelectorAll('.reveal, .reveal-up, .reveal-left, .reveal-right, .reveal-scale').forEach(el => {
    observer.observe(el)
  })
})
</script>

<template>
  <div class="app-wrapper">
    <Navbar />
    <main>
      <Hero />
      <Stats />
      <Subjects />
      <CertificateGrid />
      <About />
      <Gallery />
      <Features />
      <Contact />
    </main>
    <Footer />
  </div>
</template>

<style>
/* Global styles are in assets/style.css */
.app-wrapper {
  min-height: 100vh;
  background-color: var(--color-dark);
  display: flex;
  flex-direction: column;
}

main {
  flex: 1;
  padding-bottom: 5rem;
}
</style>
