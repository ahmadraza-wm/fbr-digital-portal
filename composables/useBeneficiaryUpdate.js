import { useNuxtApp } from "#app";
import useUiFeedback from "@/composables/useUiFeedback";
import { ref } from "vue";
import { useRoute, useRouter } from "vue-router";

export const useBeneficiaryUpdate = () => {
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
    const pagination = ref([]);

    const total_transactions = ref(0);
    const total_sending_amount = ref(0);
    const total_charges = ref(0);
    const total_receiving_amount = ref(0);
    const bankList = ref([]);
    const payersList = ref([]);
    const beneficiaryBankList = ref([]);
    const walletList = ref([]);
    const cashDestinations = ref([]);

    const filters = ref({
        country_id: "",
        name: "",
    });

    const fetchBanks = async (filterParams = {}) => {
        showLoading("Fetching banks...");

        try {
            const response = await $axios.get("/banks", {
                params: filterParams,
            });

            if (response.data.success) {
                bankList.value = response.data.data.data;

            } else {
                showError("Failed to fetch banks");
            }
        } catch (error) {
            showError("Error fetching banks");
            console.error(error);
        } finally {
            hideLoading();
        }
    };

    const fetchPayers = async (filters = {}) => {
        showLoading("Fetching payers...");
        try {
            const response = await $axios.get("/payers/list?pagination=false", {
                params: filters,
            });
            if (response.data.success) {
                payersList.value = response.data.data.data;

            } else {
                showError("Failed to fetch payers");
            }
        } catch (error) {
            showError("Error fetching payers");
            console.error(error);
        } finally {
            hideLoading();
        }
    };

    const fetchCashDestinations = async (filters = {}) => {
        showLoading("Fetching cash destinations...");
        try {
            const response = await $axios.get("/destinations?pagination=false", { params: filters });
            if (response.data.success) {
                cashDestinations.value = response.data.data.data;
                console.log(cashDestinations.value);
            } else {
                showError("Failed to fetch cash destinations");
            }
        } catch (error) {
            console.error(error);
            showError("Something went wrong");
        } finally {
            hideLoading();
        }
    };

    const fetchBeneficiaryBanks = async (beneficiaryId) => {
        showLoading("Fetching beneficiary banks...");
        try {
            const response = await $axios.get(`/beneficiary/banks/${beneficiaryId}`);
            if (response.data.success) {
                const banksRaw = response.data.data;

                // Transform: extract `bank` objects
                beneficiaryBankList.value = banksRaw.map(item => item.bank);

            } else {
                showError("Failed to fetch banks");
            }
        } catch (error) {
            showError("Error fetching banks");
            console.error(error);
        } finally {
            hideLoading();
        }
    };

    const fetchWallets = async (filterParams = {}) => {
        showLoading("Fetching wallets...");
        try {
            const response = await $axios.get("/wallets?pagination=false", {
                params: filterParams,
            });
            if (response.data.success) {
                walletList.value = response.data.data.data;
            } else {
                showError("Failed to fetch wallets");
            }
        } catch (error) {
            showError("Error fetching wallets");
            console.error(error);
        } finally {
            hideLoading();
        }
    };



    const updateBeneficiary = async (formState) => {

        const isValidPhone = /^\+?[0-9]{7,15}$/.test(formState.phone);
        if (!isValidPhone) {
            showError("Invalid phone number. It must be 7–15 digits and may start with '+'.");
            return { success: false, error: "Invalid phone number format" };
        }


        const payload = {
            payer_id: formState.selectedPayer,
            transaction_code: formState.transferCode,
            first_name: formState.firstName,
            last_name: formState.lastName,
            dob: formState.dob,
            phone_number: formState.phone,
            relation: formState.relation,
            address: formState.address,
            house_no: formState.houseNo,
            street: formState.streetName,
            city: formState.city,
            postal_code: formState.postalCode,
            receiving_method: formState.selectedMethod,
        };

        // Set method-specific fields
        if (formState.selectedMethod === 'bank') {
            payload.bank_id = formState.selectedBank;
            payload.existing_beneficiary_bank_id = formState.selectedBeneficiaryBank 
            
            payload.banks = [
                {
                    id: formState.selectedBank,
                    branch_name: formState.branchName,
                    branch_code: formState.branchCode,
                    account_number: formState.accountNo,
                    iban: formState.iban,
                },
            ];
        } else if (formState.selectedMethod === 'cash') {
            payload.cash_destination_id = formState.cash_destination_id;
        } else if (formState.selectedMethod === 'mobile_wallet') {
            payload.wallet_id = formState.wallet_id;
        }

        try {
            showLoading("Updating beneficiary…");
            const { data } = await $axios.patch(
                "/modification/beneficiary/details",
                payload
            );

            if (data.success) {
                showSuccess("Beneficiary updated successfully");
                console.log("Beneficiary updated successfully");
                return { success: true, data: data };
            } else {
                showError(data.message || "Failed to update beneficiary");
                return { success: false, data };
            }
        } catch (error) {
            showError("Error updating beneficiary");
            const messages = error.response?.data?.errors
                ? Object.values(error.response.data.errors).flat()
                : error.response?.data?.message || "Something went wrong";
            showError(messages);
            return { success: false, error: error };
        } finally {
            hideLoading();
        }
    };




    const fetchPartners = async () => {

        try {
            const res = await $axios.get("/partners/list?pagination=false");
            partners.value = res.data.data;
        } catch (error) {
            showError("Error fetching banks partner");
        } finally {
            hideLoading();
        }
    };

    const options = ref({ itemsPerPage: 5, page: 1, status: "" });

    const fetchTransactions = async (filterParams = {}, withPagination = true) => {
        showLoading("Fetching Transactions...");

        try {
            const response = await $axios.get("/modification/beneficiary/details", {
                params: {
                    ...filterParams,
                    pagination: withPagination,
                },
            });

            if (response.data.success) {
                const data = response.data.data;
                console.log("beneficairy details ", response.data.data.data);
                if (withPagination) {
                    pagination.value = response.data.data;
                    payments.value = response.data.data.data.map((item, index) => transformTransaction(item, index));
                } else {
                    payments.value = response.data.data.map((item, index) => transformTransaction(item, index));
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

    const transformTransaction = (item, index) => {
        const beneficiary = item.beneficiary ?? {};
        const beneficiaryBank = item.beneficiary_bank ?? {};
        const bank = beneficiaryBank.bank ?? {};
        const payer = item.payer ?? {};
        const customer = item.customer ?? {};
        const customerUser = customer.user ?? {};
        const sendingCountry = customer.sending_country ?? {};

        return {
            index: index + 1,
            date: item.created_at ?? "-",
            code: item.transaction_code ?? "-",
            status_value: item.status_value ?? "-",
            channel: item.channel ?? "-",
            customer_id: customer.id,
            customer_name: customerUser?.name,
            customer_phone: customer.phone_number,
            sending_country: sendingCountry.name,
            sending_method: item.sending_method,
            beneficiary_id: beneficiary.id,
            beneficiary_first_name: item.beneficiary_first_name,
            beneficiary_last_name: item.beneficiary_last_name,
            beneficiary_phone: item.beneficiary_phone,
            beneficiary_country: beneficiary.country,
            receiving_method: item.receiving_method,
            sending_amount: item.sending_amount,
            sending_currency: item.sending_currency,
            sending_rate: item.sending_rate,
            receiving_currency: item.receiving_currency,
            receiving_amount: item.receiving_amount,
            sender_sanction: item.sender_sanction,
            beneficiary_sanction: item.beneficiary_sanction,
            payer_id: payer.id,
            country_id: payer.country_id,
            beneficiary_dob: beneficiary.dob,
            beneficiary_address: beneficiary.address,
            beneficiary_houseno: beneficiary.house_no,
            beneficiary_street: beneficiary.street,
            beneficiary_postalcode: beneficiary.postal_code,
            beneficiary_city: beneficiary.city,
            beneficiary_relation: item.beneficiary_relation,
            beneficiary_bank_id: bank.id,
            beneficiary_bank_name: bank.name,
            beneficiary_branch: beneficiaryBank.branch_name,
            beneficiary_branch_code: beneficiaryBank.branch_code,
            beneficiary_account: beneficiaryBank.account_number,
            beneficiary_iban: beneficiaryBank.iban,
            beneficiary_wallet: item.wallet,
            cash_destination_id: item.cash_destination,
        };
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
                    partner_currency: item.partner?.name ?? "-",
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
        fetchBanks();
    });

    return {
        headers,
        payments,
        pagination,
        options,
        filters,
        bankList,
        showLoading,
        showError,
        hideLoading,
        partners,
        total_transactions,
        total_sending_amount,
        total_charges,
        total_receiving_amount,
        getPartnerStatus,
        transactionDetail,
        fetchBanks,
        fetchBeneficiaryBanks,
        fetchPayers,
        payersList,
        beneficiaryBankList,
        walletList,
        fetchCashDestinations,
        cashDestinations,
        fetchWallets,
        updateBeneficiary,
        // getPartnerLink,
        resolveStatusVariant,
        fetchTransactions,
    };
};
