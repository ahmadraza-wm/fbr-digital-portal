import { defineNuxtPlugin } from "#app";
import { defineAsyncComponent } from "vue";

export default defineNuxtPlugin((nuxtApp) => {
    nuxtApp.vueApp.component(
        "LaravelVuePagination",
        defineAsyncComponent(() => import("laravel-vue-pagination"))
    );
});
