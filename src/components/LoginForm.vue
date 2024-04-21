
<style scoped>
</style>
<script setup>
import { ref } from "vue";
import axios from "axios";
import { cw_endpoint } from "../constant/endpoint";
import { useCookieStore } from "../stores/cookieStore";
import { useRouter } from "vue-router";

const router = useRouter();
const cookieStore = useCookieStore();

const email = ref("");
const password = ref("");
const visible = ref(false);
const isLoading = ref(false);

const submitForm = async () => {
  try {
    isLoading.value = true;
    console.log(email.value, password.value);
    const res = await axios.post(`${cw_endpoint}/login`, {
      email: email.value,
      password: password.value,
    });

    if (res.status === 200) {
      console.log(res.data.token);
      // call the setCookies function from the cookie store
      cookieStore.setCookies(res.data.token);
      isLoading.value = false;
      router.push("/");
    } else {
      return "Login Error";
    }
  } catch (err) {
    console.error("Error submitting form", err, err.message);
  }
};
</script>

<template>
  <div class="container mt-10">
    <v-form @submit.prevent="submitForm" class="px-3">
      <div class="form-group">
        <v-text-field
          type="email"
          variant="outlined"
          placeholder="email"
          v-model="email"
        />
      </div>
      <div class="form-group pass-input">
        <v-text-field
          :type="visible ? 'text' : 'password'"
          variant="outlined"
          placeholder="password"
          v-model="password"
        />

        <i
          :class="
            visible
              ? 'fa-regular fa-eye-slash visible'
              : 'fa-regular fa-eye visible'
          "
          @click="visible = !visible"
        ></i>
      </div>
      <div class="form-group">
        <button class="pa-3" type="submit">
          <v-progress-circular
            v-show="isLoading"
            color="blue-grey"
            model-value="100"
            indeterminate
          ></v-progress-circular>
          <span v-show="!isLoading">sign in</span>
        </button>
      </div>
      <div class="mt-4">
        Don't have an account?
        <RouterLink to="/signup" class="text-green text-decoration-none"
          >Sing up</RouterLink
        >
      </div>
    </v-form>
  </div>
</template>
<style scoped>
.pass-input {
  position: relative;
  display: flex;
}

.visible {
  position: absolute;
  right: 0.5rem;
  top: 18%;
  font-size: 20px;
}

.form-group {
  width: 100%;
}

.form-group button {
  width: 100%;
  background-color: #000;
  color: #fff;
  font-size: 18px;
  border-radius: 3px;
}
</style>