import { useNuxtApp } from "#app";
import useUiFeedback from "@/composables/useUiFeedback";

export const useNewCustomerExport = () => {
    
    const {
        showLoading,
        hideLoading,
        showSuccess,
        showError,

    } = useUiFeedback();
    const { $axios } = useNuxtApp();

    const exportNewCustomer = async (filters) => {
        try {
            showLoading('Exporting New Customer Report...');
            const response = await $axios.post(`/new/customer/export`, filters, {
                responseType: "text",
                headers: {
                    Accept: "text/csv",
                },
            });
            if (typeof response.data === "string") {
                const blob = new Blob([response.data], { type: "text/csv;charset=utf-8;" });

                const fileName = "new_customer_export.csv";
                const url = window.URL.createObjectURL(blob);
                const link = document.createElement("a");
                link.href = url;
                link.setAttribute("download", fileName);
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
                showSuccess("New Customer Export Successfully.");
            } else {
                console.error("Unexpected data format:", response.data);
                showError("Customer Report export failed: Unexpected response format.");
            }
        } catch (error) {
            console.error("Export error:", error);
            let messages = "Something went wrong";

            if (error.response?.data) {
                let data = error.response.data;
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
       exportNewCustomer
   }
}
