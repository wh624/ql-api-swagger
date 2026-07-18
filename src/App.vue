<script setup>
import { RouterView } from 'vue-router'
</script>

<template>
  <div class="app">
    <RouterView />
  </div>
</template>

<style>
.app {
  min-height: 100vh;
  background: var(--bg-primary);
  color: var(--text-primary);
}
</style>
