import { useNuxtApp } from "#app";
import useUiFeedback from "@/composables/useUiFeedback";
import { ref } from "vue";
import { useRoute, useRouter } from "vue-router";

export const usePaymentCanceling = () => {
    const { $axios } = useNuxtApp();
    const route = useRoute();
    const router = useRouter();

    const partners = ref([]);

    const {
        loading,
        showLoading,
        hideLoading,
        showSuccess,
        showError,
        confirmAction,
    } = useUiFeedback();

    const payments = ref([]);
    const pagination = ref({});
    const filters = ref({
        country_id: "",
        name: "",
    });

    const options = ref({ itemsPerPage: 5, page: 1, status: "" });

    const fetchTransactions = async (filterParams = {}, withPagination = true) => {
        showLoading("Fetching Transactions...");

        try {
            const response = await $axios.get("/payment/canceling", {
                params: {
                    ...filterParams,
                    pagination: withPagination,
                },
            });
            if (response.data.success) {
                const data = response.data.data;
                if (withPagination) {
                    pagination.value = response.data.data;
                }
                payments.value = response.data.data.data.map((item, index) => {
                    return {
                        transaction_id: item.id,
                        index: index + 1,
                        date: item.created_at ?? "-",
                        code: item.transaction_code ?? "-",
                        status_value: item.status_value ?? "-",
                        channel: item.channel ?? "-",
                        customer_id: item.customer.id,
                        customer_name: item.customer.user.name,
                        customer_phone: item.customer.phone_number,
                        sending_country: item.customer.sending_country.name,
                        sending_method: item.sending_method,
                        beneficiary_id: item.beneficiary.id,
                        beneficiary_name: item.beneficiary.name,
                        beneficiary_phone: item.beneficiary.phone_number,
                        beneficiary_country: item.beneficiary.country,
                        receiving_method: item.receiving_method,
                        sending_amount: item.sending_amount,
                        sending_currency: item.sending_currency,
                        sending_rate: item.sending_rate,
                        receiving_currency: item.receiving_currency,
                        receiving_amount: item.receiving_amount,
                        sender_sanction: item.sender_sanction,
                        beneficiary_sanction: item.beneficiary_sanction,
                        beneficiary_first_name: item.beneficiary_first_name,
                        beneficiary_last_name: item.beneficiary_last_name,
                        beneficiary_phone: item.beneficiary_phone,
                        beneficiary_relation: item.beneficiary_relation,

                    };
                });
            } else {
                showError("No transactions found or invalid response format.");
            }
        } catch (error) {
            showError("Error fetching transactions");
            console.error(error);
        } finally {
            hideLoading();
        }
    };

    const headers = computed(() => {
        const baseHeaders = [
            { title: "#", key: "sr_no" },

            {
                title: "Payment Date",
                key: "date",
            },
            {
                title: "code",
                key: "paymentstatus",
            },
            {
                title: "Sender",
                key: "sender",
            },

            {
                title: "Beneficiary",
                key: "beneficiary",
            },

            {
                title: "Amount",
                key: "amount",
            },
            {
                title: "Action",
                key: "action",
            },
        ];

        const statusArray = options.value.status || [];

        return baseHeaders;
    });

    const resolveStatusVariant = (status_value) => {
        const variants = {
            incomplete: {
                color: "#FFFFFF",
                background: "#FF5733", // Bright Red
                text: "INCOMPLETE",
            },
            awaiting_funds: {
                color: "#FFFFFF",
                background: "#FF9800", // Orange
                text: "AWAITING FUNDS",
            },
            verifying_transfer: {
                color: "#FFFFFF",
                background: "#4CAF50", // Green
                text: "VERIFYING TRANSFER",
            },
            compliance_review: {
                color: "#FFFFFF",
                background: "#673AB7", // Purple
                text: "COMPLIANCE REVIEW",
            },
            compliance_held: {
                color: "#FFFFFF",
                background: "#009688", // Teal
                text: "COMPLIANCE HELD",
            },
            processing_transfer: {
                color: "#FFFFFF",
                background: "#2196F3", // Blue
                text: "PROCESSING TRANSFER",
            },
            available_for_collection: {
                color: "#FFFFFF",
                background: "#9C27B0", // Deep Purple
                text: "AVAILABLE FOR COLLECTION",
            },
            send_to_partner: {
                color: "#FFFFFF",
                background: "#795548", // Brown
                text: "SEND TO PARTNER",
            },
            paid: {
                color: "#FFFFFF",
                background: "#4CAF50", // Green
                text: "PAID",
            },
            canceled: {
                color: "#FFFFFF",
                background: "#F44336", // Red
                text: "CANCELED",
            },
            canceling: {
                color: "#FFFFFF",
                background: "#FF5722", // Deep Orange
                text: "CANCELING",
            },
            refunded: {
                color: "#FFFFFF",
                background: "#607D8B", // Blue Grey
                text: "REFUNDED",
            },
        };

        return (
            variants[status_value] || {
                color: "#757575", // Default color (gray)
                background: "#E0E0E0", // Default background (light gray)
                text: "UNKNOWN",
            }
        );
    };

    return {
        headers,
        payments,
        options,
        filters,
        pagination,
        showLoading,
        showError,
        hideLoading,
        resolveStatusVariant,
        fetchTransactions,
    };
};
