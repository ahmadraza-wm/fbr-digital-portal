import { useNuxtApp } from "#app";
import useUiFeedback from "@/composables/useUiFeedback";
import { userList } from "@/views/demos/components/list/demoCodeList";
import { computed, onMounted, ref } from "vue";
import { useRoute, useRouter } from "vue-router";
export const useSanctionLogs = () => {
    const { $axios } = useNuxtApp();
    const route = useRoute();
    const router = useRouter();
    const {
        loading,
        showLoading,
        hideLoading,
        showSuccess,
        showError,
        confirmAction,
    } = useUiFeedback();

    const fetchSanctionLog = async (filters) => {
        
        try {
            loading.value = true;
            const response = await $axios.get("/", {
                params: filters,
            });
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
                showError('Failed to fetch sanction logs')
            }
        }
        catch {
            
        }
    }

    return {
        userList,
        fetchSanctionLog,

    }

}

