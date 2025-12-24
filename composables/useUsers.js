import { useNuxtApp } from "#app";
import useUiFeedback from "@/composables/useUiFeedback";
import { ref } from "vue";


const userPermissions = ref({
    assigned_permissions: [],
    unassigned_permissions: [],
});


export function useUsers() {
    const { $axios } = useNuxtApp();
    const router = useRouter();


    const {
        loading,
        showLoading,
        hideLoading,
        showSuccess,
        showError,
    } = useUiFeedback();


    const users = ref([]);
    const pagination = ref([]);

    const singleUser = ref({});



    const formdata = ref({
        first_name: "",
        password: "",
        email: "",
        status: 1,
        password_confirmation: ""
    })

    const formRef = ref('');
    const resetForm = () => {
        if (formRef.value) {
            formRef.value.resetValidation();
        }
        formdata.value = {
            first_name: "",
            password: "",
            email: "",
            status: 1,
            password_confirmation: ""
        }
    }



    const filters = ref({
        name: "",
        email: "",
        status: 'all',




    });

    const resetFilters = () => {
        filters.value = {
            name: "",
            email: "",
            status: 'all',


        };
        fetchUsers();
    };




    const filterUserlist = async (filters = {}) => {
        showLoading("Filtering users...");
        try {
            const response = await $axios.get("/search/filters/backOfficeUser", {
                params: filters,
            });

            if (response.data.success) {
                users.value = response.data.data;
            } else {
                showError("Failed to filter users");
            }
        } catch (error) {
            console.error("Error filtering userlist:", error);
            const messages = error.response?.data?.errors
                ? Object.values(error.response.data.errors).flat()
                : error.response?.data?.message || "Something went wrong";
            showError(messages);
        } finally {
            hideLoading();
        }
    };


    const fetchUserPermissions = async (userId) => {
        showLoading("Fetching permissions...");
        try {
            const response = await $axios.get(`/permissions/${userId}`);
            if (response.data.success) {
                userPermissions.value = response.data.data;
            } else {
                showError("Failed to fetch permissions");
            }
        } catch (error) {
            console.error("Error fetching user permissions:", error);
            showError("Something went wrong while fetching permissions");
        } finally {
            hideLoading();
        }
    };




    const fetchUserById = async (id) => {
        showLoading("Fetching user...");
        try {
            const response = await $axios.get(`/backOfficeUsers/${id}`);
            if (response.data.success) {
                singleUser.value = response.data.data;
            } else {
                showError("User not found");
            }
        } catch (error) {
            console.error("Error fetching user by ID:", error);
            showError("Something went wrong while fetching user");
        } finally {
            hideLoading();
        }
    };




    const fetchUsers = async (filters = {}, withPagination = true) => {
        showLoading("Fetching users...");
        try {
            const response = await $axios.get("/backOfficeUsers", {
                params: {
                    ...filters,
                    pagination: withPagination,
                },
            });

            if (response.data.success) {
                users.value = response.data.data.data;
                if (withPagination) {
                    pagination.value = response.data.data;
                }
            } else {
                showError("Failed to fetch users");
            }
        } catch (error) {
            console.error(error);
            showError("Something went wrong");
        } finally {
            hideLoading();
        }
    };




    const registerUser = async () => {
        showLoading("Registering user...");
        try {
            const response = await $axios.post("/register/backoffice/user", formdata.value);

            if (response.data.success) {
                showSuccess("User registered successfully!");
                setTimeout(() => router.push("/users/list"), 1500);
            } else {
                showError("User registration failed");
            }
        } catch (error) {
            console.error("Registration error:", error);
            const messages = error.response?.data?.errors
                ? Object.values(error.response.data.errors).flat()
                : error.response?.data?.message || "Something went wrong";
            showError(messages);
        } finally {
            hideLoading();
        }
    };


    const updateUser = async (userId) => {
        showLoading("Updating user...");
        try {
            const payload = { ...formdata.value };
            if (!payload.password) {
                delete payload.password;
                delete payload.password_confirmation;
            }
            const response = await $axios.patch(`/backOfficeUser/${userId}`, payload);
            if (response.data.success) {
                showSuccess("User updated successfully!");
                await fetchUserById(userId);
                router.push("/users/list");
            } else {
                showError("User update failed");
            }
        } catch (error) {
            console.error("Update error:", error);
            const messages = error.response?.data?.errors
                ? Object.values(error.response.data.errors).flat()
                : error.response?.data?.message || "Something went wrong";
            showError(messages);
        } finally {
            hideLoading();
        }
    };

    return {
        registerUser,
        updateUser,
        fetchUserById,
        singleUser,
        formdata,
        resetForm,
        loading,
        users,
        filterUserlist,
        fetchUsers,
        filters,
        resetFilters,
        formRef,
        pagination,
        fetchUserPermissions,
        userPermissions,



    };



}
