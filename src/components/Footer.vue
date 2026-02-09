<template>
  <footer class="footer">
    <div class="container footer-content reveal reveal-up">
      <div class="footer-logo">IBN <span>SINO</span> EDUCATION</div>
      <div class="footer-links">
          <a href="#hero">Bosh sahifa</a>
          <a href="#results">Natijalar</a>
          <a href="#subjects">Fanlar</a>
          <a href="#about">Biz haqimizda</a>
      </div>
      <p class="copyright">&copy; {{ new Date().getFullYear() }} Ibn Sino Education. Barcha huquqlar himoyalangan.</p>
    </div>
  </footer>
</template>

<style scoped>
.footer-content {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 2rem;
    text-align: center;
}
.footer-logo {
    font-size: 1.5rem;
    font-weight: 900;
    color: var(--color-accent);
}
.footer-logo span {
    color: white;
}
.footer-links {
    display: flex;
    gap: 2rem;
    flex-wrap: wrap;
    justify-content: center;
}
.footer-links a {
    color: rgba(255,255,255,0.6);
    transition: 0.3s;
}
.footer-links a:hover {
    color: var(--color-accent);
}
.copyright {
    color: rgba(255,255,255,0.4);
    font-size: 0.9rem;
}
</style>
