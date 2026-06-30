<script setup lang="ts">
defineProps<{
  title: string
}>()
</script>

<template>
  <section class="page-panel panel">
    <h2 class="panel-title">{{ title }}</h2>
    <div class="panel-body">
      <slot>
        <div class="placeholder">页面建设中</div>
      </slot>
    </div>
  </section>
</template>

<style scoped lang="scss">
.panel-body {
  flex: 1;
  min-height: 0;
}

.placeholder {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 240px;
  color: var(--color-text-muted);
  font-size: 16px;
  background: var(--color-bg-page-soft);
  border-radius: var(--radius-lg);
}
</style>
