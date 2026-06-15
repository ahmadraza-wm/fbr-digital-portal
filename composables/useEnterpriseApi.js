/**
 * Enterprise API composable
 * Uses $axios (same pattern as auth.js)
 * All endpoints require Bearer token (admin/user)
 */
export const useEnterpriseApi = () => {
    const { $axios } = useNuxtApp()

    // ── Companies ─────────────────────────────────────────────────────────────
    const getCompanies = (params = {}) => $axios.get('/companies', { params })
    const getCompany = id => $axios.get(`/companies/${id}`)
    const createCompany = data => $axios.post('/companies', data)
    const updateCompany = (id, data) => $axios.post(`/companies/${id}?_method=PUT`, data)
    const deleteCompany = id => $axios.delete(`/companies/${id}`)

    // ── Users ──────────────────────────────────────────────────────────────────
    const getUsers = (params = {}) => $axios.get('/users', { params })
    const getUser = id => $axios.get(`/users/${id}`)
    const createUser = data => $axios.post('/users', data)
    const updateUser = (id, data) => $axios.put(`/users/${id}`, data)
    const deleteUser = id => $axios.delete(`/users/${id}`)

    // ── Customers ──────────────────────────────────────────────────────────────
    const getCustomers = (params = {}) => $axios.get('/customers', { params })
    const getCustomer = id => $axios.get(`/customers/${id}`)
    const createCustomer = data => $axios.post('/customers', data)
    const updateCustomer = (id, data) => $axios.put(`/customers/${id}`, data)
    const deleteCustomer = id => $axios.delete(`/customers/${id}`)

    // ── Products ───────────────────────────────────────────────────────────────
    const getProducts = (params = {}) => $axios.get('/products', { params })
    const getProduct = id => $axios.get(`/products/${id}`)
    const createProduct = data => $axios.post('/products', data)
    const updateProduct = (id, data) => $axios.put(`/products/${id}`, data)
    const deleteProduct = id => $axios.delete(`/products/${id}`)

    // ── FBR Token (admin only) ─────────────────────────────────────────────────
    const getFbrToken = companyId => $axios.get(`/companies/${companyId}/fbr-token`)
    const saveFbrToken = (companyId, token) => $axios.post(`/companies/${companyId}/fbr-token`, { fbr_token: token })

    return {
        // Companies
        getCompanies, getCompany, createCompany, updateCompany, deleteCompany,
        // Users
        getUsers, getUser, createUser, updateUser, deleteUser,
        // Customers
        getCustomers, getCustomer, createCustomer, updateCustomer, deleteCustomer,
        // Products
        getProducts, getProduct, createProduct, updateProduct, deleteProduct,
        // FBR Token
        getFbrToken, saveFbrToken,
    }
}
