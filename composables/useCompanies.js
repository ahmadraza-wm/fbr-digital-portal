import { useNuxtApp } from "#app";
import useUiFeedback from "@/composables/useUiFeedback";
import { computed, onMounted, ref } from "vue";
import { useRoute, useRouter } from "vue-router";

export const useCompanies = () => {
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

  const CompaniesList = ref([]);
  const CompanyDetail = ref();
  const user_permissions = ref();
  const apiSecrets = ref();
  const statuses = [
    { value: true, text: "Active" },
    { value: false, text: "Inactive" },
  ];

  const resolveStatusVariant = (status) =>
  ({
    1: { color: "success", text: "Active" },
    0: { color: "error", text: "Inactive" },
  }[status] || { color: "info", text: "Unknown" });

  const fetchCompanies = async (filters = {}, withPagination = true) => {
    showLoading("Fetching Companies...");
    try {
      const response = await $axios.get("/companies");
      CompaniesList.value = response.data.data;
      showSuccess('Companies Fetched');
    } catch (error) {
      showError("Something went wrong while Fetching Companies.");
      console.error(error);
    } finally {
      hideLoading();
    }
  };

  const fetchCompanyById = async (id) => {
    showLoading("Fetching Company Details...");
    try {
      const response = await $axios.get(`/companies/${id}`);
      CompanyDetail.value = response.data.data;
      showSuccess('Companies Details Fetched');
    } catch (error) {
      showError("Something went wrong while Fetching Company Details.");
      console.error(error);
    } finally {
      hideLoading();
    }
  };

  const saveCompany = async (isEdit, formData, companyId = null) => {
    showSuccess(
      isEdit
        ? "Updating company...."
        : "Creating Company...."
    );
    try {
      const { $axios } = useNuxtApp();
      const url = isEdit ? `/companies/${companyId}` : "/companies";
      const method = isEdit ? "put" : "post";
      const payload = { ...formData };

      if (!isEdit) {
        delete payload.status;
      }

      const response = await $axios({ method, url, data: payload });

      if (response.status === 200 || response.status === 201) {
        showSuccess(
          isEdit
            ? "Company updated successfully!"
            : "Company created successfully!"
        );
        setTimeout(() => router.push("/companies"), 1500);
      }
    } catch (error) {
      console.error("Error saving company:", error);

      const messages = error.response?.data?.errors
        ? Object.values(error.response.data.errors).flat()
        : error.response?.data?.message || "Something went wrong";

      showError(messages);
    } finally {
      hideLoading();
    }
  };

  const fetchPermissionsById = async (id) => {
    showLoading("Fetching Permissions...");
    try {
      const response = await $axios.get(`/users/${id}/permissions`);
      user_permissions.value = response.data;
      showSuccess('Companies Permissions Fetched');
    } catch (error) {
      showError("Something went wrong while Fetching Permissions.");
      console.error(error);
    } finally {
      hideLoading();
    }
  };

  const assignPermissionsByUserId = async (id, permissions) => {
    showLoading("Assigning Permissions...");
    try {
      const response = await $axios.post(`/users/${id}/permissions`, {
        permission_id: permissions,
      })
      showSuccess(response.data.message);
    } catch (error) {
      console.error("Error Assigning Permissions:", error);

      const messages = error.response?.data?.errors
        ? Object.values(error.response.data.errors).flat()
        : error.response?.data?.message || "Something went wrong";

      showError(messages);
    } finally {
      hideLoading();
    }
  };

  const unassignPermissionsByUserId = async (id, permissions) => {
    showLoading("Unassigning permissions...");

    try {
      const response = await $axios.delete(`/users/${id}/permissions`, {
        data: {
          permission_ids: permissions,
        },
      });

      showSuccess(response.data.message);
    } catch (error) {
      console.error("Error unassigning permissions:", error);

      const messages = error.response?.data?.errors
        ? Object.values(error.response.data.errors).flat()
        : error.response?.data?.message || "Something went wrong";

      showError(messages);
    } finally {
      hideLoading();
    }
  };

  const addLoginIpByUserId = async (id, payload) => {
    showLoading("Adding Login Ip...");
    try {
      const response = await $axios.post(`/companies/${id}/ips`, payload)
      showSuccess('Login Ip Added Successfully');
    } catch (error) {
      console.error("Error Adding Login Ip:", error);

      const messages = error.response?.data?.errors
        ? Object.values(error.response.data.errors).flat()
        : error.response?.data?.message || "Something went wrong";

      showError(messages);
      return false;
    } finally {
      hideLoading();
    }
  };

  const updateLoginIpByUserId = async (id, ipId, payload) => {
    showLoading("Updating Login Ip...");
    try {
      const response = await $axios.put(`/companies/${id}/ips/${ipId}`, payload)
      showSuccess('Login Ip Updated Successfully');
    } catch (error) {
      console.error("Error Updating Login Ip:", error);

      const messages = error.response?.data?.errors
        ? Object.values(error.response.data.errors).flat()
        : error.response?.data?.message || "Something went wrong";

      showError(messages);
      return false;
    } finally {
      hideLoading();
    }
  };

  const deleteLoginIpByUserId = async (id, ipId, payload) => {
    showLoading("Deleting Login Ip...");
    try {
      const response = await $axios.delete(`/companies/${id}/ips/${ipId}`)
      showSuccess('Login Ip Deleted Successfully');
    } catch (error) {
      console.error("Error Deleting Login Ip:", error);

      const messages = error.response?.data?.errors
        ? Object.values(error.response.data.errors).flat()
        : error.response?.data?.message || "Something went wrong";

      showError(messages);
      return false;
    } finally {
      hideLoading();
    }
  };

  const fetchApiKeySecrets = async (id) => {
    showLoading("Fetching Api Secrets...");
    try {
      const response = await $axios.get(`/companies/${id}/secrets`)
      apiSecrets.value = response.data.data;
      showSuccess('Api Secrets Fetched Successfully');
    } catch (error) {
      console.error("Error Fetching Api Secrets:", error);

      const messages = error.response?.data?.errors
        ? Object.values(error.response.data.errors).flat()
        : error.response?.data?.message || "Something went wrong";

      showError(messages);
    } finally {
      hideLoading();
    }
  };

  const updateWebhookUrl = async (id, payload) => {
    showLoading("Updating Webhook Url...");
    try {
      const response = await $axios.put(`/companies/${id}/webhook`, {
        webhook_url: payload,
      })
      if (response.data.success) {
        showSuccess(response.data.message);
        await fetchApiKeySecrets(id);
      }
      else {
        showError(response.data.message);
      }
    } catch (error) {
      console.error("Error Updating Webhook Url:", error);

      const messages = error.response?.data?.webhook_url
        ? Object.values(error.response.data.webhook_url).flat()
        : error.response?.data?.webhook_url || "Something went wrong";

      showError(messages);
      return false;
    } finally {
      hideLoading();
    }
  };
  
  const resetSecretKeys = async (id) => {
    showLoading("Updating Api Keys...");
    try {
      const response = await $axios.post(`/companies/${id}/rotate-secrets`)
      if (response.data.success) {
        showSuccess(response.data.message);
        await fetchApiKeySecrets(id);
      }
      else {
        showError(response.data.message);
      }
    } catch (error) {
      console.error("Error Updating Api Url:", error);

      const messages = error.response?.data?.errors
        ? Object.values(error.response.data.errors).flat()
        : error.response?.data?.message || "Something went wrong";

      showError(messages);
      return false;
    } finally {
      hideLoading();
    }
  };

  return {
    CompaniesList,
    fetchCompanies,
    statuses,
    saveCompany,
    fetchCompanyById,
    CompanyDetail,
    fetchPermissionsById,
    user_permissions,
    assignPermissionsByUserId,
    unassignPermissionsByUserId,
    addLoginIpByUserId,
    updateLoginIpByUserId,
    deleteLoginIpByUserId,
    fetchApiKeySecrets,
    apiSecrets,
    updateWebhookUrl,
    resetSecretKeys
  };
};
