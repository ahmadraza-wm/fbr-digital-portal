import { useNuxtApp } from "#app";
import useUiFeedback from "@/composables/useUiFeedback";
import { reactive, ref } from 'vue';
import { useRouter } from "vue-router";


export function useCustomerCoupon() {

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

  const customersList = ref([]);
  const customercoupons = ref([]);
  const pagination = ref({});
  const selectedCustomers = ref([]);



  const formKey = ref(null)




  const form = reactive({
    sending_country_id: "",
    receiving_country_id: "",
    sending_methods: "",
    receiving_methods: "",
    coupon_code: '',
    customer_status: "",
    discount_applied: "full_amount",
    discount_type: "",
    discount_value: "",
    signup_from: "",
    signup_to: "",
    min_sending_amount: '',
    starts_at: "",
    expires_at: "",
  })


  const filterscustomer = ref({
    customer_id: "",
    country_id: "all",
    receiving_country_id: "all",
    from: "",
    to: "",
  });

  const resetCustomerFilters = async () => {
    filterscustomer.value = {
      customer_id: null,
      country_id: 'all',
      receiving_country_id: 'all',
      from: null,
      to: null,
    };
    customersList.value = []
    selectedCustomers.value = []
    await fetchCustomers()
  };

  const resetForm = () => {
    Object.keys(form).forEach(key => {
      if (key === 'discount') {
        form[key] = 1
      } else {
        form[key] = (typeof form[key] === 'string') ? '' : null
      }
    })
    formKey.value += 1
  }



  const fetchCustomerCoupons = async (filterParams = {}, withPagination = true) => {
    showLoading("Fetching Customer Coupons...");

    try {
      const response = await $axios.get("/coupons/list", {
        params: {
          ...filterParams,
          pagination: withPagination,
        },
      });

      if (response.data.success) {
        console.log(response.data);

        const coupons = withPagination
          ? response.data.data.coupons.data
          : response.data.data.coupons;

        customercoupons.value = coupons.map((item) => ({
          id: item.id,
          coupon_code: item.coupon_code ?? "-",
          customer_names: item.customer_names ?? "-",
          sending_country: item.sending_country ?? "-",
          receiving_country: item.receiving_country ?? "-",
          sending_methods: item.sending_methods ?? "-",
          receiving_methods: item.receiving_methods ?? "-",
          discount_type: item.discount_type ?? "-",
          discount_value: item.discount_value ?? "-",
          min_sending_amount: item.min_sending_amount ?? "-",
          starts_at: item.starts_at,
          expires_at: item.expires_at,
        }));

        if (withPagination) {
          pagination.value = response.data.data.coupons; // ✅ fix wrong key
        }
      } else {
        showError("Failed to fetch customer coupons");
      }
    } catch (error) {
      console.error(error);
      showError("Error fetching customer coupons");
    } finally {
      hideLoading();
    }
  };




  const filterCustomerCoupons = async (filters = {}) => {
    showLoading("Fetching Customer Coupons...");

    try {
      const response = await $axios.get("/search/filters/coupons", { params: filters });

      if (response.data.success) {
        // Assuming response.data.data is an array of coupons
        const coupons = response.data.data;
        customercoupons.value = coupons.map((item) => ({
          id: item.id,
          coupon_code: item.coupon_code ?? "-",
          customer_names: item.customer_names ?? "-",
          sending_country: item.sending_country ?? "-",
          receiving_country: item.receiving_country ?? "-",
          sending_methods: item.sending_methods ?? "-",
          receiving_methods: item.receiving_methods ?? "-",
          discount_type: item.discount_type ?? "-",
          discount_value: item.discount_value ?? "-",
          min_sending_amount: item.min_sending_amount ?? "-",
          starts_at: item.starts_at,
          expires_at: item.expires_at,
        }));
        if (withPagination) {
          pagination.value = response.data.data.beneficiaries;
        }
      } else {
        showError("Failed to filter customer coupons");
      }
    } catch (error) {
      console.error(error);
      showError("Error fetching customer coupons");
    } finally {
      hideLoading();
    }
  };




  const fetchCustomers = async (filterParams = {}) => {
    showLoading("Fetching customers...");

    try {
      const response = await $axios.get("/customers/list", {
        params: filterParams,
      });

      if (response.data.success) {
        customersList.value = response.data.data.data;
        customersList.value = response.data.data.data.map((item, index) => ({
          id: item.id,
          customer_id: item.id,
          fullName: item.user?.name ?? "-",
          email: item.user?.email ?? "-",
          phone: item.phone_number ?? "-",
          receiving_country_id: item.receiving_country?.name ?? "-",
          sending_country_id: item.sending_country?.name ?? "-",
          created_at: item.created_at,
        }));
      } else {
        showError("Failed to fetch customers");
      }
    } catch (error) {
      showError("Error fetching customers");
      console.error(error);
    } finally {
      hideLoading();
    }
  };






  const fetchCustomersFilters = async (filterParams = {}) => {
    showLoading("Fetching customers...");

    try {
      const response = await $axios.get("/search/filters/customer", {
        params: filterParams,
      });


      if (response.data.success) {
        customersList.value = response.data.data.data.map((item, index) => ({
          id: item.id,
          customer_id: item.id,
          fullName: item.user?.name ?? "-",
          email: item.user?.email ?? "-",
          phone: item.phone_number ?? "-",
          receiving_country_id: item.receiving_country?.name ?? "-",
          sending_country_id: item.sending_country?.name ?? "-",
          created_at: item.created_at,


        }));
      } else {
        showError("Failed to fetch customers");
      }
    } catch (error) {
      showError("Error fetching customers");
      console.error(error);
    } finally {
      hideLoading();
    }
  };





  const saveCustomerCoupon = async (form, selectedCustomers = []) => {
    showLoading("Saving CustomerCoupon...");
    try {
      const formData = new FormData();

      // Append all other form fields
      formData.append("sending_country_id", form.sending_country_id);
      formData.append("receiving_country_id", form.receiving_country_id);
      formData.append("sending_methods", form.sending_methods);
      formData.append("receiving_methods", form.receiving_methods);
      formData.append("coupon_code", form.coupon_code);
      formData.append("customer_status", form.customer_status);
      formData.append("discount_applied", form.discount_applied);
      formData.append("discount_type", form.discount_type);
      formData.append("discount_value", form.discount_value);
      formData.append("signup_from", form.signup_from);
      formData.append("signup_to", form.signup_to);
      formData.append("min_sending_amount", form.min_sending_amount);
      formData.append("starts_at", form.starts_at);
      formData.append("expires_at", form.expires_at);

      // Add selected customers if any
      if (selectedCustomers.length > 0) {
        selectedCustomers.forEach((customerId, index) => {
          formData.append(`customers[${index}]`, customerId);
        });
      }

      const response = await $axios.post("/coupons/create", formData);

      if (response.status === 200 || response.status === 201) {
        showSuccess("Customer Coupon Created successfully!");
        setTimeout(() => router.push("/customers/coupons-list"), 1500);
      }
    } catch (error) {
      console.error("CustomerCoupon:", error);
      const messages = error.response?.data?.errors
        ? Object.values(error.response.data.errors).flat()
        : error.response?.data?.message || "Something went wrong";
      showError(messages);
    } finally {
      hideLoading();
    }
  };



  const deleteCoupon = async (id) => {

    showLoading("Deleting coupon...");
    try {
      const response = await $axios.delete(`/coupon/delete/${id}`);
      if (response.data.success) {
        showSuccess("Coupon deleted successfully");
        await fetchCustomerCoupons();
      } else {
        showError("Failed to delete coupon");
      }
    } catch (error) {
      console.error(error);
      showError("An error occurred while deleting the coupon");
    } finally {
      hideLoading();
    }
  };

  return {
    form,
    fetchCustomers,
    fetchCustomerCoupons,
    filterCustomerCoupons,
    customercoupons,
    filterscustomer,
    formKey,
    pagination,
    deleteCoupon,
    resetCustomerFilters,
    fetchCustomersFilters,
    customersList,
    saveCustomerCoupon,
    selectedCustomers,
    resetForm

  }

} 
