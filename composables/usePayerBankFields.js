import useUiFeedback from "@/composables/useUiFeedback";
import { ref } from "vue";

export default function usePayerBankFields() {
    const { $axios } = useNuxtApp();
    const {
        loading,
        showLoading,
        hideLoading,
        showSuccess,
        showError,
        confirmAction,
    } = useUiFeedback();


    // Static select options
    const inputName = ref([
        { title: "Branch Name", value: "branch_name" },
        { title: "IBAN", value: "iban" },
        { title: "Sort Code", value: "sort_code" },
        { title: "IFSC", value: "ifsc" },
        { title: "Branch/BIC/CPF/CNP/Routing code", value: "routing_code" },
        { title: "Account #", value: "account_number" },
        { title: "Bank Account Name", value: "bank_account_name" },
    ]);

    const inputType = ref([
        { title: "Text", value: "text" },
        { title: "Number", value: "number" },
    ]);

    const inputRequired = ref([
        { title: "Yes", value: true },
        { title: "No", value: false },
    ]);

    // State
    const payerBankFields = ref([]);
    const banks = ref([]);
    const isLoadingPayerBankFields = ref(false);

    // Fetch fields
    const fetchPayerBankFields = async (payerId) => {
        showLoading("Fetching bank fields...");
        try {
            const res = await $axios.get(`/payer/bank/fields/${payerId}`);
            payerBankFields.value = res.data.data || [];
        } catch (error) {
            showError("Failed to fetch bank fields.");
        } finally {
            hideLoading();
        }
    };

    // Create field
    const createPayerBankField = async (data) => {
        showLoading("Creating field...");
        try {

            await $axios.post("/payer/bank/fields", data);
            showSuccess("Field created successfully!");
            return { success: true };
        } catch (error) {
            const messages = error.response?.data?.errors
                ? Object.values(error.response.data.errors).flat()
                : error.response?.data?.message || "Something went wrong";
            showError(messages);
        } finally {
            hideLoading();
        }
    };

    // Delete field
    const deletePayerBankField = async (fieldId, callback) => {
        confirmAction("Are you sure you want to delete this field?", async () => {
            showLoading("Deleting field...");
            try {
                await $axios.delete(`/payer/bank/fields/${fieldId}`);
                showSuccess("Field deleted successfully!");
                if (callback) callback();
            } catch (error) {
                showError("Failed to delete field.");
            } finally {
                hideLoading();
            }
        });
    };

    const fetchBanksByCountry = async (filterParams = {}) => {
        showLoading("Fetching banks...");

        try {
            const response = await $axios.get("/banks?pagination=false", {
                params: filterParams,
            });

            const banksData = response.data.data.data || [];

            banks.value = banksData.map((bank) => ({
                title: bank.name,
                value: bank.id,
            }));
        } catch (error) {
            showError("Failed to fetch banks.");
            banks.value = [];
        } finally {
            hideLoading();
        }
    };

    // Headers if you need a table
    const headers = ref([
        { title: "#", key: "sr_no" },
        { title: "Input Name", key: "input_name" },
        { title: "Input Label", key: "input_label" },
        { title: "Input Type", key: "input_type" },
        { title: "Required", key: "input_required" },
        { title: "Action", key: "action" },
    ]);

    return {
        payerBankFields,
        fetchPayerBankFields,
        createPayerBankField,
        deletePayerBankField,
        fetchBanksByCountry,
        isLoadingPayerBankFields,
        headers,
        inputName,
        inputType,
        inputRequired,
        banks,
    };
}
