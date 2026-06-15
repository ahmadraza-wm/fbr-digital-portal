import { defineStore } from 'pinia'

export const useFbrStore = defineStore('fbr', {
    state: () => ({
        isSandbox: true,
        provinces: [],
        docTypes: [],
        uomList: [],
        transactionTypes: [],
        rates: [],
        submittedInvoices: [],
        validatedInvoices: [],
        loadingRef: false,
        loadingSubmit: false,
        loadingValidate: false,
        lastResponse: null,
        lastError: null,
    }),

    getters: {
        environmentLabel: state => state.isSandbox ? 'Sandbox' : 'Production',
        environmentColor: state => state.isSandbox ? 'warning' : 'success',
        provinceOptions: state => state.provinces.map(p => ({
            title: p.stateProvinceDesc,
            value: p.stateProvinceDesc,
        })),
        uomOptions: state => state.uomList.map(u => ({
            title: u.description,
            value: u.description,
        })),
        transTypeOptions: state => state.transactionTypes.map(t => ({
            title: t.transactioN_DESC,
            value: t.transactioN_TYPE_ID,
        })),
    },

    actions: {
        toggleEnvironment() {
            this.isSandbox = !this.isSandbox
        },
        setLastResponse(response) {
            this.lastResponse = response
            this.lastError = null
        },
        setLastError(error) {
            this.lastError = error
            this.lastResponse = null
        },
        addSubmittedInvoice(invoice, response) {
            this.submittedInvoices.unshift({
                ...invoice,
                response,
                submittedAt: new Date().toISOString(),
                invoiceNumber: response?.invoiceNumber || null,
                status: response?.validationResponse?.status || 'Unknown',
            })
        },
        addValidatedInvoice(invoice, response) {
            this.validatedInvoices.unshift({
                ...invoice,
                response,
                validatedAt: new Date().toISOString(),
                status: response?.validationResponse?.status || 'Unknown',
            })
        },
        clearHistory() {
            this.submittedInvoices = []
            this.validatedInvoices = []
        },
        loadSampleData() {
            if (!this.submittedInvoices.find(i => i.invoiceNumber === SAMPLE_INVOICE.invoiceNumber))
                this.submittedInvoices.unshift({ ...SAMPLE_INVOICE, submittedAt: new Date().toISOString() })
            if (!this.validatedInvoices.find(i => i.sellerNTNCNIC === SAMPLE_VALIDATED.sellerNTNCNIC))
                this.validatedInvoices.unshift({ ...SAMPLE_VALIDATED, validatedAt: new Date().toISOString() })
        },
    },
})
