<script setup>
import Navbar from "@/components/Navbar.vue";
import Footer from "@/components/Footer.vue";
</script>

<template>
  <v-app>
    <Navbar />
    <RouterView />
    <Footer />
  </v-app>
</template>

<style scoped>
</style>
