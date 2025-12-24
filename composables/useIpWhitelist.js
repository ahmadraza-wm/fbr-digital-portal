import { useNuxtApp } from "#app";
import useUiFeedback from "@/composables/useUiFeedback";
import { ref, computed } from "vue";
import { useRoute } from "vue-router";

export function useIpWhitelist() {
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


const iplist = ref([]);
const iplistId = computed(() => route.params.id || null);


const formdata = ref({

    ip_address:"",
    status:"",

})

const resetForm = () => {
  formdata.value = { ip_address: "", status: "" };
  isEditing.value = false;
  editId.value = null;
  formRef.value.reset();

};



const fetchIplist = async (userId, filters = {}) => {
  showLoading("Fetching iplist...");
  try {
    const response = await $axios.get("/ip/addresses", {
      params: { user_id: userId, ...filters }, // ✅ add user_id filter
    });


    if (response.data.success) {
      iplist.value = response.data.data;
    } else {
      showError("Failed to fetch iplist");
    }
  } catch (error) {
    showError("Something went wrong");
  } finally {
    hideLoading();
  }
};


   const handleSubmit = async (userId) => {
  try {
    showLoading(isEditing.value ? "Updating iplist..." : "Creating iplist...");
    const url = isEditing.value ? `ip/address/update/${editId.value}` : `/ip/address/create`;
    const method = isEditing.value ? "patch" : "post";

    const payload = {
      ...formdata.value,
      user_id: Number(userId), 
    };

    const response = await $axios({ method, url, data: payload });

    if (response.status === 200 || response.status === 201) {
      showSuccess(isEditing.value ? "IP Whitelist updated!" : "IP whitelist created!");
    await fetchIplist(userId)
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


return {
    handleSubmit,
    fetchIplist,
    formRef,
    editId,
    isEditing,
    loading,
    formdata,
    resetForm,
    iplist,
    iplistId

}

  
}