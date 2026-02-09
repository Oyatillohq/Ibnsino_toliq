<script setup>
import Navbar from './components/Navbar.vue'
import Footer from './components/Footer.vue'
import { onMounted, watch } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()

const initAnimations = () => {
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
}

onMounted(() => {
    setTimeout(initAnimations, 500)
})

// Re-init animations on route change
watch(() => route.path, () => {
    setTimeout(initAnimations, 100)
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
