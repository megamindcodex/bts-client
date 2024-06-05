
<script setup>
import { ref } from "vue";
import Highlight from "@/components/Highlight.vue";

// Purchase Your Exclusive Membership Card Now and Enjoy VIP Privileges!
const experience = ref("the");
const celebName = ref("Bangtan Boys");
</script>

<template>
  <div class="cont mt-4">
    <div class="greeting">
      <div class="bg-sec">
        <p>
          Elevate your membership experience with
          <span class="pr-3">
            {{ experience }}
          </span>

          <span class="last">{{ celebName }}</span>
        </p>
      </div>
    </div>
    <Highlight />
  </div>
</template>
<style scoped>
.cont {
  display: flex;
  flex-direction: column;
  row-gap: 2rem;
}
.greeting {
  display: flex;
  flex-direction: column;
  width: 100%;
  /* padding: 1rem; */
}

.greeting p {
  font-family: "Saira Condensed", sans-serif;
  font-size: 8vw;
  color: #000;
  text-align: center;
}

.bg-sec {
  display: flex;
  justify-content: center;
  align-items: end;
  width: 100%;
  height: 300px;
  /* background-color: #000; */
  background-image: url("/images/bts-image.jpg");
  background-size: cover;
  padding: 1rem;
}

.bg-sec p {
  position: relative;
  height: fit-content;
  color: mintcream;
}

.last {
  color: #e80f88;
  font-weight: 600;
}
/* .image {
  width: 100%;
  height: 200px;
  background: green;
  height: 2/2;
} */
</style>
