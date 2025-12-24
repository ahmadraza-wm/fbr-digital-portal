import { useNuxtApp } from "#app";
import useUiFeedback from "@/composables/useUiFeedback";

export const usePaidSummaryReport = () => {
    const {
        loading,
        showLoading,
        hideLoading,
        showSuccess,
        showError,
        // confirmAction,
    } = useUiFeedback();
    const { $axios } = useNuxtApp();
    const paidSummary = ref([]);

    const fetchPaidSummaryReport = async (filters) => {
        showLoading("Fetching paid summary report...");

        try {
            loading.value = true;
            const response = await $axios.get("/paid/summary/report", {
                params: filters,
            });
            if (response) {
                paidSummary.value = response.data.data.reports.map((item, index) => {
                    return {
                        created_at: item.created_at ?? "--",
                        transaction_code: item.transaction_code ?? "--",
                        sending_amount: item.sending_amount ?? "--",
                        sending_country: item.sending_country ?? "--",
                        receiving_amount: item.receiving_amount ?? "--",
                        receiving_country: item.receiving_country ?? "--",
                        dc_rate: item.dc_rate ?? "--",
                        sc_rate: item.sc_rate ?? "--",
                        cusomer_rate_before: item.customer_rate_before ?? "--",
                        coustomer_rate_after: item.customer_rate_after ?? "--",
                        fix_rate: item.fix_rate ?? "--",
                        sender_name: item.sender_name ?? "--",
                        sending_mthod: item.sending_method ?? "--",
                        beneficiary_name: item.beneficiary_name ?? "--",
                        receiving_method: item.receiving_method ?? "--"

            
                    };
                });
            }
   
        }
        catch (error) {
            console.log("Export error:", error);

            let messages = "Something went wrong";

            if (error.response) {
                try {
                    const data = await blobToText(error.response.data);
                    const parsed = JSON.parse(data);
                    messages = parsed.message
                        || Object.values(parsed.errors || {}).flat().join(", ")
                        || messages;
                } catch {
                    messages = error.response.statusText || messages;
                }
            } else if (error.request) {
                messages = "Network error – please check your connection or server.";
            }

            showError(messages);
        }
        finally {
            loading.value = false;
        }
    }

    return {
        fetchPaidSummaryReport,
        paidSummary
    }
}
