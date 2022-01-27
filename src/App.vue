<script setup lang="ts">
import { VueQueryDevTools } from 'vue-query/devtools';
import { useQueryProvider } from 'vue-query';

useQueryProvider();
</script>

<template>
  <router-view />
  <VueQueryDevTools />
</template>
