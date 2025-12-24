import { useNuxtApp } from "#app";
import useUiFeedback from "@/composables/useUiFeedback";
import { useRouter } from "vue-router";
import { ref, reactive, onMounted } from 'vue'


export function useAgentProfile(){

const { $axios } = useNuxtApp();
const router = useRouter();
const userDocuments = ref();
const userDetails = ref();
    const {
        loading,
        showLoading,
        hideLoading,
        showSuccess,
        showError,
        confirmAction,
    } = useUiFeedback();
    
    const fetchProfileDetail = async () => {
        showLoading("Fetching Profile Details...");
        try {
            const response = await $axios.get("/agent/details",{
                params: {
                    force_fetch:true
                }
            });

            if (response.data.status == 'success') {
                userDetails.value = response.data.data
                showSuccess('Profile Details Fetched');
            } else {
                showError("Failed to fetch Profile");
            }
        } catch (error) {
            if (error.response && error.response.data) {
               const responseData = error.response.data;
            if (responseData.errors) {
                const allErrors = Object.values(responseData.errors).flat(); 
                allErrors.forEach(err => showError(err)); 
                } else if (responseData.message) {
                    showError(responseData.message);
                } else {
                    showError("Something went wrong.");
                }
        } else {
            showError(error.message || "Network error occurred.");
        }
        } finally {
            hideLoading();
        }
    };
    const  fetchUserDocuments = async (id) => {
        showLoading("Fetching  Documents Details...");
        try {
            const response = await $axios.get(`/agent/${id}/documents`);

            if (response.data.success) {
                userDocuments.value = response.data.data
                showSuccess(response.data.message);
            } else {
                showError("Failed to fetch Documents");
            }
        } catch (error) {
            if (error.response && error.response.data) {
               const responseData = error.response.data;
            if (responseData.errors) {
                const allErrors = Object.values(responseData.errors).flat(); 
                allErrors.forEach(err => showError(err)); 
                } else if (responseData.message) {
                    showError(responseData.message);
                } else {
                    showError("Something went wrong.");
                }
        } else {
            showError(error.message || "Network error occurred.");
        }
        } finally {
            hideLoading();
        }
    };
    
    const uploadUserDocuments = async (id, payload) => {
        const formData = new FormData();

        // Append common fields
        formData.append("category", "Identification");
        formData.append("type", payload.type || "");
        formData.append("number", payload.document_number || "");
        formData.append("issue_date", payload.issuance_date || "");
        formData.append("expiry_date", payload.expiry_date || "");
        formData.append("issuer_authority", payload.issue_authority || "");
        formData.append("country_id", payload.country_id || "");

        // Append files (optional in both modes)
        let index = 0;
        if (payload.front_files?.length) {
            payload.front_files.forEach((file) => {
                formData.append(`files[${index}]`, file);
                index++;
            });
        }
        if (payload.back_files?.length) {
            payload.back_files.forEach((file) => {
                formData.append(`files[${index}]`, file);
                index++;
            });
        }

        try {
            showLoading("Uploading document...");

            const response = await $axios.post(`/agent/${id}/documents/store`,
              formData, {
                    headers: {
                        "Content-Type": "multipart/form-data",
                    },
                }
            );
            
            if (response.status === 200 || response.status === 201 || response.data?.success) {
                showSuccess("Document uploaded successfully.");
                await fetchUserDocuments(id);
            } else {
                const messages = response.data?.errors
                    ? Object.values(response.data.errors).flat()
                    : response.data?.message || "An error occurred.";
                showError(messages);
            }
        } catch (error) {
            const messages = error.response?.data?.errors
                ? Object.values(error.response.data.errors).flat()
                : error.response?.data?.message || "An error occurred.";
            showError(messages);
        } finally {
            hideLoading();
        }
    };


return {
userDetails,
fetchProfileDetail,
userDocuments,
fetchUserDocuments,
uploadUserDocuments
};
}
