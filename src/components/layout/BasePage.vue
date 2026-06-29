<script setup lang="ts">
</script>

<template>
  <div class="base-page">
    <div class="base-page-actions">
      <slot name="actions" />
    </div>
    <slot />
  </div>
</template>

<style scoped lang="scss">
.base-page {
  position: relative;
  padding: 24px;
  display: flex;
  flex-direction: column;
  gap: 20px;
  height: 100%;
  box-sizing: border-box;
  overflow: auto;
}

.base-page-actions {
  position: absolute;
  top: 44px;
  right: 64px;
  z-index: 10;
}
</style>