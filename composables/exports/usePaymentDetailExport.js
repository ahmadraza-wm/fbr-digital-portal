import { useNuxtApp } from "#app";
import useUiFeedback from "@/composables/useUiFeedback";

export const usePaymentDetailExport= () => {
    
    const {
        showLoading,
        hideLoading,
        showSuccess,
        showError,

    } = useUiFeedback();
    const { $axios } = useNuxtApp();

    const exportCompressedPaymentDetail = async (filters) => {
        try {
            showLoading('Exporting Compressed Payment Report...');
            const response = await $axios.post(`/payment/detail/export/compressed`, filters, {
                responseType: "text",
                headers: {
                    Accept: "text/csv",
                },
            });
            if (typeof response.data === "string") {
                const blob = new Blob([response.data], { type: "text/csv;charset=utf-8;" });

                const fileName = "compressed_payment_detal.csv";
                const url = window.URL.createObjectURL(blob);
                const link = document.createElement("a");
                link.href = url;
                link.setAttribute("download", fileName);
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);

                showSuccess("Compressed payment report exported successfully.");
            } else {
                console.error("Unexpected data format:", response.data);
                showError("Compressed payment report failed: Unexpected response format.");
            }
        } catch (error) {
            console.error("Error exporting:", error);
            showError("Failed to export compressed payment report.");
        } finally {
            hideLoading();
        }
    }
    const exportPaymentDetail = async (filters) => {
        try {
            showLoading('Exporting  Payment Report...');
            const response = await $axios.post(`/payment/detail/export`, filters, {
                responseType: "text",
                headers: {
                    Accept: "text/csv",
                },
            });
            if (typeof response.data === "string") {
                const blob = new Blob([response.data], { type: "text/csv;charset=utf-8;" });
                const fileName = "payment_detal.csv";
                const url = window.URL.createObjectURL(blob);
                const link = document.createElement("a");
                link.href = url;
                link.setAttribute("download", fileName);
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
                showSuccess("payment report exported successfully.");
            } else {
                console.error("Unexpected data format:", response.data);
                showError("payment report failed: Unexpected response format.");
            }
        } catch (error) {
            console.error("Error exporting:", error);
            showError("Failed to export compressed payment report.");
        } finally {
            hideLoading();
        }
    }
    return {
        exportCompressedPaymentDetail,
        exportPaymentDetail
   }
}
