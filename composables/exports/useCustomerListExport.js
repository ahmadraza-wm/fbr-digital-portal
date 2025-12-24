import { useNuxtApp } from "#app";
import useUiFeedback from "@/composables/useUiFeedback";

export const useCustomerDetailExport = () => {

    const {
        showLoading,
        hideLoading,
        showSuccess,
        showError,

    } = useUiFeedback();
    const { $axios } = useNuxtApp();

    const exportCustomerList = async (filters) => {
        try {
            showLoading('Exporting  Customer List Report...');
            const response = await $axios.post(`/customer/list/export`, filters, {
                responseType: "text",
                headers: {
                    Accept: "text/csv",
                },
            });
            if (typeof response.data === "string") {
                const blob = new Blob([response.data], { type: "text/csv;charset=utf-8;" });
                const fileName = "customer_llist_detail.csv";
                const url = window.URL.createObjectURL(blob);
                const link = document.createElement("a");
                link.href = url;
                link.setAttribute("download", fileName);
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
                showSuccess("Customer List report exported successfully.");
            } else {
                console.error("Unexpected data format:", response.data);
                showError("Customer List report failed: Unexpected response format.");
            }
        } catch (error) {
            console.log("Error exporting:", error);
            const messages = error.response?.data?.errors
                ? Object.values(error.response.data.errors).flat()
                : error.response?.data?.message || "Something went wrong";
            showError(messages);
        } finally {
            hideLoading();
        }
    }
    return {
        exportCustomerList
    }
}
