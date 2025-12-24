import { useNuxtApp } from "#app";
import useUiFeedback from "@/composables/useUiFeedback";
import { ref } from "vue";
import { useRoute, useRouter } from "vue-router";

export const usePayments = () => {
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

    const total_transactions = ref(0);
    const total_sending_amount = ref(0);
    const total_charges = ref(0);
    const total_receiving_amount = ref(0);
    const total = ref(1);

    const filters = ref({
        country_id: "",
        name: "",
    });

    const fetchPartners = async () => {

        try {
            const res = await $axios.get("/partners/list?pagination=false&force_fetch=true");
            partners.value = res.data.data.data;
        } catch (error) {
            showError("Error fetching banks partner");
        } finally {
            hideLoading();
        }
    };

    const options = ref({ itemsPerPage: 5, page: 1, status: "" });

    const fetchTransactions = async (filterParams = {}, withPagination = true) => {
        showLoading("Fetching Transactions...");
        if (filterParams.status) {
            options.value.status = filterParams.status;
        }

        try {
            const response = await $axios.get("/transactions", {
                params: {
                    ...filterParams,
                    pagination: withPagination,
                },
            });

            total_transactions.value = response.data.data.total_tranasctions ?? 0;
            total_sending_amount.value = response.data.data.total_sending_amount ?? 0;
            total_charges.value = response.data.data.total_charges ?? 0;
            total_receiving_amount.value = response.data.data.total_receiving_amount ?? 0;


            if (response.data.success && Array.isArray(response.data.data.transactions?.data)) {
                const data = response.data.data.transactions;
                payments.value = response.data.data.transactions.data.map((item, index) => {
                    let otherInfo = "-";
                    let accountNumber = "-";

                    if (item.receiving_method === "bank") {
                        otherInfo = item.beneficiary_bank?.bank?.name ?? "-";
                        accountNumber = item.beneficiary_bank?.account_number ?? "-";
                    } else if (item.receiving_method === "cash") {
                        otherInfo = item.cash_destination?.destination_name ?? "-";
                    } else if (item.receiving_method === "mobile_wallet") {
                        otherInfo = item.wallet?.name ?? "-";
                    }

                    return {
                        index: index + 1,
                        date: item.created_at ?? "-",
                        id: item.id ?? "-",
                        transaction_id: item.transaction_code ?? "-",
                        status: item.status ?? "-",
                        sender_sanction: item.sender_sanction ?? "-",
                        beneficiary_sanction: item.beneficiary_sanction ?? "-",
                        sanction_description: item.sanction_description ?? "-",
                        status_value: item.status_value ?? "-",
                        channel: item.channel ?? "-",
                        customer_name: item.customer?.user?.name ?? "-",
                        beneficiary_name: ((item.beneficiary_first_name ?? "") + " " + (item.beneficiary_last_name ?? "")).trim() || "-",
                        agent_rate: item.agent_rate ?? "-",
                        customer_rate: item.customer_rate ?? "-",
                        customer_id: item.customer?.id ?? "-",
                        beneficiary_id: item.beneficiary?.id ?? "-",
                        customer_phone: item.customer?.phone_number ?? "-",
                        customer_verified: item.customer?.verified ?? "-",
                        beneficiary_phone: item.beneficiary_phone ?? "-",
                        sending_country: item.gateway_country?.sending_country ?? "-",
                        receiving_country: item.payer?.country ?? "-",
                        beneficiary_receiving_country: item.payer?.country_id ?? "-",
                        sending_method: item?.sending_method ?? "-",
                        receiving_method: item.receiving_method ?? "-",
                        sending_rate: item.sending_rate ?? "-",
                        receiving_rate: item.receiving_rate ?? "-",
                        sending_amount: item.sending_amount ?? "-",
                        receiving_amount: item.receiving_amount ?? "-",
                        partner_user: item.partner_user ?? "-",
                        partner_name: item.partner?.name ?? "-",
                        partner_currency: item.partner?.settlement_currency ?? "-",
                        sending_currency: item.sending_currency ?? "-",
                        partner_response_message: item.partner_response_message ?? "-",
                        partner_transaction_reference: item.partner_transaction_reference ?? "-",
                        receiving_currency: item.receiving_currency ?? "-",
                        first_transaction: item.first_transaction ?? "-",
                        other_info: otherInfo,
                        account_number: accountNumber,
                        system_remarks: item.compliance_held_remarks_system ?? "-",
                        customer_remarks: item.compliance_held_remarks_customer ?? "-",
                        sc_rate: item.sc_rate ?? "-",
                        dc_rate: item.dc_rate ?? "-",
                        partner_id: item.partner_id ?? "-"
                    };
                });
                if (withPagination) {
                    pagination.value = response.data.data.transactions;
                }
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

    const getPartnerStatus = async (filterParams) => {
        try {
            const response = await $axios.get("/get/partner/status", {
                params: filterParams,
            });

            if (response.data.success && response.data.data) {
                const item = response.data.data.transaction;

                let otherInfo = "-";
                let accountNumber = "-";

                if (item.receiving_method === "bank") {
                    otherInfo = item.beneficiary_bank?.bank?.name ?? "-";
                    accountNumber = item.beneficiary_bank?.account_number ?? "-";
                } else if (item.receiving_method === "cash") {
                    otherInfo = item.cash_destination?.destination_name ?? "-";
                } else if (item.receiving_method === "mobile_wallet") {
                    otherInfo = item.wallet?.name ?? "-";
                }

                return {
                    date: item.created_at ?? "-",
                    id: item.id ?? "-",
                    transaction_id: item.transaction_code ?? "-",
                    customer_rate: item.customer_rate ?? "-",
                    agent_rate: item.agent_rate ?? "-",
                    status: item.status ?? "-",
                    sender_sanction: item.sender_sanction ?? "-",
                    beneficiary_sanction: item.beneficiary_sanction ?? "-",
                    sanction_description: item.sanction_description ?? "-",
                    status_value: item.status_value ?? "-",
                    channel: item.channel ?? "-",
                    customer_name: item.customer?.user?.name ?? "-",
                    beneficiary_name: item.beneficiary?.name ?? "-",
                    customer_id: item.customer?.id ?? "-",
                    beneficiary_id: item.beneficiary?.id ?? "-",
                    customer_phone: item.customer?.phone_number ?? "-",
                    customer_verified: item.customer?.verified ?? "-",
                    beneficiary_phone: item.beneficiary?.phone_number ?? "-",
                    sending_country: item.gateway_country?.sending_country ?? "-",
                    receiving_country: item.payer?.country ?? "-",
                    beneficiary_receiving_country: item.payer?.country_id ?? "-",
                    sending_method: item.gateway_country?.sending_method ?? "-",
                    receiving_method: item.receiving_method ?? "-",
                    sending_rate: item.sending_rate ?? "-",
                    receiving_rate: item.receiving_rate ?? "-",
                    sending_amount: item.sending_amount ?? "-",
                    receiving_amount: item.receiving_amount ?? "-",
                    partner_name: item.partner?.name ?? "-",
                    partner_currency: item.partner?.settlement_currency ?? "-",
                    sending_currency: item.sending_currency,
                    receiving_currency: item.receiving_currency,
                    first_transaction: item.first_transaction ?? "-",
                    other_info: otherInfo,
                    account_number: accountNumber,
                };
            } else {
                return null;
            }
        } catch (error) {
            console.error("Error fetching partner status", error);
            throw error;
        }
    };


    const fetchTransactionRemarks = async (id) => {
        showLoading("Fetching transaction details...");
        try {
            const response = await $axios.get(`/transactions/remarks/${id}`);
            if (response.data.success) {
                const data = response.data.data;
                return {
                    data
                };
            } else {
                showError("Failed to fetch transaction details");
                return null;
            }
        } catch (error) {
            showError("Error fetching transaction details");
            console.error(error);
            return null;
        } finally {
            hideLoading();
        }
    }

    const fetchSupportRemarks = async (id) => {
        showLoading("Fetching transaction details...");
        try {
            const response = await $axios.get(`/transactions/support/remarks/${id}`);
            if (response.data.success) {
                const data = response.data.data;
                return {
                    data
                };
            } else {
                showError("Failed to fetch transaction details");
                return null;
            }
        } catch (error) {
            showError("Error fetching transaction details");
            console.error(error);
            return null;
        } finally {
            hideLoading();
        }
    }


    const fetchComplaints = async (transactionCode) => {
    showLoading("Fetching complaints...");
    try {
        const response = await $axios.get(`/complaint/transaction/${transactionCode}`);
        console.log('complaints response',response);
        if (response.data.success) {
            return response.data.data ?? [];
        } else {
            showError("Failed to fetch complaints");
            return [];
        }
    } catch (error) {
         const messages = error.response?.data?.errors
        ? Object.values(error.response.data.errors).flat()
        : error.response?.data?.message || "Something went wrong";
        showError(messages);
        return [];
    } finally {
        hideLoading();
    }
};


    const transactionDetail = async (id) => {
        showLoading("Fetching transaction details...");
        try {
            const response = await $axios.get(`/transactions/${id}`);
            if (response.data.success) {
                const data = response.data.data;
                const transaction = data.transaction ?? {};
                const sender = {
                    ...(transaction.customer ?? {}),
                    ...(transaction.customer_details ?? {})
                };
                const beneficiary = {
                    ...(transaction.beneficiary ?? {}),
                    country: transaction.payer?.country ?? null
                };

                const senderDocuments = data.customer_documents ?? [];
                const beneficiaryDocuments = data.beneficiary_documents ?? [];
                const paymentGateway = transaction.gateway_country ?? {};
                const customerLedger = data.customer_ledger_card ?? [];
                const beneficiaryLedger = data.beneficiary_ledger ?? [];
                const transactionRemarks = data.transaction_remarks ?? [];
                const supportRemarks = data.transaction_support_remarks ?? [];
                const kycNotes = sender.kyc_notes ?? data.kyc_notes ?? [];
                const partnerResponseHistory = data.partner_response_history ?? [];
                const complaints = data.complaints ?? [];
                const automationRules = data.automation_rules ?? [];
                const transferReferences = data.transfer_references ?? [];

                console.log(beneficiaryLedger);


                return {
                    transaction,
                    sender,
                    beneficiary,
                    senderDocuments,
                    beneficiaryDocuments,
                    paymentGateway,
                    customerLedger,
                    beneficiaryLedger,
                    transactionRemarks,
                    supportRemarks,
                    kycNotes,
                    partnerResponseHistory,
                    complaints,
                    automationRules,
                    transferReferences,
                };
            } else {
                showError("Failed to fetch transaction details");
                return null;
            }
        } catch (error) {
            showError("Error fetching transaction details");
            console.error(error);
            return null;
        } finally {
            hideLoading();
        }
    };

    const cancelTransaction = async (transactionId, remarks) => {
        return await $axios.post(`/cancel/transaction`, {
            transaction_id: transactionId,
            remarks: remarks,
        });
    };

    const verifyTransaction = async (transactionId, remarks) => {
        return await $axios.post(`/verify/transfer`, {
            transaction_id: transactionId,
            remarks: remarks,
        });
    };



    const getPartnerLink = (item) => {
        const recCountryId = item.beneficiary_receiving_country;
        const method = item.receiving_method;
        const name = item.other_info;

        if (method === "bank") {
            const bankName = name;
            return `/banks?bank_name=${bankName}&rec_country_id=${recCountryId}`;
        } else if (method === "mobile_wallet") {
            const walletName = name;
            return `/wallets?wallet_name=${walletName}&rec_country_id=${recCountryId}`;
        } else if (method === "cash") {
            const destinationName = name;
            return `/cash-destination?cash_destination_name=${destinationName}&rec_country_id=${recCountryId}`;
        }

        return "#";
    };

    const headers = computed(() => {
        const baseHeaders = [
            { title: "#", key: "sr_no" },
            { title: "Date", key: "date" },
            { title: "Status", key: "status" },
            { title: "ID", key: "ban" },
            { title: "Name", key: "customer_name" },
            { title: "Phone", key: "customer_phone" },
            { title: "Country", key: "sending_country" },
            { title: "Method", key: "sending_method" },
            { title: "Rate", key: "sending_rate" },
            { title: "Amount", key: "sending_amount" },
            { title: "Other Info", key: "other_info" },
            { title: "Action", key: "details" },
        ];

        const statusArray = options.value.status || [];

        if (statusArray.length === 0 || statusArray.includes(null) || statusArray.includes("send_to_partner")) {
            baseHeaders.splice(10, 0, { title: "Partner", key: "partner_name" });
        }


        if (statusArray.includes("awaiting_funds")) {
            baseHeaders.splice(11, 0, { title: "Funds", key: "funds" });
        }

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
            reward_granted: {
                color: "#FFFFFF",
                background: "#198754", // Blue Grey
                text: "Reward Granted",
            },
            pending: {
                color: "#FFFFFF",
                background: "#FF5733",
                text: "Pending",
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

    onMounted(() => {
        fetchPartners();
    });

    return {
        headers,
        payments,
        options,
        filters,
        showLoading,
        showError,
        hideLoading,
        partners,
        total_transactions,
        total_sending_amount,
        total_charges,
        cancelTransaction,
        verifyTransaction,
        total_receiving_amount,
        getPartnerStatus,
        transactionDetail,
        fetchComplaints,
        getPartnerLink,
        resolveStatusVariant,
        fetchTransactions,
        fetchTransactionRemarks,
        fetchSupportRemarks,
        pagination,
        total
    };
};
