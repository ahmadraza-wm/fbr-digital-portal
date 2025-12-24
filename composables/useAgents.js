import { useNuxtApp } from "#app";
import useUiFeedback from "@/composables/useUiFeedback";
import { onMounted, ref } from "vue";


export function useAgents() {

    const { $axios } = useNuxtApp();
    const route = useRoute();
    const agentSchedule = ref([]);
    const {
        loading,
        showLoading,
        hideLoading,
        showSuccess,
        showError,
        confirmAction,
    } = useUiFeedback();
    const agentPermissions = ref({
        assigned_permissions: [],
        unassigned_permissions: [],
    });
    const agents = ref([]);
    const pagination = ref([]);
    const currencyPagination = ref({});

    const countryPagination = ref({});

    const countriesList = ref([]);
    const currenciesList = ref([]);

    const documents = ref([]);
    const agentsData = ref([]);

    const agentsId = computed(() => route.params.id || null);
    const isEditing = computed(() => !!agentsId.value);

    const formData = ref({
        business_name: '',
        channel: '',
        type: '',
        main_agent_id: null,
        sub_agent_id: null,
        relation_type: '',
        relation_name: '',
        name: '',
        email: '',
        gender: '',
        dob: '',
        house_office_number: '',
        address: '',
        city: '',
        postal_code: '',
        country_id: '',
        nationality: '',
        phone: '',
        status: '',
        mlr_number: '',
        new_payment_allow: '',
        hold_payment: '',
        pending_all_payments: '',
        timezone: '',
        agent_code: '',
        base_currency_id: '',
        base_currency: '',
        fsa_registration_number: '',
        charges_include_in_balance: '',
        is_partner: '',
        edit_rate_allow: 0
    });


    const fetchAgents = async (filters = {}, withPagination = true) => {

        showLoading("Fetching Agents...");
        try {
            const response = await $axios.get("/agents", {
                params: {
                    ...filters,
                    pagination: withPagination,
                },
            });
            if (response.data.success) {
                agents.value = response.data.data.data ?? response.data.data;
                if (withPagination) {
                    pagination.value = response.data.data;
                }
            } else {
                showError("Failed to fetch agents");
            }
        } catch (error) {
            console.error(error);
            showError("Something went wrong");
        } finally {
            hideLoading();
        }
    };


    const filterAgents = async (filters = {}) => {
        showLoading("Filtering agents...");
        try {
            const response = await $axios.get("agents/search/filter", {
                params: filters,
            });
            if (response.data.success) {
                agents.value = response.data.data.data;

            } else {
                showError("Failed to filter agents");
            }
        } catch (error) {
            console.error("Filter error:", error);
            showError("Something went wrong while filtering");
        } finally {
            hideLoading();
        }
    };



    const loadAgentDetails = async () => {
        if (!isEditing.value) return;
        try {
            const response = await $axios.get(`/agents/${agentsId.value}`);
            formData.value = { ...response.data.data };
        } catch (error) {
            showError("Failed to load agents details.");
        } finally {
            hideLoading();
        }
    };


    const fetchAgentById = async (id) => {
        showLoading("Fetching agent...");
        try {
            const response = await $axios.get(`/agents/${id}`);
            if (response.data.success) {
                const item = response.data.data;
                const agent = {
                    id: item.id,
                    email: item.email ?? "-",
                    name: item.name ?? "-",
                    gender: item.gender ?? "-",
                    phone: item.phone ?? "-",
                    agent_code: item.agent_code ?? "-",
                    main_agent_name: item.main_agent_name ?? "-",
                    status: item.status ?? "-",
                    type: item.type ?? "-",
                    main_agent_id: item.main_agent_id ?? "-",
                    country_id: item.country_id ?? "-",
                    city: item.city ?? "-",
                    nationality: item.nationality ?? "-",
                };
                return agent;
            } else {
                showError("Failed to fetch agent");
                return null;
            }
        } catch (error) {
            showError("Error fetching agent",);
            return null;
        } finally {
            hideLoading();
        }
    };



    const uploadAgentDocuments = async (agentId, payload, isEditMode = false, docId = null) => {
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

        const url = isEditMode
            ? `/agent/documents/${docId}`
            : `/agents/${agentId}/documents/store`;
        const method = isEditMode ? "patch" : "post";

        if (isEditMode) {
            formData.append("_method", "PATCH");
        }

        try {
            showLoading(isEditMode ? "Updating document..." : "Uploading document...");

            const response = await $axios({
                method: isEditMode ? "post" : method,
                url,
                data: formData,
            });

            if (response.status === 200 || response.status === 201 || response.data?.success) {
                showSuccess(isEditMode ? "Document updated successfully." : "Document uploaded successfully.");
                await fetchAgentDocuments(agentId);
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



    const fetchAgentDocuments = async (agentId) => {
        try {
            const response = await $axios.get(`/agents/${agentId}/documents`);
            documents.value = response.data.data;
        } catch (error) {
            console.error("Failed to fetch documents:", error);
        }
    };


    const updateDocumentStatus = async (agentId, docID) => {
        try {
            showLoading("Updating document status...");
            const response = await $axios.patch(`/agents/${agentId}/documents/${docID}/verification`);
            if (response.data.success) {
                showSuccess(response.data.message);
                await fetchAgentDocuments(agentId); // Refresh document list
            } else {
                showError("Failed to update document status.");
            }
        } catch (error) {
            showError("Error updating document status.");
            console.error(error);
        } finally {
            hideLoading();
        }
    };

    const fetchCountriesList = async (filters = {}) => {
        const response = await $axios.get(`/get/countries/list`, {
            params: filters,
        });

        countriesList.value = response.data.data.data ?? response.data.data;
        if (filters.pagination) {
            countryPagination.value = response.data.data;
        }

    };
    const fetchCurrenciesList = async (filters = {}) => {
        const response = await $axios.get(`/get/currencies/list`, {
            params: filters,
        });
        currenciesList.value = response.data.data.data ?? response.data.data;

        if (filters.pagination) {
            currencyPagination.value = response.data.data;
        }
    };

    const fetchAgentPermissions = async (userId) => {
        showLoading("Fetching permissions...");
        try {
            const response = await $axios.get(`/agent/permissions/${userId}`);
            if (response.data.success) {
                agentPermissions.value = response.data.data;
            } else {
                showError("Failed to fetch permissions");
            }
        } catch (error) {
            console.error("Error fetching agent permissions:", error);
            showError("Something went wrong while fetching permissions");
        } finally {
            hideLoading();
        }
    };

    const UpdateAgentStatus = async (userId, payload) => {
        showLoading("Updating agent...");

        try {
            const response = await $axios.patch(`/agentPortalUser/${userId}`, payload);

            if (response.data.success) {
                showSuccess("Agent Credentials Updated");
            } else {
                showError("Failed to update");
            }

        } catch (error) {
            console.error("Error updating:", error);
            showError("Something went wrong");
        } finally {
            hideLoading();
        }
    };
    
    const StoreAgentSchedule = async (userId, payload) => {
        showLoading("Creating agent schedule...");

        try {
            const response = await $axios.post(`/schedules/${userId}`, payload);

            if (response.data.success) {
                showSuccess("Agent schedule Created");
            } else {
                showError("Failed to create agent schedule");
            }

        } catch (error) {
            console.error("Error updating:", error);
            showError("Something went wrong");
        } finally {
            hideLoading();
        }
    };

    const GetAgentSchedule = async (userId) => {
        showLoading("Fetching agent schedule...");

        try {
            const response = await $axios.get(`/schedules/${userId}`);
            agentSchedule.value = response.data.data;
            showSuccess('Agent Schedule Fetched Successfully');

        } catch (error) {
            console.error("Error updating:", error);
            showError("Something went wrong");
        } finally {
            hideLoading();
        }
    };
    
    const DelAgentSchedule = async (id) => {
        showLoading("deleting agent schedule...");

        try {
            const response = await $axios.delete(`/schedules/delete/${id}`);
            showSuccess("Schedule Deleted");
        } catch (error) {
            console.error("Error Deleting:", error);
            showError("Something went wrong");
        } finally {
            hideLoading();
        }
    };
    
    const UpdateAgentSchedule = async (id,payload) => {
        showLoading("Updating agent schedule...");

        try {
            const response = await $axios.patch(`/schedules/update/${id}`,payload);
            showSuccess("Schedule Updated");
        } catch (error) {
            console.error("Error Updating:", error);
            showError("Something went wrong");
        } finally {
            hideLoading();
        }
    };

    const resolveStatusVariant = (status) =>
    ({
        1: { color: "success", text: "Active" },
        0: { color: "error", text: "Inactive" },
    }[status] || { color: "info", text: "Unknown" });



    const init = async () => {
        showLoading("Initializing...");
        try {
            if (route.path.includes("agents")) {
                await fetchAgents();
            }

            if (route.path.includes("agents") && agentsId.value) {
                await loadAgentDetails();
            }
        } catch (error) {
            console.error("Init error:", error);
            showError("Failed to initialize payers data.");
        } finally {
            hideLoading();
        }
    };

    onMounted(init);

    return {
        agents,
        agentsId,
        formData,
        pagination,
        countriesList,
        currenciesList,
        currencyPagination,
        countryPagination,
        fetchCountriesList,
        fetchCurrenciesList,
        fetchAgentPermissions,
        filterAgents,
        uploadAgentDocuments,
        updateDocumentStatus,
        fetchAgentDocuments,
        documents,
        isEditing,
        resolveStatusVariant,
        loading,
        showError,
        showLoading,
        showSuccess,
        hideLoading,
        fetchAgents,
        fetchAgentById,
        agentPermissions,
        UpdateAgentStatus,
        StoreAgentSchedule,
        GetAgentSchedule,
        agentSchedule,
        DelAgentSchedule,
        UpdateAgentSchedule
    };





}
