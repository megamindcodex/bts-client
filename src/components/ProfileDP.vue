
<script setup>
import { onMounted } from "vue";
import useUserStore from "../stores/userStore";

const userStore = useUserStore();

onMounted;
</script>

<template>
  <div class="cont">
    <div class="dp"></div>
    <div class="userName">{{ userName }}</div>
  </div>
</template>

<style scoped>
</style>