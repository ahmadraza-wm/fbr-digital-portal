import { useNuxtApp } from "#app";
import useUiFeedback from "@/composables/useUiFeedback";
import { computed, onMounted, ref } from "vue";
import { useRoute, useRouter } from "vue-router";
export const useComplianceHoldReport = () => {
    const { $axios } = useNuxtApp();
    const route = useRoute();
    const router = useRouter();
    const userList = ref([]);

    const {
        loading,
        showLoading,
        hideLoading,
        showSuccess,
        showError,
        confirmAction,
    } = useUiFeedback();

    const fetchComplianceHold = async (filters) => {
        showLoading('Fetching Compliance Hold Report')
        try {
            loading.value = true;
            const response = await $axios.get("/compliance/held/report", {
                params: filters,
            });
            if (response) {
                userList.value = response.data.data.map((item, index) => {
                    return {
                        sr_no: index + 1,
                        created_at: item.created_at ?? "--",
                        transaction_code: item.transaction_code ?? "--",
                        status: item.status ?? "--",
                        agent: item.agent ?? "--",
                        customer_name: item.customer_name ?? "--",
                       beneficiary_name: item.beneficiary_name ?? "--",
                        amount: item.amount ?? "--",
                        total_sent: item.total_sent ?? "--",
                        remarks: item.remarks ?? "--",
                    }
                });
            }
            else {
                showError('Failed to fetch  Compliance Hold Report')
            }
        }
        catch (error) {
            console.error(error);
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
    const exportComplianceHoldReport = async (filters) => {
        showLoading("Exporting Complaince Hold Report....");
        try {
            const response = await $axios.post(`/compliance/held/report/export`, filters, {
                responseType: "text",
                headers: {
                    Accept: "text/csv",
                },
            });
            if (typeof response.data === "string") {
                const blob = new Blob([response.data], { type: "text/csv;charset=utf-8;" });

                const fileName = "Complaince Hold Report.csv";
                const url = window.URL.createObjectURL(blob);
                const link = document.createElement("a");
                link.href = url;
                link.setAttribute("download", fileName);
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);

                showSuccess("Complaince Hold Report exported successfully.");
            } else {
                console.error("Unexpected data format:", response.data);
                showError("Report export failed: Unexpected response format.");
            }
        } catch (error) {
            console.error("Error exporting:", error);
            showError("Failed to export report.");
        } finally {
            hideLoading();
        }
    };



    return {
        userList,
        fetchComplianceHold,
        exportComplianceHoldReport
        
    }

}

