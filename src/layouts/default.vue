<script setup lang="ts">
import { useToken } from '~/api/authentication/useToken';

// This layout is used only for the authenticated pages.
// Do not remove useToken composable.
useToken();
</script>

<template>
  <div>
    <p>Default Layout</p>
    <router-view />
  </div>
</template>
