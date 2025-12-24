import { useNuxtApp } from '#app';
import { ref } from 'vue';

export function usePaginatedTable(apiEndpoint, initialOptions = {}) {
    const items = ref([]);
    const total = ref(0);
    const loading = ref(false);

    const options = ref({
        page: 1,
        itemsPerPage: 10,
        ...initialOptions,
    });

    const fetchData = async (newOptions = options.value) => {
        options.value = newOptions;
        loading.value = true;

        const { $axios } = useNuxtApp();

        try {
            const { page, itemsPerPage } = newOptions;

            const res = await $axios.get(apiEndpoint, {
                params: { page, per_page: itemsPerPage },
            });

            items.value = res.data?.data?.data || [];
            total.value = res.data?.total;



        } finally {
            loading.value = false;
        }
    };

    return {
        items,
        total,
        loading,
        options,
        fetchData,
    };
}
