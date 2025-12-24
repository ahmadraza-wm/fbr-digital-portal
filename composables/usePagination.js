import { onMounted, ref, watch } from "vue";

export default function usePagination(fetchFunction, options = {}) {
    const pageNo = ref(options.initialPage || 1);
    const itemsPerPage = ref(options.initialPerPage || 10);
    const loading = ref(false);

    const loadPage = async () => {
        loading.value = true;

        try {
            let pagination = itemsPerPage.value !== -1;

            await fetchFunction({
                page: pageNo.value,
                perPage: itemsPerPage.value,
                pagination,
            });
        } catch (error) {
            console.error("Pagination load failed:", error);
        } finally {
            loading.value = false;
        }
    };

    const updateItemsPerPage = (newValue) => {
        itemsPerPage.value = newValue;
        pageNo.value = 1;
        loadPage();
    };

    watch(pageNo, () => {
        loadPage();
    });

    onMounted(() => {
        loadPage();
    });

    return {
        pageNo,
        itemsPerPage,
        updateItemsPerPage,
        loadPage,
        loading,
    };
}
