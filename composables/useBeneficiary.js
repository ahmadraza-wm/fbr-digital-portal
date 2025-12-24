import { useNuxtApp } from "#app";
import useUiFeedback from "@/composables/useUiFeedback";
import { computed, onMounted, ref } from "vue";
import { useRoute, useRouter } from "vue-router";

export const useBeneficiary = () => {
  const countryCurrencyStore = useCountryCurrencyStore();
  const { countries, currencies, timezones, nationalities } =
    storeToRefs(countryCurrencyStore);
  const { $axios } = useNuxtApp();
  const route = useRoute();
  const router = useRouter();
  const agents = ref([]);

  const bankList = ref([]);

  const documents = ref([]);

  const {
    loading,
    showLoading,
    hideLoading,
    showSuccess,
    showError,
    confirmAction,
  } = useUiFeedback();

  const customersList = ref([]);
  const pagination = ref({});


  const filters = ref({
    country_id: "",
    name: "",
  });

  const genderOptions = [
    { value: "male", text: "Male" },
    { value: "female", text: "Female" },
  ];

  const typesOptions = [
    { value: "online", text: "Online" },
    { value: "agent", text: "Agent" },
  ];

  const occupationsOptions = [
    { value: "Software Engineer", text: "Software Engineer" },
    { value: "Doctor", text: "Doctor" },
  ];

  const statusOptions = [
    { value: 1, text: "Active" },
    { value: 0, text: "InActive" },
  ];

  const verifyOptions = [
    { value: 1, text: "Yes" },
    { value: 0, text: "No" },
  ];

  const introducerOptions = [
    { value: 1, text: "Yes" },
    { value: 0, text: "No" },
  ];

  const alertOptions = [
    { value: 1, text: "Yes" },
    { value: 0, text: "No" },
  ];

  const fetchAgents = async () => {
    try {
      const res = await $axios.get("/agents?force_fetch=true");
      agents.value = res.data.data;
    } catch (e) {
      console.error("Failed to fetch agents", e);
      showError("Failed to fetch agents.");
    }
  };

  const options = ref({ itemsPerPage: 5, page: 1 });
  const walletId = computed(() => route.params.id || null);
  const isEditing = computed(() => !!walletId.value);

  const fetchBanks = async (filterParams = {}) => {
    showLoading("Fetching banks...");

    try {
      const response = await $axios.get("/banks?pagination=false", {
        params: filterParams,
      });

      if (response.data.success) {
        bankList.value = response.data.data.data;
      } else {
        showError("Failed to fetch banks");
      }
    } catch (error) {
      showError("Error fetching banks");
      console.error(error);
    } finally {
      hideLoading();
    }
  };

  const fetchCustomers = async (filterParams = {}, withPagination = true) => {
    showLoading("Fetching Beneficiary...");

    try {
      const response = await $axios.get("/beneficiaries/list", {
        params: {
          ...filterParams,
          pagination: withPagination,
        },
      });

      if (response.data.success) {
        customersList.value = response.data.data.beneficiaries.data;
        customersList.value = response.data.data.beneficiaries.data.map((item, index) => ({
          name: item.name,
          id: item.id,
          phone_number: item.phone_number,
          address: item.address,
          channel: item.channel,
          status: item.customer?.user?.status ?? "Inactive",
          main_agent: item.customer.main_agent,
        }));
        if (withPagination) {
          pagination.value = response.data.data.beneficiaries;
        }
      } else {
        showError("Failed to fetch Beneficiary");
      }
    } catch (error) {
      showError("Error fetching Beneficiary");
      console.error(error);
    } finally {
      hideLoading();
    }
  };

  const fetchCustomersFilters = async (filterParams = {}) => {
    showLoading("Fetching Beneficiary...");

    try {
      const response = await $axios.get("/beneficiaries/search/filters", {
        params: filterParams,
      });

      if (response.data.success) {
        customersList.value = response.data.data;
        customersList.value = response.data.data.map((item, index) => ({
          id: item.id,
          name: item.name,
          phone_number: item.phone_number,
          address: item.address,
          channel: item.channel,
          main_agent: item.customer.main_agent,
        }));
      } else {
        showError("Failed to fetch Beneficiary");
      }
    } catch (error) {
      showError("Error fetching Beneficiary");
      console.error(error);
    } finally {
      hideLoading();
    }
  };

  async function createBeneficiaryBank(beneficiaryId, payload) {
    showLoading("Adding Bank...");
    try {
      const response = await $axios.post(
        `/beneficiary/bank/create/${beneficiaryId}`,
        payload
      );
      showSuccess("Bank  added successfully.");
      return response.data;
    } catch (error) {
      showError("Error Adding  Bank", error);
      throw error;
    }
  }

  const uploadCustomerDocuments = async (customerId, payload) => {
    const formData = new FormData();
    formData.append("category", "Identification");
    formData.append("type", payload.type);
    formData.append("number", payload.document_number);
    formData.append("issue_date", payload.issuance_date);
    formData.append("expiry_date", payload.expiry_date);
    formData.append("issuer_authority", payload.issue_authority);
    formData.append("country_id", payload.country_id);

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
      const response = await $axios.post(
        `/beneficiary/document/upload/${customerId}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      if (response.data.success) {
        showSuccess("Document uploaded successfully.");
      } else {
        showError("Failed to upload documents");
      }
    } catch (error) {
      showError("Error uploading documents");
      console.error(error);
    } finally {
      hideLoading();
    }
  };


  const fetchCustomerDocuments = async (customerId, force_fetch = false) => {
    try {


      const response = await $axios.get(`/view/beneficiary/documents/${customerId}`,{
        params: {force_fetch}
      });
      documents.value = response.data.data;
      return response.data.data;

    } catch (error) {
      console.error("Failed to fetch documents:", error);
    }
  };

  const updateCustomer = async (id, payload) => {
    try {
      const response = await $axios.patch(`/customer/update/${id}`, payload);
      showSuccess("Beneficiary updated successfully.");
      return response.data;
    } catch (error) {
      const messages = error.response?.data?.errors
        ? Object.values(error.response.data.errors).flat()
        : [error.response?.data?.message || "Something went wrong."];

      showError(messages.join("\n"));
      throw error;
    }
  };

  const fetchCustomerById = async (id , force_fetch = false) => {
    showLoading("Fetching Beneficiary...");
    try {
      const response = await $axios.get(`/beneficiary/${id}`, {
        params: {force_fetch}
      });
      if (response.data.success) {
        const item = response.data.data.beneficiary;
        const banks = response.data.data.banks || [];
        const documents = response.data.data.documents || [];

        const customer = {
          id: item.id,
          name: item.name,
          phone_number: item.phone_number,
          city: item.city,
          house_no: item.house_no,
          postal_code: item.postal_code,
          street: item.street,
          address: item.address,
          channel: item.channel,
          gender: item.gender,
          dob: item.dob,
          country: item.country,
          nationality: item.country,
          address: item.address,
          relation: item.relation,
          customer_name: item.customer?.user?.name || "N/A",
          customer_email: item.customer?.user?.email || "N/A",
          status: item.customer?.user?.status ?? "Inactive",
          state: item.customer?.customer_detail?.state || "N/A",
          banks: banks,
          documents: documents,
        };
        return customer;
      } else {
        showError("Failed to fetch Beneficiary");
        return null;
      }
    } catch (error) {
      console.error("Error fetching Beneficiary:", error);
      showError("Error fetching Beneficiary");
      return null;
    } finally {
      hideLoading();
    }
  };

  const init = async () => {
    showLoading("Initializing...");
    try {
      await Promise.all([fetchCustomers(), fetchAgents(), fetchBanks()]);
    } catch (error) {
      showError("Failed to initialize customers data.");
    } finally {
      hideLoading();
    }
  };

  onMounted(init);

  const headers = [
    {
      title: "#",
      key: "sr_no",
    },
    {
      title: "Name",
      key: "name",
    },
    {
      title: "Email/Phone",
      key: "contact",
    },
    {
      title: "Address",
      key: "address",
    },
    {
      title: "Channel",
      key: "channel",
    },
    {
      title: "Main/Sub Agent",
      key: "main_agent",
    },
    {
      title: "ACTION",
      key: "action",
    },
  ];

  const documentTypes = [
    {
      title: "Passport",
      value: "passport",
    },
    {
      title: "Bank Statement",
      value: "bank_statement",
    },
    {
      title: "ID Card",
      value: "id_card",
    },
    {
      title: "Residient Remit",
      value: "resident_remit",
    },
    {
      title: "Utitility Bill",
      value: "utility_bill",
    },
  ];

  const resolveStatusVariant = (status) =>
  ({
    1: { color: "success", text: "Active" },
    0: { color: "error", text: "Inactive" },
  }[status] || { color: "info", text: "Unknown" });

  return {
    genderOptions,
    typesOptions,
    statusOptions,
    occupationsOptions,
    verifyOptions,
    introducerOptions,
    alertOptions,
    headers,
    isEditing,
    customersList,
    options,
    filters,
    countries,
    currencies,
    documents,
    documentTypes,
    agents,
    timezones,
    nationalities,
    bankList,
    pagination,
    createBeneficiaryBank,
    updateCustomer,
    fetchCustomerDocuments,
    fetchCustomerById,
    fetchCustomersFilters,
    resolveStatusVariant,
    fetchCustomers,
    uploadCustomerDocuments,
  };
};
