
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
const visible = ref(false);
const isLoading = ref(false);
const serverErr = ref();
const formData = reactive({
  name: "",
  userName: "",
  email: "",
  password: "",
});

const rules = {
  name: { required },
  email: { required, email },
  userName: { required },
  password: { required },
};

const v$ = useVuelidate(rules, formData);
const submitForm = async () => {
  const formValid = await v$.value.$validate();

  if (!formValid) return console.log("Form is not valid!");

  registerUser();
};

const registerUser = async () => {
  try {
    isLoading.value = true;
    // console.log(
    //   formData.name,
    //   formData.userName,
    //   formData.email,
    //   formData.password
    // );
    const res = await axios.post(`${cw_endpoint}/register`, {
      name: formData.name,
      userName: formData.userName,
      email: formData.email,
      password: formData.password,
    });

    if (res.status === 201) {
      // console.log(res.data.token);
      // call the setCookies function from the cookie store
      cookieStore.setCookies(res.data.token);
      router.push("/");
    }
  } catch (err) {
    serverErr.value = err.response.data.errors;
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
        <span v-for="err in serverErr" :key="err">
          {{ err }}
        </span>
      </div>
      <div class="form-group">
        <v-text-field
          type="text"
          placeholder="Name"
          variant="outlined"
          v-model="formData.name"
          @input="v$.name.$touch"
          @blur="v$.name.$touch"
          :error-messages="v$.name.$errors.map((e) => e.$message)"
        />
      </div>
      <div class="form-group">
        <v-text-field
          type="text"
          placeholder="userName"
          variant="outlined"
          v-model="formData.userName"
          @input="v$.userName.$touch"
          @blur="v$.userName.$touch"
          :error-messages="v$.userName.$errors.map((e) => e.$message)"
        />
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
          <span v-show="!isLoading">Sign up</span>
        </button>
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

.serverErr {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  font-size: 17px;
}
</style>