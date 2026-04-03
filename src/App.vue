<script setup>
import { computed, onMounted, onUnmounted, ref } from 'vue';
import AppHeader from './components/AppHeader.vue';
import ItemCard from './components/ItemCard.vue';
import {
  defaultCatalogQuery,
  fetchFeaturedItems,
  getItemCountLabel,
} from './lib/catalog.js';

const items = ref([]);
const meta = ref(defaultCatalogQuery);
const status = ref('loading');
const error = ref('');
const currentPath = ref(
  typeof window === 'undefined' ? '/' : window.location.pathname,
);

function syncCurrentPath() {
  currentPath.value = window.location.pathname;
}

const pageVariant = computed(() => {
  if (currentPath.value === '/baseline') {
    return 'baseline';
  }

  if (currentPath.value === '/shift') {
    return 'shift';
  }

  if (currentPath.value === '/crop') {
    return 'crop';
  }

  return 'default';
});

const showRequestProfile = computed(() => pageVariant.value === 'default');
const featuredPanelClasses = computed(() => ({
  'panel--shifted': pageVariant.value === 'shift',
}));
const cardGridShellClasses = computed(() => ({
  'card-grid-shell--cropped': pageVariant.value === 'crop',
}));

async function loadItems() {
  status.value = 'loading';
  error.value = '';

  try {
    const data = await fetchFeaturedItems();
    items.value = data.items ?? [];
    meta.value = data.meta ?? defaultCatalogQuery;
    status.value = 'ready';
  } catch (caughtError) {
    error.value =
      caughtError instanceof Error
        ? caughtError.message
        : 'Unable to reach the demo API.';
    status.value = 'error';
  }
}

onMounted(() => {
  syncCurrentPath();
  loadItems();
  window.addEventListener('popstate', syncCurrentPath);
});

onUnmounted(() => {
  window.removeEventListener('popstate', syncCurrentPath);
});
</script>

<template>
  <div class="page-shell">
    <AppHeader />

    <main class="content-grid">
      <section
        v-if="showRequestProfile"
        class="panel panel--info"
        aria-labelledby="request-profile-title"
      >
        <div class="panel__heading">
          <p class="panel__eyebrow">Request profile</p>
          <h2 id="request-profile-title">This page loads a small API payload on mount.</h2>
        </div>
        <p class="request-summary" data-cy="request-summary">
          {{ `GET /api/items?section=${meta.section}&limit=${meta.limit}&locale=${meta.locale}` }}
        </p>
        <p class="panel__copy">
          The response powers the card list below, which makes it handy for both
          request inspection with <code>cy.intercept()</code> and lightweight
          component or unit test demos.
        </p>
      </section>

      <section
        class="panel"
        :class="featuredPanelClasses"
        aria-labelledby="featured-items-title"
        data-cy="featured-items-panel"
      >
        <div class="panel__heading panel__heading--row">
          <div>
            <p class="panel__eyebrow">Featured items</p>
            <h2 id="featured-items-title">Server-backed demo content</h2>
          </div>
          <span class="pill">
            {{ status === 'ready' ? getItemCountLabel(items.length) : 'Loading...' }}
          </span>
        </div>

        <p v-if="status === 'loading'" class="status-card">
          Loading featured picks from the demo API...
        </p>

        <p v-else-if="status === 'error'" class="status-card status-card--error" role="alert">
          {{ error }}
        </p>

        <div
          v-else
          class="card-grid-shell"
          :class="cardGridShellClasses"
          data-cy="card-grid-shell"
        >
          <ul class="card-grid" aria-label="Featured demo items">
            <ItemCard v-for="item in items" :key="item.id" :item="item" />
          </ul>
        </div>
      </section>
    </main>
  </div>
</template>
