<script setup>
import { ref } from "vue";

const celebName1 = ref("Bangtan");
const celebName2 = ref("BTS");
</script>


<template>
  <div class="logo ga-2">
    <!-- <span>{{ celebName1 }}</span> -->
    <span>{{ celebName2 }}</span>
  </div>
</template>

  
<style scoped>
.logo {
  display: flex;
  font-size: 33px;
  font-family: "Dancing Script", cursive;
  font-weight: 700;
  width: fit-content;
}

.logo > :last-child {
  color: #e80f88;
}
</style>