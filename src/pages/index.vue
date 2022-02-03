<script setup lang="ts">
import { useRouter } from 'vue-router';
import { useAuth } from '~/composables/useAuth';

const router = useRouter();
const auth = useAuth();
</script>

<template>
  <div>
    <h1>Index Page</h1>
    <q-btn @click="auth.signout(router)">Signout</q-btn>
  </div>
</template>
