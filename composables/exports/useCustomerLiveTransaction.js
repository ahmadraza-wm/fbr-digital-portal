import { useNuxtApp } from "#app";
import useUiFeedback from "@/composables/useUiFeedback";

export const useCustomerLiveTransaction = () => {
    
    const {
        showLoading,
        hideLoading,
        showSuccess,
        showError,

    } = useUiFeedback();
    const { $axios } = useNuxtApp();

    const exportCustomerLiveTransaction = async (filters) => {
        console.log('live filters', filters)
        try {
            showLoading('Exporting customer transaction live...');
            const response = await $axios.post(`/customer/live/transaction/export`, filters, {
                responseType: "text",
                headers: {
                    Accept: "text/csv",
                },
            });
            if (typeof response.data === "string") {
                const blob = new Blob([response.data], { type: "text/csv;charset=utf-8;" });

                const fileName = "customer_transaction_live.csv";
                const url = window.URL.createObjectURL(blob);
                const link = document.createElement("a");
                link.href = url;
                link.setAttribute("download", fileName);
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);

                showSuccess("customer transaction live Export Successfully.");
            } else {
                console.error("Unexpected data format:", response.data);
                showError("Customer transaction live export failed: Unexpected response format.");
            }
        }
        catch (error) {
            console.error("Export error:", error);
            let messages = "Something went wrong";

            if (error.response?.data) {
                let data = error.response.data;

                // if backend sent a string, parse it
                if (typeof data === "string") {
                    try {
                        data = JSON.parse(data);
                    } catch (e) {
                        console.warn("Could not parse error response:", data);
                    }
                }

                if (data.errors) {
                    messages = Object.values(data.errors).flat();
                } else if (data.message) {
                    messages = data.message;
                }
            } else if (error.message) {
                messages = error.message;
            }

            showError(messages);
        }

        finally {
            hideLoading();
        }
    }

    return {
        exportCustomerLiveTransaction
   }
}
