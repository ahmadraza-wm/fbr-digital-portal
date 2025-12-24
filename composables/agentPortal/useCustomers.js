import { useNuxtApp } from "#app";
import useUiFeedback from "@/composables/useUiFeedback";
import { computed, ref } from "vue";
import { useRoute, useRouter } from "vue-router";

export const useCustomer = () => {
    const countryCurrencyStore = useCountryCurrencyStore();
    const { countries, currencies, timezones, nationalities } = storeToRefs(countryCurrencyStore);
    const { $axios } = useNuxtApp();
    const route = useRoute();
    const router = useRouter();
    const cusLedger = ref()
    const customerLedger = ref([])
    const selectCustomer = ref({});
    const occupationsOptions = ref([]);

    const documents = ref([]);
    const form = ref({
        first_name: "",
        dob: "",
        gender: "",
        customer_type: "",
        email: "",
        phone_number: "",
        landline: "",
        address: "",
        street_address: "",
        city: "",
        postal_code: "",
        nationality: "",
        occupation: "",
        notes: "",
        receiving_country_id: null
    });
    const setCustomerForm = (customer) => {
    form.value.first_name = customer?.user?.name || "";
    form.value.dob = customer?.customer_detail?.dob || "";
    form.value.gender = customer?.customer_detail?.gender || "";
    form.value.customer_type = customer?.customer_type || "";
    form.value.email = customer?.user?.email || "";
    form.value.phone_number = customer?.phone_number || "";
    form.value.landline = customer?.landline || "";
    form.value.address = customer?.customer_detail?.address || "";
    form.value.street_address = customer?.customer_detail?.street_address || "";
    form.value.city = customer?.customer_detail?.city || "";
    form.value.postal_code = customer?.customer_detail?.postal_code || "";
    form.value.nationality = customer?.customer_detail?.nationality || "";
    form.value.occupation = customer?.customer_detail?.occupation || "";
    form.value.notes = customer?.customer_detail?.notes || "";
    form.value.receiving_country_id = customer?.receiving_country?.id || null;
};

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

    const CustomerType = [
        { label: 'Face To Face', value: 'face_to_face' },
        { label: 'Non Face To Face', value: 'non_face_to_face' }
    ]

    const options = ref({ itemsPerPage: 5, page: 1 });
    const walletId = computed(() => route.params.id || null);
    const isEditing = computed(() => !!walletId.value);

    const fetchOccupationsList = async (filterParams = {}, withPagination = true) => {
        showLoading("Fetching Occupations...");
        try {
            const response = await $axios.get("/web/occupations/list");
            occupationsOptions.value = response.data.data;

            showSuccess('Occupations Fetched....');

        } catch (error) {
            showError("Error fetching Occupations");
            console.error(error);
        } finally {
            hideLoading();
        }
    };

    const fetchCustomers = async (filterParams = {}, withPagination = true) => {
        showLoading("Fetching customers...");

        try {
            const response = await $axios.get("/agent/customers/list", {
                params: {
                    ...filterParams,
                    pagination: withPagination,
                },
            });

            if (!response.data.success) {
                showError(response.data.message);
                return;
            }

            showSuccess(response.data.message);

            // 🔥 MAP HERE
            const mappedData = response.data.data.customers.data.map((item, index) => ({
                sr_no: index + 1,
                id: item.id,
                name: item?.user?.name || "N/A",
                city: item?.customer_detail?.city || "N/A",

                address: `${item?.customer_detail?.street_address || ''} ${item?.customer_detail?.address || ''}, ${item?.customer_detail?.postal_code || ''}`,
                status: item?.user?.status,
                raw: item // keep full raw object (optional)
            }));

            customersList.value = mappedData;
            pagination.value = response.data.data.customers;

        } catch (error) {
            showError("Error fetching customers");
            console.error(error);
        } finally {
            hideLoading();
        }
    };



    const fetchCustomersFilters = async (filterParams = {}) => {
        showLoading("Fetching customers...");

        try {
            const response = await $axios.get("/agent/search/filters/customer", {
                params: filterParams,
            });

            if (!response.data.success) {
                showError(response.data.message);
                return;
            }

            showSuccess(response.data.message);

            const mappedData = response.data.data.data.map((item, index) => ({
                sr_no: index + 1,
                id: item.id,
                name: item?.user?.name || "N/A",
                city: item?.customer_detail?.city || "N/A",

                address: `${item?.customer_detail?.street_address || ''} ${item?.customer_detail?.address || ''}, ${item?.customer_detail?.postal_code || ''}`,
                status: item?.user?.status,
                raw: item
            }));

            customersList.value = mappedData;
            pagination.value = response.data.data;

        } catch (error) {
            showError("Error fetching customers");
            console.error(error);
        } finally {
            hideLoading();
        }
    };

    const uploadCustomerDocuments = async (customerId, payload) => {
        const formData = new FormData();
        formData.append("category", payload.category);
        formData.append("type", payload.type);
        formData.append("number", payload.document_number);
        formData.append("issue_date", payload.issuance_date);
        formData.append("expiry_date", payload.expiry_date);
        formData.append("issuer_authority", payload.issue_authority);
        formData.append("country_id", payload.country_id);
        formData.append("category", "Identification");
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
                `/agent/customer/document/upload/${customerId}`,
                formData,
                {
                    headers: {
                        "Content-Type": "multipart/form-data",
                    },
                }
            );
            if (response.data.success) {
                showSuccess("Document uploaded successfully.");
                await fetchCustomerDocuments(customerId);
                return true;

            } else {
                showError("Failed to upload documents");
                return false;
            }
        } catch (error) {
            const messages = error.response?.data?.errors
                ? Object.values(error.response.data.errors).flat()
                : error.response?.data?.message || "Something went wrong";
            showError(messages);
            return false;
        } finally {
            hideLoading();
        }
    };


    const fetchCustomerDocuments = async (customerId) => {
        showLoading('Fetching Customer Documents....')
        try {
            const response = await $axios.get(`/agent/customer/documents/${customerId}`);
            documents.value = response.data.data;
            showSuccess('Customers Documents Fetched');
            return response.data.data;
        } catch (error) {
            console.error("Failed to fetch documents:", error);
        }
    };

    const createCustomer = async (payload) => {
        showLoading('Creating Customer......');
        try {
            const response = await $axios.post(`/agent/register/customer`, payload)
            if (response.data.success) {
                showSuccess(response.data.message);
            }
            else {
                showError(response.data.message);
            }
            selectCustomer.value = response.data.data;
            console.log(selectCustomer, "Selected Customer");
        } catch (error) {
            const messages = error.response?.data?.errors
                ? Object.values(error.response.data.errors).flat()
                : [error.response?.data?.message || 'Something went wrong.']

            showError(messages.join('\n'))
            throw error
        }
    }

    const updateCustomer = async (id, payload) => {
        showLoading('Updating Customer.....')
        try {
            const response = await $axios.patch(`/agent/update/customer/${id}`, payload)
            if(response.data.success){
                showSuccess(response.data.message);
            }
            else {
                showError(response.data.message);
            }
            selectCustomer.value = response.data.data;
            console.log(selectCustomer, "Selected Customer");
            return response.data
        } catch (error) {
            const messages = error.response?.data?.errors
                ? Object.values(error.response.data.errors).flat()
                : [error.response?.data?.message || 'Something went wrong.']

            showError(messages.join('\n'))
            throw error
        }
    }


    const fetchCustomerById = async (id, force_fetch = true) => {
        showLoading("Fetching customer...");
        try {
            const response = await $axios.get(`/agent/customer/${id}`, {
                params: { force_fetch },
            });
            if (response.data.success) {
                setCustomerForm(response.data.data);
                selectCustomer.value = response.data.data;
                showSuccess(response.data.message);
            } else {
                showError(response.data.message);
            }
        } catch (error) {
            showError("Error fetching customer");
            return null;
        } finally {
            hideLoading();
        }
    };

    const documentTypes = [
        {
            title: "Passport",
            value: "Passport",
        },
        {
            title: "Bank Statement",
            value: "Bank Statement",
        },
        {
            title: "ID Card",
            value: "ID Card",
        },
        {
            title: "Resident Permit",
            value: "Resident Permit",
        },
        {
            title: "Utility Bill",
            value: "Utility Bill",
        },

        {
            title: "Council Tax Bill",
            value: "Council Tax Bill",
        },

        {
            title: "Source of funds",
            value: "Source of funds",
        },

        {
            title: "Liveness",
            value: "Liveness",
        },

        {
            title: "Credit Card Statement",
            value: "Credit Card Statement",
        },

        {
            title: "Consent",
            value: "Consent",
        },

        {
            title: "Compliance Form",
            value: "Compliance Form",
        },
    ];

    const senderdocumentTypes = [
        {
            title: "Passport",
            value: "passport",
        },
        {
            title: "Bank Details",
            value: "bank_details",
        },
        {
            title: "ID Card",
            value: "id_card",
        },
        {
            title: "Invoice/Purpose of Payment",
            value: "invoice",
        },

    ];


    const additionaldocumentTypes = [

        {
            title: "Bank Statement",
            value: "bank_statement",
        },

        {
            title: "Utitility Bill",
            value: "utility_bill",
        },

        {
            title: "Address Proof",
            value: "address_proof",
        },

        {
            title: "Tax Identification Number",
            value: "tax_identification_number",
        },

        {
            title: "Recipient ID-Card",
            value: "recipient_id_card",
        },

        {
            title: "Supporting Letters Or Contracts",
            value: "supporting_letters_contract",
        },

    ];

    const fetchCustomerLedger = async (customerId) => {
        showLoading('Fetching Customers Ledger...');
        try {
            const response = await $axios.get('/agent/customer/ledger/detail', {
                method: 'GET',
                params: {
                    customer_id: customerId
                },
            });
            if(response.data.success)
            {    
                cusLedger.value = response.data.data.success_transactions
                showSuccess(response.data.message)
            }
            else{
                  showError(response.data.message)
            }
        } catch (error) {
            const messages = error.response?.data?.errors
                ? Object.values(error.response.data.errors).flat()
                : [error.response?.data?.message || 'Error Fetching Ledger.']

            showError(messages.join('\n'))
        }
    };

    const resolveStatusVariant = (status) =>
    ({
        1: { color: "success", text: "Active" },
        0: { color: "error", text: "Inactive" },
    }[status] || { color: "info", text: "Unknown" });

    return {
        form,
        createCustomer,
        selectCustomer,
        fetchOccupationsList,
        genderOptions,
        occupationsOptions,
        CustomerType,
        senderdocumentTypes,
        additionaldocumentTypes,
        isEditing,
        customersList,
        options,
        filters,
        countries,
        currencies,
        documents,
        documentTypes,
        timezones,
        nationalities,
        cusLedger,
        customerLedger,
        pagination,
        fetchCustomerLedger,
        updateCustomer,
        fetchCustomerDocuments,
        fetchCustomerById,
        fetchCustomersFilters,
        resolveStatusVariant,
        fetchCustomers,
        uploadCustomerDocuments,
    };
};
