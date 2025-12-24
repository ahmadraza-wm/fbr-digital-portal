import { useNuxtApp } from "#app";
import useUiFeedback from "@/composables/useUiFeedback";
import { computed, onMounted, ref } from "vue";
import { useRoute, useRouter } from "vue-router";
export const usecorridorTarget = () => {
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

    const fetchCorridorTarget = async (filters) => {
        showLoading('Fetching Corridor Target Report...')
        try {
            loading.value = true;
            const response = await $axios.get("/corridor/target/report", {
                params: filters,
            });
            if (response) {
                console.log('api response', response)
                userList.value = response.data.data.map((item, index) => {
                    return {

                        sr_no: index + 1,
                        date_from: filters.date_from,
                        date_to: filters.date_to,
                        frequency: item.frequency ?? "--",
                        target_count: item.target_count ?? "--",
                        achieved_count: item.achieved_count ?? "--",
                        target_amount: item.target_amount ?? "--",
                        achieved_amount: item.achieved_amount ?? "--",
                        sending_country: item.corridor.sending_country.name ?? "--",
                        receiving_country: item.corridor.receiving_country.name ?? "--",
                    }
                });
            }
            else {
                showError('Failed to fetch sanction logs')
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
    const exportCorridorTarget = async (filters) => {
        showLoading("Exporting Corridor Target Report....");
        try {
            const response = await $axios.post(`/corridor/target/report/export`, filters, {
                responseType: "text",
                headers: {
                    Accept: "text/csv",
                },
            });
            if (typeof response.data === "string") {
                const blob = new Blob([response.data], { type: "text/csv;charset=utf-8;" });

                const fileName = "corridor_target_report.csv";
                const url = window.URL.createObjectURL(blob);
                const link = document.createElement("a");
                link.href = url;
                link.setAttribute("download", fileName);
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);

                showSuccess("Corridor Target report exported successfully.");
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
        fetchCorridorTarget,
        exportCorridorTarget
        
    }

}

