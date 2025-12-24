import { useNuxtApp } from "#app";
import useUiFeedback from "@/composables/useUiFeedback";
import { useRouter } from "vue-router";


export function useConfigureCorridors() {

  const { $axios } = useNuxtApp();
  const router = useRouter();


  const {
    loading,
    showLoading,
    hideLoading,
    showSuccess,
    showError,
    confirmAction,
  } = useUiFeedback();

  const corridorslist = ref([]);
  const pagination = ref([]);


  const form = ref({
    sending_country_id: "",
    receiving_country_id: "",
  })

  const resetForm = () => {
    form.value.sending_country_id = "";
    form.value.receiving_country_id = "";
  };

  const fetchConfigureCorridors = async (filters = {}, withPagination = true) => {
    showLoading("Fetching ConfigureCorridors...");
    try {
      const response = await $axios.get("/corridor/list", {
        params: {
          ...filters,
          pagination: withPagination,
        },
      });

      if (response.data.success) {
        corridorslist.value = response.data.data.data;
        if (withPagination) {
          pagination.value = response.data.data;
        }
      } else {
        showError("Failed to fetch ConfigureCorridors");
      }
    } catch (error) {
      console.error(error);
      showError("Something went wrong");
    } finally {
      hideLoading();
    }
  };


  const saveConfigureCorridor = async (form) => {
    showLoading("Saving ConfigureCorridor...");
    try {
      const payload = new FormData();

      payload.append("sending_country_id", form.sending_country_id);
      payload.append("receiving_country_id", form.receiving_country_id);

      const response = await $axios.post("/corridor/create", payload)

      if (response.status === 200 || response.status === 201) {
        showSuccess("ConfigureCorridor created successfully!");
        fetchConfigureCorridors()
      }
    } catch (error) {
      const messages = error.response?.data?.errors
        ? Object.values(error.response.data.errors).flat()
        : error.response?.data?.message || "Something went wrong";
      showError(messages);
    } finally {
      hideLoading();
    }
  };


  const deleteConfigureCorridor = async (id) => {
    try {
      showLoading("Deleting ConfigureCorridor...");
      const response = await $axios.delete(`/corridor/delete/${id}`);
      if (response.data.success) {
        showSuccess("ConfigureCorridor deleted!");
        await fetchConfigureCorridors();
      } else {
        showError("Failed to delete ConfigureCorridor.");
      }
    } catch (error) {
      showError("Something went wrong while deleting.");
    } finally {
      hideLoading();
    }
  };




  return {

    fetchConfigureCorridors,
    corridorslist,
    form,
    loading,
    pagination,
    deleteConfigureCorridor,
    saveConfigureCorridor,
    resetForm,
  }




}    
