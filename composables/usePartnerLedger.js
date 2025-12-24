import { useNuxtApp } from "#app";
import useUiFeedback from "@/composables/useUiFeedback";
import { useRouter } from "vue-router";


export function usePartnerLedger(){

const { $axios } = useNuxtApp();
const router = useRouter();


    const {
        loading,
        showLoading,
        hideLoading,
        showSuccess,
        showError,
        confirmAction,
    } = useUiFeedback();


    const rows = ref([])
    const partnerledgers = ref([]);
    const formKey = ref(0);
    const searched = ref(false)
    

    const form = reactive({
        type: '',
        partner_id: null,
        transaction_code: '',
        currency_id: null,
        fc_amount: '',
        description: '',
        posting_date:'',
        rate: 1,
    });


    const filters = ref({

      partner_id:"",
      from_date: "",
      to_date:"",
      entry_types: "all",


    });


   const resetFilters = () => {
      filters.value.from_date = '';
      filters.value.to_date = '';
      filters.value.partner_id = '';
      filters.value.entry_types = 'all';

      rows.value = [];
      formKey.value += 1;

      searched.value = false;
      partnerledgers.value = [];
    };



      const filterPartnerLedger = async (filters = {}) => {
        showLoading("Fetching PartnerLedger...");
        try {
            const response = await $axios.get("/ledger/partner", { params: filters });

            if (response.data.success) {
                partnerledgers.value = response.data.data
            } else {
                showError("Failed to fetch partnerledgers");
            }
        } catch (error) {
            console.error(error);
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



    const savePartnerLedger = async (form) => {
      showLoading("Saving PartnerLedger...");
      try {
        const formData = new FormData();

        const entryType = form.type === "credit" ? "manual_deposit" : "manual_refund";


        formData.append("type", form.type);
        formData.append("partner_id", form.partner_id);
        formData.append("entry_type", entryType);
        if (entryType === "manual_refund") {
          formData.append("transaction_code", form.transaction_code);
        }
        formData.append("currency_id", form.currency_id);
        formData.append("fc_amount", form.fc_amount);
        formData.append("description", form.description);
        formData.append("rate", form.rate);
        formData.append("posting_date", form.posting_date);

        const response = await $axios.post("/ledger/partner/manual/entry", formData)

        if (response.status === 200 || response.status === 201) {
          showSuccess("PartnerLedger submitted successfully!");
        }
      } catch (error) {
        console.error("PartnerLedger:", error);
        const messages = error.response?.data?.errors
          ? Object.values(error.response.data.errors).flat()
          : error.response?.data?.message || "Something went wrong";
        showError(messages);
      } finally {
        hideLoading();
      }
};




       return {
        filters,
        partnerledgers,
        filterPartnerLedger,
        searched,
        rows,
        resetFilters,
        form,
        savePartnerLedger,
    };



}    