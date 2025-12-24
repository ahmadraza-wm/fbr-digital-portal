import { useNuxtApp } from "#app";
import useUiFeedback from "@/composables/useUiFeedback";
import { computed, onMounted, ref } from "vue";
import { useRoute, useRouter } from "vue-router";

export const useCountries = () => {
  const { $axios } = useNuxtApp();
  const route = useRoute();
  const router = useRouter();

  const {
    loading,
    showLoading,
    hideLoading,
    showSuccess,
    showError,
    confirmAction,
  } = useUiFeedback();

  const CountriesList = ref();
  const statuses = [
    { value: 1, text: "Active" },
    { value: 0, text: "Inactive" },
  ];

  const resolveStatusVariant = (status) =>
  ({
    1: { color: "success", text: "Active" },
    0: { color: "error", text: "Inactive" },
  }[status] || { color: "info", text: "Unknown" });

  const fetchCountries = async (filters = {}, withPagination = true) => {
    showLoading("Fetching Countries...");
    try {
      const response = await $axios.get("/countries");
      CountriesList.value = response.data.data;
      showSuccess('Countries Fetched');
    } catch (error) {
      showError("Something went wrong while Fetching Countries.");
      console.error(error);
    } finally {
      hideLoading();
    }
  };
  return {
   fetchCountries,
   CountriesList
  };
};
