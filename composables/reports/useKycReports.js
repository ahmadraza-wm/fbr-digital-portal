import { useNuxtApp } from "#app";
import useUiFeedback from "@/composables/useUiFeedback";

export const useKycReports = () => {
  const {
    loading,
    showLoading,
    hideLoading,
    showSuccess,
    showError,
    // confirmAction,
  } = useUiFeedback();
  const { $axios } = useNuxtApp();
  const userList = ref([]);

    const fetchKycReports = async (filters) => {
        const cleanedFilters = { ...filters }
        if (!cleanedFilters.category || cleanedFilters.category === 'all') {
            delete cleanedFilters.category
        }

    try {
      loading.value = true;

        const response = await $axios.get("/report/kyc/notes", {
            params: cleanedFilters,
        });
        
        console.log('test response', response.data.data);


      if (response) {
          userList.value = response.data.data.map((item, index) => {
              return {
                  sr_no: index + 1,
                  note: item.note ?? "--",
                  category: item.category ?? "--",
                  transaction_id: item.transaction_id ?? "--",
                  transaction_code: item.transaction_code ?? "--",
                  issuance_date: item.issuance_date ?? "--",
                  expiry_date: item.expiry_date ?? "--",
                  created_at: item.created_at ?? "--",
                  created_by: item.created_by ?? "--",
                  attachment: item.attachment ?? "--",

              }

          });

      }
      else {
        showError("Failed to fetch customer journey");
      }
    } catch (error) {
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
  };
    const exportKycReports = async (filters = {}) => {
        showLoading("Exporting Customer Journey...");
        try {
            const response = await $axios.post(`/customer/journey/report/export`, {
                params: filters,
                responseType: "blob",
            });
            if (response.data) {
                const blob = new Blob([response.data], {
                    type: "text/csv;charset=utf-8;",
                });
                const url = window.URL.createObjectURL(blob);
                const link = document.createElement("a");
                link.href = url;
                const contentDisposition = response.headers["content-disposition"];
                let fileName = "customer_journey_export.csv";
                if (contentDisposition) {
                    const match = contentDisposition.match(/filename="?([^"]+)"?/);
                    if (match && match[1]) fileName = match[1];
                }

                link.setAttribute("download", fileName);
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
                showSuccess("Customer Reviews exported successfully.");
            } else {
                showError("Failed to export customer reviews.");
            }
        } catch (error) {
            console.error(error);
            showError("Failed to export customer reviews.");
        } finally {
            hideLoading();
        }
    };

    const resolveStatusVariant = (status) => {
        const key = String(status).trim().toLowerCase(); // Normalize the incoming value
        const variants = {
            reward_granted: {
                color: "#FFFFFF",
                background: "#198754",
                text: "Reward Granted",
            },
            pending: {
                color: "#FFFFFF",
                background: "#FF5733",
                text: "Pending",
            },
        };

        return (
            variants[key.replace(/\s+/g, '_')] || {
                color: "#757575",
                background: "#E0E0E0",
                text: "UNKNOWN",
            }
        );
    };

  return {
    userList,
    loading,
      fetchKycReports,
      exportKycReports,
      resolveStatusVariant
  };
};
