import { useNuxtApp } from '#app'
import useUiFeedback from '@/composables/useUiFeedback'
import { ref } from 'vue'

export const usePaymentStatus = () => {
    const { $axios } = useNuxtApp()
    const { showLoading, hideLoading, showError, showSuccess } = useUiFeedback()

    const code = ref(null)
    const invoice = ref(null)
    const status = ref(null)
    const transactionData = ref(null)
    const showData = ref(false)

    const search = async (filters, endpoint) => {
        if (!filters.code && !filters.invoice) return showError('Please enter invoice or transfer code.');
        showLoading();
        try {
            const { data: raw } = await $axios.get(`${endpoint}`, {
                params: {
                    ...(filters.code && { transaction_code: filters.code }),
                    ...(filters.invoice && { invoice_no: filters.invoice }),
                },
            });

            const normalize = (item, index = 0) => ({
                index: index + 1,
                transaction_id: item.id,
                transaction_code: item.transaction_code ?? "-",
                date: item.created_at ?? "-",
                status: item.status ?? "-",
                customer_name: item.customer?.user?.name ?? "-",
                beneficiary_name: item.beneficiary?.name ?? "-",
                sending_country: item.gateway_country?.sending_country ?? "-",
                receiving_country: item.payer?.country ?? "-",
                sending_amount: item.sending_amount ?? "-",
                receiving_amount: item.receiving_amount ?? "-",
                agent_rate: item.agent_rate ?? "-",
                customer_rate: item.customer_rate ?? "-",
                status: item.status ?? "-",
                status_value: item.status_value ?? "-",
                beneficiary_first_name: item.beneficiary_first_name ?? "-",
                beneficiary_last_name: item.beneficiary_last_name ?? "-",
                beneficiary_phone: item.beneficiary_phone ?? "-",
                beneficiary_relation: item.beneficiary_relation ?? "-",



            });
            if (raw.success && Array.isArray(raw.data?.transactions?.data)) {
                transactionData.value = raw.data.transactions.data.map(normalize);
            } else if (raw.success && raw.data && typeof raw.data === 'object') {
                transactionData.value = [normalize(raw.data)];
            } else {
                return showError("No transactions found or invalid response format.");
            }
            showData.value = true;
            //  console.log("Final Result:", transactionData.value);
        }
        catch (error) {
            if (error.response && error.response.data) {
                const responseData = error.response.data;

                if (responseData.errors) {
                    const allErrors = Object.values(responseData.errors).flat();

                    // ✅ Show each error separately
                    allErrors.forEach(err => showError(err));
                } else if (responseData.message) {
                    showError(responseData.message);
                } else {
                    showError("Something went wrong.");
                }
            } else {
                showError(error.message || "Network error occurred.");
            }
        }


        finally {
            hideLoading();
        }
    };


    const reset = () => {
        code.value = null
        invoice.value = null
        transactionData.value = null
        showData.value = false
    }
    /*Update Payment Status */
    const updateStatus = async (data) => {
        showLoading()
        try {
            const res = await $axios.patch('/change/payment/status', data)
            showSuccess('Status updated successfully')
            return res.data
        } catch (err) {
            console.error('Patch error:', err)
            showError(err?.response?.data?.message ?? 'Failed to update status')
        } finally {
            hideLoading()
        }
    }
    /* Release Partner Payments */
    const releasePayment = async (data) => {
        showLoading()
        try {
            const res = await $axios.patch('/release/partner/payments', data)
            showSuccess('Payment Release Successfully')
            return res.data;
        } catch (err) {
            console.error('Patch error:', err)
            showError(err?.response?.data?.message ?? 'Failed to release payment')
        } finally {
            hideLoading()
        }
    }
    const resolveStatusVariant = (status_value) => {
        if (!status_value) return {};

        const key = status_value.toLowerCase().replace(/\s+/g, "_");

        const variants = {
            incomplete: {
                color: "#FFFFFF",
                background: "#FF5733",
                text: "INCOMPLETE",
            },
            awaiting_funds: {
                color: "#FFFFFF",
                background: "#FF9800",
                text: "AWAITING FUNDS",
            },
            verifying_transfer: {
                color: "#FFFFFF",
                background: "#4CAF50",
                text: "VERIFYING TRANSFER",
            },
            compliance_review: {
                color: "#FFFFFF",
                background: "#673AB7",
                text: "COMPLIANCE REVIEW",
            },
            compliance_held: {
                color: "#FFFFFF",
                background: "#009688",
                text: "COMPLIANCE HELD",
            },
            processing_transfer: {
                color: "#FFFFFF",
                background: "#2196F3",
                text: "PROCESSING TRANSFER",
            },
            available_for_collection: {
                color: "#FFFFFF",
                background: "#9C27B0",
                text: "AVAILABLE FOR COLLECTION",
            },
            send_to_partner: {
                color: "#FFFFFF",
                background: "#795548",
                text: "SEND TO PARTNER",
            },
            paid: {
                color: "#FFFFFF",
                background: "#4CAF50",
                text: "PAID",
            },
            canceled: {
                color: "#FFFFFF",
                background: "#F44336",
                text: "CANCELED",
            },
            canceling: {
                color: "#FFFFFF",
                background: "#FF5722",
                text: "CANCELING",
            },
            refunded: {
                color: "#FFFFFF",
                background: "#607D8B",
                text: "REFUNDED",
            },
        };

        return (
            variants[key] || {
                color: "#757575",
                background: "#E0E0E0",
                text: "UNKNOWN",
            }
        );
    };


    return {
        code,
        invoice,
        status,
        transactionData,
        showData,
        search,
        reset,
        releasePayment,
        updateStatus,
        resolveStatusVariant,
    }
}
