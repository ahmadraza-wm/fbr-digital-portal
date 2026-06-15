/**
 * FBR PRAL Digital Invoicing API Composable
 * Handles all communication with FBR DI API endpoints
 * Security token is passed as Bearer in Authorization header
 */
export const useFbrApi = () => {
    const config = useRuntimeConfig()

    // FBR API base URLs
    const FBR_BASE = 'https://gw.fbr.gov.pk'
    const DI_BASE = `${FBR_BASE}/di_data/v1/di`
    const REF_BASE = `${FBR_BASE}/pdi`
    const DIST_BASE = `${FBR_BASE}/dist/v1`

    // Token stored in cookie (issued by PRAL, valid 5 years)
    const fbrToken = useCookie('fbrToken')

    const getHeaders = () => ({
        Authorization: fbrToken.value ? `Bearer ${fbrToken.value}` : '',
        'Content-Type': 'application/json',
    })

    // ─── Invoice APIs ────────────────────────────────────────────────────────────

    /**
     * POST invoice data to FBR (production)
     * POST /di_data/v1/di/postinvoicedata
     */
    const postInvoice = async (payload) => {
        return await $fetch(`${DI_BASE}/postinvoicedata`, {
            method: 'POST',
            headers: getHeaders(),
            body: payload,
        })
    }

    /**
     * POST invoice data to FBR (sandbox)
     * POST /di_data/v1/di/postinvoicedata_sb
     */
    const postInvoiceSandbox = async (payload) => {
        return await $fetch(`${DI_BASE}/postinvoicedata_sb`, {
            method: 'POST',
            headers: getHeaders(),
            body: payload,
        })
    }

    /**
     * Validate invoice data (production)
     * POST /di_data/v1/di/validateinvoicedata
     */
    const validateInvoice = async (payload) => {
        return await $fetch(`${DI_BASE}/validateinvoicedata`, {
            method: 'POST',
            headers: getHeaders(),
            body: payload,
        })
    }

    /**
     * Validate invoice data (sandbox)
     * POST /di_data/v1/di/validateinvoicedata_sb
     */
    const validateInvoiceSandbox = async (payload) => {
        return await $fetch(`${DI_BASE}/validateinvoicedata_sb`, {
            method: 'POST',
            headers: getHeaders(),
            body: payload,
        })
    }

    // ─── Reference APIs ──────────────────────────────────────────────────────────

    const getProvinces = async () => {
        return await $fetch(`${REF_BASE}/v1/provinces`, { headers: getHeaders() })
    }

    const getDocTypes = async () => {
        return await $fetch(`${REF_BASE}/v1/doctypecode`, { headers: getHeaders() })
    }

    const getItemCodes = async () => {
        return await $fetch(`${REF_BASE}/v1/itemdesccode`, { headers: getHeaders() })
    }

    const getSroItemCodes = async () => {
        return await $fetch(`${REF_BASE}/v1/sroitemcode`, { headers: getHeaders() })
    }

    const getTransactionTypes = async () => {
        return await $fetch(`${REF_BASE}/v1/transtypecode`, { headers: getHeaders() })
    }

    const getUomList = async () => {
        return await $fetch(`${REF_BASE}/v1/uom`, { headers: getHeaders() })
    }

    const getSroSchedule = async (rateId, date, originationSupplierCsv) => {
        return await $fetch(
            `${REF_BASE}/v1/SroSchedule?rate_id=${rateId}&date=${date}&origination_supplier_csv=${originationSupplierCsv}`,
            { headers: getHeaders() },
        )
    }

    const getRates = async (date, transTypeId, originationSupplier) => {
        return await $fetch(
            `${REF_BASE}/v2/SaleTypeToRate?date=${date}&transTypeId=${transTypeId}&originationSupplier=${originationSupplier}`,
            { headers: getHeaders() },
        )
    }

    const getHsUom = async (hsCode, annexureId) => {
        return await $fetch(
            `${REF_BASE}/v2/HS_UOM?hs_code=${hsCode}&annexure_id=${annexureId}`,
            { headers: getHeaders() },
        )
    }

    const getSroItems = async (date, sroId) => {
        return await $fetch(
            `${REF_BASE}/v2/SROItem?date=${date}&sro_id=${sroId}`,
            { headers: getHeaders() },
        )
    }

    // ─── STATL APIs ──────────────────────────────────────────────────────────────

    const checkStatl = async (regno, date) => {
        return await $fetch(`${DIST_BASE}/statl`, {
            method: 'POST',
            headers: getHeaders(),
            body: { regno, date },
        })
    }

    const getRegType = async (registrationNo) => {
        return await $fetch(`${DIST_BASE}/Get_Reg_Type`, {
            method: 'POST',
            headers: getHeaders(),
            body: { Registration_No: registrationNo },
        })
    }

    return {
        fbrToken,
        postInvoice,
        postInvoiceSandbox,
        validateInvoice,
        validateInvoiceSandbox,
        getProvinces,
        getDocTypes,
        getItemCodes,
        getSroItemCodes,
        getTransactionTypes,
        getUomList,
        getSroSchedule,
        getRates,
        getHsUom,
        getSroItems,
        checkStatl,
        getRegType,
    }
}
