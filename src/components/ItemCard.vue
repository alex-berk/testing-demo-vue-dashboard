<script setup>
defineProps({
  item: {
    type: Object,
    required: true,
  },
});
</script>

<template>
  <li class="item-card" :data-cy="`item-${item.id}`">
    <div class="item-card__top">
      <p class="item-card__category">{{ item.category }}</p>
      <span :class="['stock-badge', { 'stock-badge--muted': !item.inStock }]">
        {{ item.inStock ? 'In stock' : 'Back soon' }}
      </span>
    </div>
    <h3 class="item-card__title">{{ item.name }}</h3>
    <p class="item-card__accent">{{ item.accent }}</p>
    <div class="item-card__footer">
      <span class="item-card__price">{{ item.displayPrice }}</span>
      <span class="item-card__section">{{ item.section }}</span>
    </div>
  </li>
</template>
