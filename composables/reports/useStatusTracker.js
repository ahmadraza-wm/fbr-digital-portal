import { useNuxtApp } from "#app";
import useUiFeedback from "@/composables/useUiFeedback";

export const useStatusTracker = () => {
    const {
        loading,
        showLoading,
        hideLoading,
        showSuccess,
        showError,
        confirmAction,
    } = useUiFeedback();
    const { $axios } = useNuxtApp();
    const userList = ref([])


    const fetchStatusTracker = async (filters) => {
        try {
            loading.value = true;
            const response = await $axios.get('status/tracker/report', {
                params: filters
            })
            if (response) {
                console.log("Response:", response.data);

                const list = response?.data?.data;   // Adjust based on API shape
                if (Array.isArray(list) && list.length > 0) {
                    userList.value = list.map((item, index) => {
                        const row = {
                            sr_no: index + 1,
                            transaction_code: item.transaction_code ?? "--",
                            status: item.status ?? "--",
                            total_duration: item.total_duration ?? "--",
                        };

                        if (Array.isArray(item.status_histories)) {
                            item.status_histories.forEach((history) => {
                                switch (history.status?.toUpperCase()) {
                                    case "AWAITING FUNDS":
                                        row.funds = `${history.status ?? "--"}<br>${history.time ?? "--"}<br>${history.total_duration ?? "--"}`;
                                        break;
                                    case "INCOMPLETE":
                                        row.incomplete = `${history.status ?? "--"}<br>${history.time ?? "--"}<br>${history.total_duration ?? "--"}`;
                                        break;
                                    case "VERIFYING TRANSFER":
                                        row.transfer = `${history.status ?? "--"}<br>${history.time ?? "--"}<br>${history.total_duration ?? "--"}`;
                                        break;
                                    case "COMPLIANCE REVIEW":
                                        row.review = `${history.status ?? "--"}<br>${history.time ?? "--"}<br>${history.total_duration ?? "--"}`;
                                        break;
                                    case "COMPLIANCE HELD":
                                        row.held = `${history.status ?? "--"}<br>${history.time ?? "--"}<br>${history.total_duration ?? "--"}`;
                                        break;
                                    case "OPERATION HOLD":
                                        row.hold = `${history.status ?? "--"}<br>${history.time ?? "--"}<br>${history.total_duration ?? "--"}`;
                                        break;
                                    case "PROCESSING TRANSFER":
                                        row.ptransfer = `${history.status ?? "--"}<br>${history.time ?? "--"}<br>${history.total_duration ?? "--"}`;
                                        break;
                                    case "AVAILABLE FOR COLLECTION":
                                        row.collection = `${history.status ?? "--"}<br>${history.time ?? "--"}<br>${history.total_duration ?? "--"}`;
                                        break;
                                    case "SEND TO PARTNER":
                                        row.partner = `${history.status ?? "--"}<br>${history.time ?? "--"}<br>${history.total_duration ?? "--"}`;
                                        break;
                                    case "PAID":
                                        row.paid = `${history.status ?? "--"}<br>${history.time ?? "--"}<br>${history.total_duration ?? "--"}`;
                                        break;
                                    case "CANCELED":
                                        row.canceled = `${history.status ?? "--"}<br>${history.time ?? "--"}<br>${history.total_duration ?? "--"}`;
                                        break;
                                    case "CANCELING":
                                        row.canceling = `${history.status ?? "--"}<br>${history.time ?? "--"}<br>${history.total_duration ?? "--"}`;
                                        break;
                                    case "REFUNDED":
                                        row.refunded = `${history.status ?? "--"}<br>${history.time ?? "--"}<br>${history.total_duration ?? "--"}`;
                                        break;
                                }
                            });
                        }

                        return row;
                    });
                } else {
                    userList.value = []; // no data case
                }

            }

        }
        catch (error) {
            console.log(error);
            if (error.response && error.response.data) {
                const responseData = error.response.data;
                if (responseData.errors) {
                    const allErrors = Object.values(responseData.errors).flat();
                    allErrors.forEach((err) => showError(err));
                } else if (responseData.message) {
                    showError(responseData.message);
                } else {
                    showError("Something went wrong.");
                }
            } else {
                showError(error.message || "Network error occurred.");
            }
        } finally {
            loading.value = false;
        }

    }
    const exportStatusTracker = async (filters = {}) => {
        showLoading("Exporting status tracker report...");
        try {
            const response = await $axios.post(`/status/tracker/report/export`, filters, {
                responseType: "text",
                headers: {
                    Accept: "text/csv",
                },
            });
            if (typeof response.data === "string") {
                const blob = new Blob([response.data], { type: "text/csv;charset=utf-8;" });

                const fileName = "status_tracker_report.csv";
                const url = window.URL.createObjectURL(blob);
                const link = document.createElement("a");
                link.href = url;
                link.setAttribute("download", fileName);
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);

                showSuccess("Status tracker report exported successfully.");
            } else {
                console.error("Unexpected data format:", response.data);
                showError("Failed to export status tracker report.");
            }
        } catch (error) {
            console.error(error);
            showError("Failed to export status tracker report.");
        }

        finally {
            hideLoading();
        }
    };
    return {
        fetchStatusTracker,
        userList,
        exportStatusTracker,
        loading
    }
};
