import { useNuxtApp } from "#app";
import { useFileExport } from "@/composables/exports/useFileExport";
import useUiFeedback from "@/composables/useUiFeedback";
const { blobToText, jsonToCsv, downloadBlob, normalizeResponseToBlob } = useFileExport();

export const useAmsFile = () => {
    const {
        loading,
        showLoading,
        hideLoading,
        showSuccess,
        showError,
        confirmAction,
    } = useUiFeedback();
    const { $axios } = useNuxtApp();

    const exportPaidFileAms = async (filters = {}) => {
        showLoading("Exporting Paid file for ams");
        try {
            const response = await $axios.post(`/paid/file/for/ams/export`, filters, {
                responseType: "text",
                headers: { Accept: "text/csv, application/json" },
            });
            const contentType = response.headers["content-type"] || "text/csv";
            let fileName = "paid_file_for_ams_export.csv";
            const cd = response.headers["content-disposition"];
            if (cd) {
                const match = cd.match(/filename="?(.+)"?/);
                if (match?.[1]) fileName = match[1];
            }
            const blob =
                response.data instanceof Blob
                    ? response.data
                    : new Blob([response.data], { type: contentType });

            const text = await blobToText(blob);
            let parsed;
            try {
                parsed = JSON.parse(text);
            } catch {
                parsed = null;
            }

            const finalBlob = normalizeResponseToBlob(parsed, text);

            downloadBlob(finalBlob, fileName);
            showSuccess("Paid file for AMS exported successfully.");
        }
        catch (error) {
            console.log("Export error:", error);

            let messages = "Something went wrong";

            if (error.response) {
                try {
                    const data = await blobToText(error.response.data);
                    let parsed;
                    try {
                        parsed = JSON.parse(data);
                        messages =
                            parsed.message ||
                            Object.values(parsed.errors || {})
                                .flat()
                                .join(", ") ||
                            messages;
                    } catch {
                        messages = data || error.response.statusText || messages; // if not JSON, show plain text
                    }
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
    };

    const exportCancelFileAms = async (filters = {}) => {
        showLoading("Exporting cancel file for ams");
        try {
            const response = await $axios.post(`/cancel/file/for/ams/export`, filters, {
                responseType: "text",
                headers: { Accept: "text/csv, application/json" },
            });
            const contentType = response.headers["content-type"] || "text/csv";
            let fileName = "cancel_file_for_ams_export.csv";
            const cd = response.headers["content-disposition"];
            if (cd) {
                const match = cd.match(/filename="?(.+)"?/);
                if (match?.[1]) fileName = match[1];
            }
            const blob =
                response.data instanceof Blob
                    ? response.data
                    : new Blob([response.data], { type: contentType });

            const text = await blobToText(blob);
            let parsed;
            try {
                parsed = JSON.parse(text);
            } catch {
                parsed = null;
            }

            const finalBlob = normalizeResponseToBlob(parsed, text);

            downloadBlob(finalBlob, fileName);
            showSuccess("Cancel file for AMS exported successfully.");
        }
        catch (error) {
            console.log("Export error:", error);

            let messages = "Something went wrong";

            if (error.response) {
                try {
                    const data = await blobToText(error.response.data);
                    let parsed;
                    try {
                        parsed = JSON.parse(data);
                        messages =
                            parsed.message ||
                            Object.values(parsed.errors || {})
                                .flat()
                                .join(", ") ||
                            messages;
                    } catch {
                        messages = data || error.response.statusText || messages; // if not JSON, show plain text
                    }
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
    };

    const exportHoldFileAms = async (filters = {}) => {
        showLoading("Exporting hold file for AMS");
        try {
            const response = await $axios.post(`/hold/file/for/ams/export`, filters, {
                responseType: "text",
                headers: { Accept: "text/csv, application/json" },
            });
            const contentType = response.headers["content-type"] || "text/csv";
            let fileName = "hold_file_for_ams_export.csv";
            const cd = response.headers["content-disposition"];
            if (cd) {
                const match = cd.match(/filename="?(.+)"?/);
                if (match?.[1]) fileName = match[1];
            }
            const blob =
                response.data instanceof Blob
                    ? response.data
                    : new Blob([response.data], { type: contentType });

            const text = await blobToText(blob);
            let parsed;
            try {
                parsed = JSON.parse(text);
            } catch {
                parsed = null;
            }

            const finalBlob = normalizeResponseToBlob(parsed, text);

            downloadBlob(finalBlob, fileName);
            showSuccess("Hold file for AMS exported successfully.");
        }
        catch (error) {
            console.error("Export error:", error);

            let messages = error.message || "Something went wrong";
            if (error.response?.data) {
                try {
                    const text = await blobToText(error.response.data);
                    const parsed = JSON.parse(text);
                    messages =
                        parsed.message ||
                        Object.values(parsed.errors || {})
                            .flat()
                            .join(", ") ||
                        messages;
                } catch { }
            }

            showError(messages);
        } finally {
            hideLoading();
        }
    };

    return {
        exportPaidFileAms,
        exportCancelFileAms,
        exportHoldFileAms,
    };
};
