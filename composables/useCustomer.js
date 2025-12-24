import { useNuxtApp } from "#app";
import useUiFeedback from "@/composables/useUiFeedback";
import { computed, onMounted, ref } from "vue";
import { useRoute, useRouter } from "vue-router";

export const useCustomer = () => {
    const countryCurrencyStore = useCountryCurrencyStore();
    const { countries, currencies, timezones, nationalities } = storeToRefs(countryCurrencyStore);
    const { $axios } = useNuxtApp();
    const route = useRoute();
    const router = useRouter();
    const agents = ref([]);
    const cusLedger = ref(false)
    const customerLedger = ref([])


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



    const fetchCustomers = async (filterParams = {}, withPagination = true) => {
        showLoading("Fetching customers...");

        try {
            const response = await $axios.get("/customers/list", {
                params: {
                    ...filterParams,
                    pagination: withPagination,
                },
            });

            if (response.data.success) {
                let rawCustomers;
                if (response.data.data.customers.data) {
                    rawCustomers = response.data.data.customers.data;
                    pagination.value = response.data.data.customers;
                } else {
                    rawCustomers = response.data.data.customers;
                }

                customersList.value = rawCustomers.map((item, index) => ({
                    id: item.id,
                    fullName: item.user?.name ?? "-",
                    email: item.user?.email ?? "-",
                    phone: item.phone_number ?? "-",
                    address: item.customer_detail?.address ?? "-",
                    receiving_country: item.receiving_country?.name ?? "-",
                    channel: item.channel ?? "N/A",
                    main_agent: item.main_agent ?? "-",
                    created_at: item.user?.created_at ?? "-",
                    verified: item.verified,
                    status: item.user?.status,
                }));
            } else {
                showError("Failed to fetch customers");
            }
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
            const response = await $axios.get("/search/filters/customer", {
                params: filterParams,
            });

            if (response.data.success) {
                customersList.value = response.data.data.data;
                customersList.value = response.data.data.data.map((item, index) => ({
                    id: item.id,
                    fullName: item.user?.name ?? "-",
                    email: item.user?.email ?? "-",
                    phone: item.phone_number ?? "-",
                    address: item.customer_detail?.address ?? "-",
                    receiving_country: item.receiving_country?.name ?? "-",
                    channel: item.channel ?? "N/A",
                    main_agent: item.main_agent ?? "-",
                    created_at: item.user?.created_at ?? "-",
                    status: item.user?.status,
                    created_at: item.created_at,
                }));
            } else {
                showError("Failed to fetch customers");
            }
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
                `/customer/document/upload/${customerId}`,
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


    const SubmitCustomerDocuments = async (
        customerId,
        payload,
        isEditMode = false,
        documentId = null
    ) => {
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

        // Handle method + URL
        const url = isEditMode
            ? `/customer/document/update/${documentId}`
            : `/customer/document/upload/${customerId}`;

        const method = isEditMode ? "post" : "post"; // always post, but use _method for patch

        if (isEditMode) {
            formData.append("_method", "PATCH");
        }

        try {
            showLoading(isEditMode ? "Updating document..." : "Uploading document...");

            const response = await $axios({
                method,
                url,
                data: formData,
                headers: { "Content-Type": "multipart/form-data" },
            });

            if (response.status === 200 || response.status === 201 || response.data?.success) {
                showSuccess(isEditMode ? "Document updated successfully." : "Document uploaded successfully.");
                await fetchCustomerDocuments(customerId);
                return true;
            } else {
                const messages = response.data?.errors
                    ? Object.values(response.data.errors).flat()
                    : response.data?.message || "An error occurred.";
                showError(messages);
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
        try {
            const response = await $axios.get(`/customer/documents/${customerId}`);
            documents.value = response.data.data;
            return response.data.data;
        } catch (error) {
            console.error("Failed to fetch documents:", error);
        }
    };

    const updateCustomer = async (id, payload) => {
        try {
            const response = await $axios.patch(`/customer/update/${id}`, payload)
            showSuccess('Customer updated successfully.')
            return response.data
        } catch (error) {
            const messages = error.response?.data?.errors
                ? Object.values(error.response.data.errors).flat()
                : [error.response?.data?.message || 'Something went wrong.']

            showError(messages.join('\n'))
            throw error
        }
    }


    const updateDocumentStatus = async (docID, currentStatus) => {
        try {
            showLoading("Updating document status...");

            const response = await $axios.patch(`/customer/document/verify/${docID}`, {
                is_verified: currentStatus === 'Yes' ? false : true // convert string to boolean
            });

            if (response.data.success) {
                showSuccess(response.data.message);
                await fetchCustomerDocuments(route.params.id); // refresh after update
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


    const fetchCustomerById = async (id , force_fetch = false) => {
        showLoading("Fetching customer...");
        try {
            const response = await $axios.get(`/customer/${id}`,{
                 params: { force_fetch },
            });
            if (response.data.success) {
                const item = response.data.data;
                const customer = {
                    id: item.id,
                    first_name: item.user?.first_name ?? "-",
                    last_name: item.user?.last_name ?? "-",
                    user_id: item.user?.id ?? "-",
                    password: item.user?.password ?? "-",
                    email: item.user?.email ?? "-",
                    type: item.type ?? "-",
                    phone: item.phone_number ?? "-",
                    timezone: item.timezone ?? "-",
                    dob: item.customer_detail?.dob ?? "-",
                    is_introducer: item.customer_detail?.is_introducer ?? "-",
                    notes: item.customer_detail?.notes ?? "-",
                    is_high_alert: item.customer_detail?.is_high_alert ?? "-",
                    place_of_birth: item.customer_detail?.place_of_birth ?? "-",
                    street_address: item.customer_detail?.street_address ?? "-",
                    address: item.customer_detail?.address ?? "-",
                    gender: item.customer_detail?.gender ?? "-",
                    postal_code: item.customer_detail?.postal_code ?? "-",
                    state: item.customer_detail?.state ?? "-",
                    city: item.customer_detail?.city ?? "-",
                    occupation: item.customer_detail?.occupation ?? "-",
                    nationality: item.customer_detail?.nationality ?? "-",
                    receiving_country: item.receiving_country?.name ?? "-",
                    sending_country: item.sending_country?.name ?? "-",
                    channel: item.channel ?? "N/A",
                    main_agent: item.agent_id ?? "-",
                    sub_agent: item.sub_agent ?? "-",
                    created_at: item.user?.created_at ?? "-",
                    status: item.user?.status,
                    ip_address: item.ip_address ?? "-",
                    device_details: item.device_details ?? "-",
                    blocked: item.blocked ?? "-",
                    verified: item.verified ?? "-",
                    e_kyc_status: item.e_kyc_status ?? "-",
                    e_kyc_till_date: item.e_kyc_till_date ?? "-",
                    customer_ledger: item.customer_ledger_card ?? [],
                    benificiary_ledger: item.beneficiary_ledger ?? [],
                    kyc_notes: item.kyc_notes ?? []

                };
                return customer;
            } else {
                showError("Failed to fetch customer");
                return null;
            }
        } catch (error) {
            showError("Error fetching customer");
            return null;
        } finally {
            hideLoading();
        }
    };

    const init = async () => {
        showLoading("Initializing...");
        try {
            await Promise.all([fetchCustomers(), fetchAgents()]);
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
            key: "fullName",
        },
        {
            title: "Email/Phone",
            key: "email",
        },
        {
            title: "Address",
            key: "address",
        },
        {
            title: "Receiving COUNTRY",
            key: "receiving_country",
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
            title: "Created at",
            key: "created_at",
        },
        {
            title: "ACTION",
            key: "action",
        },
    ];

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


    const occupationsOptions = [
        { value: "WHOLESALE AND RETAIL", name: "WHOLESALE AND RETAIL" },
        { value: "Veterinarian", name: "Veterinarian" },
        { value: "UNEMPLOYED", name: "UNEMPLOYED" },
        { value: "TRANSPORT AND STORAGE DRIVERS AND COURIERS", name: "TRANSPORT AND STORAGE DRIVERS AND COURIERS" },
        { value: "Textile", name: "Textile" },
        { value: "Telecoms", name: "Telecoms" },
        { value: "Takeaway", name: "Takeaway" },
        { value: "Sports", name: "Sports" },
        { value: "Social work and medicine", name: "Social work and medicine" },
        { value: "SOCIAL COMMUNITY AND CARE WORKERS", name: "SOCIAL COMMUNITY AND CARE WORKERS" },
        { value: "Show Business", name: "Show Business" },
        { value: "Shop Keeper", name: "Shop Keeper" },
        { value: "Ship Crew", name: "Ship Crew" },
        { value: "Self employed", name: "Self employed" },
        { value: "Science Sector", name: "Science Sector" },
        { value: "Sales Personnel", name: "Sales Personnel" },
        { value: "RETIRED", name: "RETIRED" },
        { value: "Restaurant", name: "Restaurant" },
        { value: "Recycle", name: "Recycle" },
        { value: "RADIO TELEVISION MAGAZINES AND NEWSPAPERS", name: "RADIO TELEVISION MAGAZINES AND NEWSPAPERS" },
        { value: "POLITICS DIPLOMATS AND GOVERNMENT", name: "POLITICS DIPLOMATS AND GOVERNMENT" },
        { value: "Police", name: "Police" },
        { value: "Pharmacy", name: "Pharmacy" },
        { value: "PERSONAL SERVICES", name: "PERSONAL SERVICES" },
        { value: "PERFORMING ARTS AND ENTERTAINMENT", name: "PERFORMING ARTS AND ENTERTAINMENT" },
        { value: "Others", name: "Others" },
        { value: "NGO", name: "NGO" },
        { value: "MINING AND QUARRYING", name: "MINING AND QUARRYING" },
        { value: "MEDICAL AND HEALTHCARE", name: "MEDICAL AND HEALTHCARE" },
        { value: "Marketing", name: "Marketing" },
        { value: "MANUFACTURING", name: "MANUFACTURING" },
        { value: "Lawyer", name: "Lawyer" },
        { value: "Journalist", name: "Journalist" },
        { value: "IT", name: "IT" },
        { value: "Investment and Development", name: "Investment and Development" },
        { value: "internet and E-Business", name: "internet and E-Business" },
        { value: "Insurance", name: "Insurance" },
        { value: "HOUSEKEEPER NANNY OR CHILD CARE", name: "HOUSEKEEPER NANNY OR CHILD CARE" },
        { value: "Hotels Tourism", name: "Hotels Tourism" },
        { value: "Gold and Jewellery", name: "Gold and Jewellery" },
        { value: "FORESTRY GARDENING PARKS AND LANDSCAPES", name: "FORESTRY GARDENING PARKS AND LANDSCAPES" },
        { value: "Food Preparation and Serving related Workers", name: "Food Preparation and Serving related Workers" },
        { value: "Financial Sector", name: "Financial Sector" },
        { value: "Factory Worker", name: "Factory Worker" },
        { value: "Executive Management", name: "Executive Management" },
        { value: "Environmental Sector", name: "Environmental Sector" },
        { value: "Engineer", name: "Engineer" },
        { value: "ENERGY FUEL WATER SUPPLY SANITATION AND CLEANSING", name: "ENERGY FUEL WATER SUPPLY SANITATION AND CLEANSING" },
        { value: "Electronics", name: "Electronics" },
        { value: "Education", name: "Education" },
        { value: "Economics", name: "Economics" },
        { value: "Design and Cartography", name: "Design and Cartography" },
        { value: "Customer Service Call Center", name: "Customer Service Call Center" },
        { value: "Construction", name: "Construction" },
        { value: "COMMUNICATIONS AND INFORMATION TECHNOLOGY", name: "COMMUNICATIONS AND INFORMATION TECHNOLOGY" },
        { value: "CASHIER", name: "CASHIER" },
        { value: "BUILDING CONSTRUCTION AND ROADS", name: "BUILDING CONSTRUCTION AND ROADS" },
        { value: "BANKING INSURANCE LEGAL FINANCIAL SERVICES", name: "BANKING INSURANCE LEGAL FINANCIAL SERVICES" },
        { value: "Automotive", name: "Automotive" },
        { value: "ARMED FORCES EMERGENCY AD SECURITY SERVICES", name: "ARMED FORCES EMERGENCY AD SECURITY SERVICES" },
        { value: "Architecture", name: "Architecture" },
        { value: "Airlines (Crew)", name: "Airlines (Crew)" },
        { value: "AGRICULTURE FARMING HUNTING AND FISHING", name: "AGRICULTURE FARMING HUNTING AND FISHING" },
        { value: "ADVERTISING AND MARKETING", name: "ADVERTISING AND MARKETING" },
        { value: "ACCOUNTANT", name: "ACCOUNTANT" }
    ];

    const fetchCustomerLedger = async (customerId, days) => {
        try {
            const response = await $axios.get('/customer/ledger/detail', {
                method: 'GET',
                params: {
                    customer_id: customerId,
                    days: days,
                },
            });
            customerLedger.value = response.data.data.success_transactions.map((trx, index) =>
                transformLedgerData(trx, index + 1)
            );
            cusLedger.value = true;
        } catch (error) {
            console.error('Error fetching customer ledger:', error);
        }
    };

    const transformLedgerData = (data, sr = 1) => {
        const createdDate = data.date;

        return {
            sr,
            id: data.id,
            customer_id: data.customer?.id,
            date: createdDate,
            phone: data.customer?.phone_number,
            time: data.time,
            code: data.transaction_code,
            channel: data.channel,
            status: data.status_value,
            senderCode: data.customer?.referral_code || 'N/A',
            verify: data.customer?.verified || 'unverified',
            senderName: data.customer?.user?.name || 'N/A',
            sending_country: data.gateway_country?.sending_country ?? "-",
            sender_sanction: data.sender_sanction ?? "-",
            channel: data.channel ?? "-",
            beneficiary_sanction: data.beneficiary_sanction ?? "-",
            receiving_country: data.payer?.country ?? "-",
            SenderBank: data.sending_method,
            paymentMethod: data.sending_method,
            ReceiverName: data.beneficiary?.name || 'N/A',
            receivingMethod: data.receiving_method,
            sendAmount: data.sending_amount,
            rate: data.customer_rate,
            totalAmount: data.receiving_amount,
            partner: data.partner?.name || 'N/A',
            beneficiary_first_name: data.beneficiary_first_name ?? "-",
            beneficiary_last_name: data.beneficiary_last_name ?? "-",
            beneficiary_phone: data.beneficiary_phone ?? "-",
            beneficiary_relation: data.beneficiary_relation ?? "-",
        };
    };



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
        senderdocumentTypes,
        additionaldocumentTypes,
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
        cusLedger,
        customerLedger,
        pagination,
        fetchCustomerLedger,
        updateCustomer,
        SubmitCustomerDocuments,
        updateDocumentStatus,
        fetchCustomerDocuments,
        fetchCustomerById,
        fetchCustomersFilters,
        resolveStatusVariant,
        fetchCustomers,
        uploadCustomerDocuments,
    };
};
