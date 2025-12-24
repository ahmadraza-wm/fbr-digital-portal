import { useNuxtApp } from "#app";
import useUiFeedback from "@/composables/useUiFeedback";
import { useRouter } from "vue-router";


export function usePushNotification() {

  const { $axios } = useNuxtApp();
  const router = useRouter();


  const {
    loading,
    showLoading,
    hideLoading,
    showSuccess,
    showError,
    confirmAction,
  } = useUiFeedback();



  const notificationlists = ref([]);
  const pagination = ref({});



  const tokenCount = ref(0)
  const searchDetail = ref(false)


  const filters = ref({

    customer_id: null,
    sending_country_id: [],
    receiving_country_id: [],
    customer_register_from: null,
    customer_register_to: null,
    status: "all",


  })

  const formdata = ref({
    title: '',
    body: '',
  })


  const fetchNotifications = async (filters = {}, withPagination = true) => {
    try {
      showLoading();
      const res = await $axios.get("/push/notifications", {
        params: {
          ...filters,
          pagination: withPagination,
        },
      });

      if (res.data.success) {
        notificationlists.value = res.data.data.data;
        if (withPagination) {
          pagination.value = res.data.data;
        }
      } else {
        showError("Failed to fetch push notifications.");
      }
    } catch (error) {
      const messages = error.res?.data?.errors
        ? Object.values(error.res.data.errors).flat()
        : error.res?.data?.message || "An error occurred.";
      showError(messages);
    } finally {
      hideLoading();
    }
  };

  const getTokenCount = async () => {
    try {
      showLoading()

      const payload = {
        customer_id: filters.value.customer_id,
        sending_country_id: filters.value.sending_country_id,
        receiving_country_id: filters.value.receiving_country_id,
        customer_register_from: filters.value.customer_register_from,
        customer_register_to: filters.value.customer_register_to,
      }


      if (filters.value.status !== null && filters.value.status !== 'all') {
        payload.status = filters.value.status;
      }

      console.log('payload', payload);
      const res = await $axios.post('/push/notifications/get/tokens', payload)

      if (res?.data?.success) {
        tokenCount.value = res.data.data.token_count
        console.log('device total count', tokenCount.value);

        searchDetail.value = true
      } else {
        showError('Failed to fetch token count.')
      }

    } catch (error) {
      const messages = error.response?.data?.errors
        ? Object.values(error.response.data.errors).flat()
        : error.response?.data?.message || "An error occurred.";
      showError(messages);
    } finally {
      hideLoading()
    }
  }


  const sendPushNotification = async () => {
    try {
      showLoading();

      const payload = {
        ...filters.value,
        title: formdata.value.title,
        body: formdata.value.body,
      };

      if (payload.status === "all") {
        delete payload.status;
      }



      const res = await $axios.post('/push/notifications/send', payload);
      console.log('sending response', res)

      if (res?.data?.success) {
        showSuccess(res.data.message || 'Push notification sent successfully');
        setTimeout(() => router.push("/promotions/push-notifications"), 1500);
        // Optionally refresh notifications list
        //   await fetchNotifications();
      } else {
        showError(res.data.message || 'Failed to send notification');
      }
    } catch (error) {
      const messages = error.response?.data?.errors
        ? Object.values(error.response.data.errors).flat()
        : error.response?.data?.message || "An error occurred.";
      showError(messages);
    } finally {
      hideLoading();
    }
  };



  return {
    searchDetail,
    formdata,
    loading,
    filters,
    getTokenCount,
    tokenCount,
    fetchNotifications,
    notificationlists,
    pagination,
    sendPushNotification
  }



}   
