
<script setup>
import { ref } from "vue";
import axios from "axios";
import { cw_endpoint } from "../constant/endpoint";
import { useCookieStore } from "../stores/cookieStore";

const cookieStore = useCookieStore();
const visible = ref(false);

const name = ref("");
const userName = ref("");
const email = ref("");
const password = ref("");

const submitForm = async () => {
  try {
    console.log(name.value, userName.value, email.value, password.value);
    const res = await axios.post(`${cw_endpoint}/register`, {
      name: name.value,
      userName: userName.value,
      email: email.value,
      password: password.value,
    });

    if (res.status === 201) {
      console.log(res.data.token);
      // call the setCookies function from the cookie store
      cookieStore.setCookies(res.data.token);
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
          type="text"
          placeholder="Name"
          variant="outlined"
          v-model="name"
        />
      </div>
      <div class="form-group">
        <v-text-field
          type="text"
          placeholder="userName"
          variant="outlined"
          v-model="userName"
        />
      </div>
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
        <button class="pa-3" type="submit">Sign up</button>
      </div>
      <div class="mt-4">
        Already have an account?
        <RouterLink to="/login" class="text-green text-decoration-none"
          >Login</RouterLink
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