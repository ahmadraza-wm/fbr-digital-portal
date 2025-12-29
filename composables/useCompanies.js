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

  return {
    CompaniesList,
    fetchCompanies,
    statuses,
    saveCompany,
    fetchCompanyById,
    CompanyDetail
  };
};
