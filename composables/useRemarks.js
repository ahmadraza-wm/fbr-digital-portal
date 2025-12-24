import { useNuxtApp } from "#app";
import useUiFeedback from "@/composables/useUiFeedback";
import { ref, computed } from "vue";
import { useRoute } from "vue-router";

export function useRemarks() {
  const { $axios } = useNuxtApp();
  const route = useRoute();

  const {
    loading,
    showLoading,
    hideLoading,
    showSuccess,
    showError,
  } = useUiFeedback();

const isEditing = ref(false)
const editId = ref(null)
const formRef = ref(null);


  const remarks = ref([]);
  const remarksId = computed(() => route.params.id || null);
//   const isEditing = computed(() => !!remarksId.value);

  const formData = ref({
    name: "",
    remark: "",
  });

  const fetchRemarks = async (filters = {}) => {
    try {
      const response = await $axios.get("/remarks", { params: filters });
      if (response.data.success) {
        remarks.value = response.data.data;
        showSuccess("remarks fetched successfully...");

      } else {
        showError("Failed to fetch remarks");
      }
    } catch (error) {
      showError("Something went wrong");
    } finally {
      hideLoading();
    }
  };

  const loadRemarkDetails = async () => {
    if (!isEditing.value) return;
    showLoading("Loading details...");
    try {
      const response = await $axios.get(`/remarks/${remarksId.value}`);
      formData.value = { ...response.data.data };
    } catch (error) {
      showError("Failed to load remark details.");
    } finally {
      hideLoading();
    }
  };

  
  const handleSubmit = async () => {
  try {
    showLoading(isEditing.value ? "Updating remarks..." : "Creating remarks...");
    const url = isEditing.value ? `/remarks/${editId.value}` : `/remarks`;
    const method = isEditing.value ? "patch" : "post";

    const response = await $axios({ method, url, data: formData.value });

    if (response.status === 200 || response.status === 201) {
      showSuccess(isEditing.value ? "Remark updated!" : "Remark created!");
      await fetchRemarks();
      resetForm();
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



const deleteRemark = async (id) => {
  try {
    const response = await $axios.delete(`/remarks/${id}`)
    if (response.data.success) {
      showSuccess("Remark deleted!")
      await fetchRemarks()
    } else {
      showError("Failed to delete remark.")
    }
  } catch (error) {
    showError("Something went wrong while deleting.")
  }
}

  
const resetForm = () => {
  formData.value = { name: "", remark: "" };
  isEditing.value = false;
  editId.value = null;
  formRef.value.reset();

};


  return {
    remarks,
    formData,
    loading,
    isEditing,
    formRef,
    editId ,
    fetchRemarks,
    handleSubmit,
    deleteRemark,
    resetForm,
    loadRemarkDetails,
  };
}
