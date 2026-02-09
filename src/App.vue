<script setup>
import Navbar from './components/Navbar.vue'
import Footer from './components/Footer.vue'
import { onMounted, watch, nextTick } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()

const initAnimations = () => {
  const elements = document.querySelectorAll('.reveal, .reveal-up, .reveal-left, .reveal-right, .reveal-scale')

  if (elements.length === 0) {
    setTimeout(initAnimations, 100)
    return
  }

  const observerOptions = {
    threshold: 0.05,
    rootMargin: '0px 0px 50px 0px'
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('reveal-visible')
      }
    })
  }, observerOptions)

  elements.forEach(el => {
    const rect = el.getBoundingClientRect()
    if (rect.top < window.innerHeight && rect.bottom > 0) {
      el.classList.add('reveal-visible')
    }
    observer.observe(el)
  })

  // Mandatory Fallback: After 1s, reveal EVERYTHING regardless of observer
  setTimeout(() => {
    document.querySelectorAll('.reveal, .reveal-up, .reveal-left, .reveal-right, .reveal-scale')
      .forEach(el => el.classList.add('reveal-visible'))
  }, 1000)
}

onMounted(() => {
  setTimeout(initAnimations, 300)
})

watch(() => route.path, () => {
  // Clear old visible states for the new page
  document.querySelectorAll('.reveal-visible').forEach(el => el.classList.remove('reveal-visible'))

  setTimeout(() => {
    nextTick(() => {
      initAnimations()
    })
  }, 400)
})
</script>

<template>
  <div class="app-wrapper">
    <Navbar />
    <main>
      <router-view v-slot="{ Component }">
        <transition name="fade" mode="out-in">
          <component :is="Component" />
        </transition>
      </router-view>
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
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
