import { useNuxtApp } from "#app";
import useUiFeedback from "@/composables/useUiFeedback";
import { useRouter } from "vue-router";

const {
    loading,
    showLoading,
    hideLoading,
    showSuccess,
    showError,
    confirmDialog,
    confirmAction,
    closeConfirm,
} = useUiFeedback();

export const useMobileBanner = () => {
    const { $axios } = useNuxtApp();
    const bannerList = ref([]);
    const pagination = ref({});
    const router = useRouter();



    const saveMobileBanner = async (form, id = null) => {
        const isEdit = !!id
        showLoading(isEdit ? 'Updating Banner...' : 'Adding Banner...')

        const formData = new FormData()
        formData.append('title', form.title)
        formData.append('description', form.description)
        formData.append('status', form.status)



        // Attach file if exists
        if (Array.isArray(form.file)) {
            form.file.forEach(f => formData.append('file[]', f))
        } else if (form.file) {
            formData.append('file', form.file)
        }

        try {
            let response
            if (isEdit) {
                response = await $axios.post(`/banners/${id}?_method=PATCH`, formData)
            } else {
                response = await $axios.post(`/banners`, formData)
            }

            if (response.data && (response.data.success || response.status === 201)) {
                showSuccess(response.data.message || (isEdit ? 'Banner updated successfully' : 'Banner saved successfully'))
                await fetchMobileBanner()
            } else {
                throw new Error(response.data?.message || 'Unexpected response format')
            }

            return response.data
        } catch (error) {
            console.error("Error saving Banner:", error)
            const messages = error.response?.data?.errors
                ? Object.values(error.response.data.errors).flat()
                : error.response?.data?.message || "Something went wrong"
            showError(messages)
            throw error
        } finally {
            hideLoading()
        }
    }


    const fetchMobileBanner = async (filters = {}, withPagination = true) => {
    showLoading("Fetching Banners...");
    try {
        const response = await $axios.get("/banners", {
        params: {
            ...filters,
            pagination: withPagination,
        },
        });


        if (response.data.success) {
        if (withPagination && response.data.data.banners?.data) {
            bannerList.value = response.data.data.banners.data.map((item) => ({
            id: item.id ?? "--",
            title: item.title ?? "--",
            description: item.description ?? "--",
            status: item.status ? "Active" : "Inactive",
            created_at: item.created_at ?? "--",
            image: item.media?.[0]?.url ?? "--",
            }));

            pagination.value = response.data.data.banners;
        } else {
            bannerList.value = response.data.data.banners.map((item) => ({
            id: item.id ?? "--",
            title: item.title ?? "--",
            description: item.description ?? "--",
            status: item.status ? "Active" : "Inactive",
            created_at: item.created_at ?? "--",
            image: item.media?.[0]?.url ?? "--",
            }));
        }
            console.log('banners lists', bannerList.value)

        } else {
        showError("Failed to fetch banners.");
        }
    } catch (error) {
        showError("Something went wrong while fetching banners.");
        console.error(error);
    } finally {
        hideLoading();
    }
    };

    const deleteBanner = async (id) => {
        try {
            await $axios.delete(`/banners/${id}`);
            fetchMobileBanner();
            showSuccess("Banner deleted successfully");
        } catch (error) {
            console.error(error);
            showError("Failed to delete banner");
        }
    };
    const confirmDeleteBanner = (id) => {
        confirmAction(
            "Are you sure you want to delete this banner?",
            () => {
                deleteBanner(id);
                closeConfirm();
            }
        );
    };

    return {
        saveMobileBanner,
        fetchMobileBanner,
        bannerList,
        deleteBanner,
        pagination,
        confirmDeleteBanner
    };
}
