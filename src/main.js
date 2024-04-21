import { createApp } from "vue";
import { createPinia } from "pinia";

import App from "./App.vue";
import router from "./router";

// Vuetify
import "vuetify/styles";
import { createVuetify } from "vuetify";
import * as components from "vuetify/components";
import * as directives from "vuetify/directives";

const vuetify = createVuetify({
  components,
  directives,
});

// Import vue-scrollto
import VueScrollRo from "vue-scrollto";

const app = createApp(App);

app.use(vuetify);
app.use(createPinia());
app.use(router);
app.use(VueScrollRo);

app.mount("#app");
