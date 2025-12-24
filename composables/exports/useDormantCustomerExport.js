import { useNuxtApp } from "#app";
import { useFileExport } from "@/composables/exports/useFileExport";
import useUiFeedback from "@/composables/useUiFeedback";
const { blobToText, jsonToCsv, downloadBlob, normalizeResponseToBlob } = useFileExport();
export const useDormantCustomerExport = () => {
    const {
        loading,
        showLoading,
        hideLoading,
        showSuccess,
        showError,
        confirmAction,
    } = useUiFeedback();
    const { $axios } = useNuxtApp();

    const exportDormantCustomer = async (filters = {}) => {
        showLoading("Exporting dormant customer report");
        try {
            const response = await $axios.post(`/dormant/customer/export`, filters, {
                responseType: "text",
                headers: { Accept: "application/json, text/csv" },
            });
            const contentType = response.headers["content-type"] || "text/csv";
            let fileName = "dormant_customer_export.csv";
            const cd = response.headers["content-disposition"];
            if (cd) {
                const match = cd.match(/filename="?(.+)"?/);
                if (match?.[1]) fileName = match[1];
            }
            const blob = response.data instanceof Blob
                ? response.data
                : new Blob([response.data], { type: contentType });

            const text = await blobToText(blob);
            let parsed;
            try { parsed = JSON.parse(text); } catch { parsed = null; }

            const finalBlob = normalizeResponseToBlob(parsed, text);

            downloadBlob(finalBlob, fileName);
            showSuccess("Dormant customer report exported successfully.");
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
            hideLoading();
        }
    }
    return {
        exportDormantCustomer
    }

} 
