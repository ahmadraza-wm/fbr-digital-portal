import { useNuxtApp } from "#app";
import useUiFeedback from "@/composables/useUiFeedback";
import { computed, ref } from "vue";
import { useRoute, useRouter } from "vue-router";

export const useReciver = () => {
    const countryCurrencyStore = useCountryCurrencyStore();
    const { countries, currencies, timezones, nationalities } = storeToRefs(countryCurrencyStore);
    const { $axios } = useNuxtApp();
    const route = useRoute();
    const router = useRouter();
    const selectReciver = ref({});
    const occupationsOptions = ref([]);
    const ReciversData = ref();
    const form = ref({
        first_name: "",
        gender: "",
        relation:"",
        email: "",
        phone_number: "",
        address: "",
        city: "",
        postal_code: "",
        occupation: "",
        country_id: null
    })
    const setReciverForm = (Reciver) => {
    form.value.first_name = Reciver?.name || "";
    form.value.gender = Reciver?.gender || "";
    form.value.email = Reciver?.email || "";
    form.value.phone_number = Reciver?.phone_number || "";
    form.value.address = Reciver?.address || "";
    form.value.relation = Reciver?.relation
    form.value.city = Reciver?.city || "";
    form.value.postal_code = Reciver?.postal_code || "";
    form.value.occupation = Reciver?.occupation || "";
   };
   
    const {
        loading,
        showLoading,
        hideLoading,
        showSuccess,
        showError,
        confirmAction,
    } = useUiFeedback();
    const customersList = ref([]);
    const pagination = ref({});


    const relationships = [
  { id: '1', name: 'Aunt' },
  { id: '2', name: 'Brother' },
  { id: '3', name: 'Brother in law' },
  { id: '4', name: 'Business Associate' },
  { id: '5', name: 'Cousin' },
  { id: '6', name: 'Daughter' },
  { id: '7', name: 'Employee' },
  { id: '8', name: 'Employer' },
  { id: '9', name: 'Father' },
  { id: '10', name: 'Father in Law' },
  { id: '11', name: 'Fiancee' },
  { id: '12', name: 'Friend' },
  { id: '13', name: 'Grand Daughter' },
  { id: '14', name: 'Grand Father' },
  { id: '15', name: 'Grand Mother' },
  { id: '16', name: 'Grand Son' },
  { id: '17', name: 'Husband' },
  { id: '18', name: 'Mother' },
  { id: '19', name: 'Mother in Law' },
  { id: '20', name: 'Nephew' },
  { id: '21', name: 'Niece' },
  { id: '22', name: 'Self' },
  { id: '23', name: 'Service Provider' },
  { id: '24', name: 'Sister' },
  { id: '25', name: 'Sister in Law' },
  { id: '26', name: 'Son' },
  { id: '27', name: 'Uncle' },
  { id: '28', name: 'Wife' },
];


    const filters = ref({
        country_id: "",
        name: "",
    });

    const genderOptions = [
        { value: "male", text: "Male" },
        { value: "female", text: "Female" },
    ];

    const fetchOccupationsList = async (filterParams = {}, withPagination = true) => {
        showLoading("Fetching Occupations...");
        try {
            const response = await $axios.get("/web/occupations/list");
            occupationsOptions.value = response.data.data;

            showSuccess('Occupations Fetched....');

        } catch (error) {
            showError("Error fetching Occupations");
            console.error(error);
        } finally {
            hideLoading();
        }
    };

    const fetchRecivers = async (id,params= {}) => {
        showLoading("Fetching recivers...");

        try {
            const response = await $axios.get(`/agent/customer/beneficiary/list/${id}`,{
            params: params,
          });

            if (response.data.success) {
                showSuccess(response.data.message);
                ReciversData.value = response.data.data;
            }
            else {
                showError(response.data.message);
            }
        } catch (error) {
            showError("Error fetching customers");
            console.error(error);
        } finally {
            hideLoading();
        }
    };


    const createReciver = async (id,payload) => {
        showLoading('Creating Reciver......');
        try {
            const response = await $axios.post(`/agent/customer/beneficiary/create/${id}`, payload)
            if (response.data.success) {
                showSuccess(response.data.message);
                loading.value = false;
            }
            else {
                showError(response.data.message);
            }
            selectReciver.value = response.data.data;
            console.log(selectReciver, "Selected Reciver");
        } catch (error) {
            const messages = error.response?.data?.errors
                ? Object.values(error.response.data.errors).flat()
                : [error.response?.data?.message || 'Something went wrong.']

            showError(messages.join('\n'))
            throw error
        }
    }


    const fetchReciverById = async (id, force_fetch = true) => {
        showLoading("Fetching Recivers...");
        try {
            const response = await $axios.get(`/agent/beneficiary/${id}`, {
                params: { force_fetch },
            });
            if (response.data.success) {
                setReciverForm(response.data.data.beneficiary);
                showSuccess(response.data.message);
            } else {
                showError(response.data.message);
            }
        } catch (error) {
            showError("Error fetching customer");
            return null;
        } finally {
            hideLoading();
        }
    };

    return {
        form,
        createReciver,
        selectReciver,
        fetchOccupationsList,
        genderOptions,
        occupationsOptions,
        customersList,
        pagination,
        fetchReciverById,
        fetchRecivers,
        relationships,
        ReciversData
    };
};
