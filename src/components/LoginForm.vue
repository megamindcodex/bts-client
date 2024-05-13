
<style scoped>
</style>
<script setup>
import { reactive, ref } from "vue";
import axios from "axios";
import { useCookieStore } from "../stores/cookieStore";
import { useRouter } from "vue-router";
import { useVuelidate } from "@vuelidate/core";
import { required, email } from "@vuelidate/validators";
import { cw_endpoint } from "../constant/endpoint";

const router = useRouter();
const cookieStore = useCookieStore();
const serverErr = ref();

const formData = reactive({
  email: "",
  password: "",
});
const visible = ref(false);
const isLoading = ref(false);

const rules = {
  email: { required, email },
  password: { required },
};

const v$ = useVuelidate(rules, formData);
const submitForm = async () => {
  const formValid = await v$.value.$validate();

  if (!formValid) return console.log("Form is not valid!");

  loginUser();
};

const loginUser = async () => {
  try {
    isLoading.value = true;
    console.log(formData.email, formData.password);
    const res = await axios.post(`${cw_endpoint}/login`, {
      email: formData.email,
      password: formData.password,
    });

    if (res.status === 200) {
      // console.log(res.data.token);
      // call the setCookies function from the cookie store
      cookieStore.setCookies(res.data.token);
      router.push("/");
    }
  } catch (err) {
    serverErr.value = err.response.data.error;
    console.log(serverErr.value);
    console.error("Error submitting form", err, err.message);
  } finally {
    isLoading.value = false;
  }
};
</script>

<template>
  <div class="container mt-10">
    <v-form @submit.prevent="submitForm" class="px-3 d-flex flex-column ga-2">
      <div v-if="serverErr" class="text-red serverErr">
        <span>
          {{ serverErr }}
        </span>
      </div>
      <div class="form-group">
        <v-text-field
          type="email"
          variant="outlined"
          placeholder="email"
          v-model="formData.email"
          @input="v$.email.$touch"
          @blur="v$.email.$touch"
          :error-messages="v$.email.$errors.map((e) => e.$message)"
        />
      </div>
      <div class="form-group pass-input">
        <v-text-field
          :type="visible ? 'text' : 'password'"
          variant="outlined"
          placeholder="password"
          v-model="formData.password"
          @input="v$.password.$touch"
          @blur="v$.password.$touch"
          :error-messages="v$.password.$errors.map((e) => e.$message)"
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

.serverErr {
  display: flex;
  justify-content: center;
  font-size: 17px;
}
</style>