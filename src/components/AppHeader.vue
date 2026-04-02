<script setup>
defineProps({
  eyebrow: {
    type: String,
    default: 'QA-ready Vite demo',
  },
  title: {
    type: String,
    default: 'Demo Catalog',
  },
  subtitle: {
    type: String,
    default:
      'A single-page app that fetches a tiny catalog from a local API for Cypress and Vitest examples.',
  },
});
</script>

<template>
  <header class="hero">
    <div class="hero__badge">{{ eyebrow }}</div>
    <h1 class="hero__title" data-cy="page-title">{{ title }}</h1>
    <p class="hero__copy" data-cy="page-subtitle">{{ subtitle }}</p>
  </header>
</template>
