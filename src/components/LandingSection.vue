
<script setup>
import { ref } from "vue";
import Highlight from "@/components/Highlight.vue";

// Purchase Your Exclusive Membership Card Now and Enjoy VIP Privileges!
const experience = ref("nce");
const with_dua = ref("Adele");
</script>

<template>
  <div class="cont mt-8">
    <div class="greeting">
      <div class="bg-sec">
        <p>
          Elevate your membership experie<span class="pr-3">
            {{ experience }}
          </span>
          <span class="text-red-accent-4">{{ with_dua }}</span>
          Laurie
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
  width: 100%;
  height: 300px;
  background-color: gray;
  background-image: url("/images/adele-image.jpg");
  background-size: cover;
  padding: 1rem;
}

.bg-sec p {
  position: relative;
  height: fit-content;
  color: mintcream;
}
/* .image {
  width: 100%;
  height: 200px;
  background: green;
  height: 2/2;
} */
</style>