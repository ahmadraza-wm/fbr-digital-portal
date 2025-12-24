import { useRuntimeConfig } from "#app";
import { defineStore } from "pinia";
import { ref } from "vue";

export const useCountryCurrencyStore = defineStore("countryCurrency", () => {
  const countries = ref([]);
  const currencies = ref([]);

  const countriesList = ref([]);
  const currenciesList = ref([]);
  const pagination = ref([]);
  const timezones = ref([]);
  const nationalities = ref([]);
  const sending_countries = ref([]);
  const receiving_countries = ref([]);
  const loading = ref(false);
  const error = ref(null);

  const { $axios } = useNuxtApp();
  const config = useRuntimeConfig();

  const timezonesArray = async () => {
    timezones.value = [
      { title: "UTC−12:00", value: "UTC−12:00" },
      { title: "UTC−11:00", value: "UTC−11:00" },
      { title: "UTC−10:00", value: "UTC−10:00" },
      { title: "UTC−09:00", value: "UTC−09:00" },
      { title: "UTC−08:00", value: "UTC−08:00" },
      { title: "UTC−07:00", value: "UTC−07:00" },
      { title: "UTC−06:00", value: "UTC−06:00" },
      { title: "UTC−05:00", value: "UTC−05:00" },
      { title: "UTC−04:00", value: "UTC−04:00" },
      { title: "UTC−03:00", value: "UTC−03:00" },
      { title: "UTC−02:00", value: "UTC−02:00" },
      { title: "UTC−01:00", value: "UTC−01:00" },
      { title: "UTC±00:00", value: "UTC±00:00" },
      { title: "UTC+01:00", value: "UTC+01:00" },
      { title: "UTC+02:00", value: "UTC+02:00" },
      { title: "UTC+03:00", value: "UTC+03:00" },
      { title: "UTC+04:00", value: "UTC+04:00" },
      { title: "UTC+05:00", value: "UTC+05:00" },
      { title: "UTC+06:00", value: "UTC+06:00" },
      { title: "UTC+07:00", value: "UTC+07:00" },
      { title: "UTC+08:00", value: "UTC+08:00" },
      { title: "UTC+09:00", value: "UTC+09:00" },
      { title: "UTC+10:00", value: "UTC+10:00" },
      { title: "UTC+11:00", value: "UTC+11:00" },
      { title: "UTC+12:00", value: "UTC+12:00" },
      { title: "UTC+13:00", value: "UTC+13:00" },
      { title: "UTC+14:00", value: "UTC+14:00" }
    ];
  };

  const nationalityArray = async () => {
    nationalities.value = [
      { title: "Afghan", value: "Afghan" },
      { title: "Albanian", value: "Albanian" },
      { title: "Algerian", value: "Algerian" },
      { title: "American", value: "American" },
      { title: "Andorran", value: "Andorran" },
      { title: "Angolan", value: "Angolan" },
      { title: "Argentine", value: "Argentine" },
      { title: "Armenian", value: "Armenian" },
      { title: "Australian", value: "Australian" },
      { title: "Austrian", value: "Austrian" },
      { title: "Azerbaijani", value: "Azerbaijani" },
      { title: "Bahraini", value: "Bahraini" },
      { title: "Bangladeshi", value: "Bangladeshi" },
      { title: "Barbadian", value: "Barbadian" },
      { title: "Belarusian", value: "Belarusian" },
      { title: "Belgian", value: "Belgian" },
      { title: "Belizean", value: "Belizean" },
      { title: "Beninese", value: "Beninese" },
      { title: "Bhutanese", value: "Bhutanese" },
      { title: "Bolivian", value: "Bolivian" },
      { title: "Bosnian", value: "Bosnian" },
      { title: "Brazilian", value: "Brazilian" },
      { title: "British", value: "British" },
      { title: "Bruneian", value: "Bruneian" },
      { title: "Bulgarian", value: "Bulgarian" },
      { title: "Burkinabe", value: "Burkinabe" },
      { title: "Burmese", value: "Burmese" },
      { title: "Burundian", value: "Burundian" },
      { title: "Cambodian", value: "Cambodian" },
      { title: "Cameroonian", value: "Cameroonian" },
      { title: "Canadian", value: "Canadian" },
      { title: "Cape Verdean", value: "Cape Verdean" },
      { title: "Central African", value: "Central African" },
      { title: "Chadian", value: "Chadian" },
      { title: "Chilean", value: "Chilean" },
      { title: "Chinese", value: "Chinese" },
      { title: "Colombian", value: "Colombian" },
      { title: "Congolese", value: "Congolese" },
      { title: "Costa Rican", value: "Costa Rican" },
      { title: "Croatian", value: "Croatian" },
      { title: "Cuban", value: "Cuban" },
      { title: "Cypriot", value: "Cypriot" },
      { title: "Czech", value: "Czech" },
      { title: "Danish", value: "Danish" },
      { title: "Djiboutian", value: "Djiboutian" },
      { title: "Dominican", value: "Dominican" },
      { title: "Dutch", value: "Dutch" },
      { title: "Ecuadorian", value: "Ecuadorian" },
      { title: "Egyptian", value: "Egyptian" },
      { title: "Emirati", value: "Emirati" },
      { title: "English", value: "English" },
      { title: "Equatorial Guinean", value: "Equatorial Guinean" },
      { title: "Eritrean", value: "Eritrean" },
      { title: "Estonian", value: "Estonian" },
      { title: "Ethiopian", value: "Ethiopian" },
      { title: "Fijian", value: "Fijian" },
      { title: "Finnish", value: "Finnish" },
      { title: "French", value: "French" },
      { title: "Gabonese", value: "Gabonese" },
      { title: "Gambian", value: "Gambian" },
      { title: "Georgian", value: "Georgian" },
      { title: "German", value: "German" },
      { title: "Ghanaian", value: "Ghanaian" },
      { title: "Greek", value: "Greek" },
      { title: "Guatemalan", value: "Guatemalan" },
      { title: "Guinean", value: "Guinean" },
      { title: "Haitian", value: "Haitian" },
      { title: "Honduran", value: "Honduran" },
      { title: "Hungarian", value: "Hungarian" },
      { title: "Icelandic", value: "Icelandic" },
      { title: "Indian", value: "Indian" },
      { title: "Indonesian", value: "Indonesian" },
      { title: "Iranian", value: "Iranian" },
      { title: "Iraqi", value: "Iraqi" },
      { title: "Irish", value: "Irish" },
      { title: "Israeli", value: "Israeli" },
      { title: "Italian", value: "Italian" },
      { title: "Ivorian", value: "Ivorian" },
      { title: "Jamaican", value: "Jamaican" },
      { title: "Japanese", value: "Japanese" },
      { title: "Jordanian", value: "Jordanian" },
      { title: "Kazakh", value: "Kazakh" },
      { title: "Kenyan", value: "Kenyan" },
      { title: "Kuwaiti", value: "Kuwaiti" },
      { title: "Kyrgyz", value: "Kyrgyz" },
      { title: "Laotian", value: "Laotian" },
      { title: "Latvian", value: "Latvian" },
      { title: "Lebanese", value: "Lebanese" },
      { title: "Liberian", value: "Liberian" },
      { title: "Libyan", value: "Libyan" },
      { title: "Lithuanian", value: "Lithuanian" },
      { title: "Luxembourgish", value: "Luxembourgish" },
      { title: "Malagasy", value: "Malagasy" },
      { title: "Malaysian", value: "Malaysian" },
      { title: "Malian", value: "Malian" },
      { title: "Maltese", value: "Maltese" },
      { title: "Mauritanian", value: "Mauritanian" },
      { title: "Mauritian", value: "Mauritian" },
      { title: "Mexican", value: "Mexican" },
      { title: "Moldovan", value: "Moldovan" },
      { title: "Mongolian", value: "Mongolian" },
      { title: "Moroccan", value: "Moroccan" },
      { title: "Mozambican", value: "Mozambican" },
      { title: "Namibian", value: "Namibian" },
      { title: "Nepalese", value: "Nepalese" },
      { title: "Dutch (Netherlands)", value: "Dutch" },
      { title: "New Zealander", value: "New Zealander" },
      { title: "Nicaraguan", value: "Nicaraguan" },
      { title: "Nigerian", value: "Nigerian" },
      { title: "North Korean", value: "North Korean" },
      { title: "Norwegian", value: "Norwegian" },
      { title: "Omani", value: "Omani" },
      { title: "Pakistani", value: "Pakistani" },
      { title: "Palestinian", value: "Palestinian" },
      { title: "Panamanian", value: "Panamanian" },
      { title: "Paraguayan", value: "Paraguayan" },
      { title: "Peruvian", value: "Peruvian" },
      { title: "Philippine", value: "Philippine" },
      { title: "Polish", value: "Polish" },
      { title: "Portuguese", value: "Portuguese" },
      { title: "Qatari", value: "Qatari" },
      { title: "Romanian", value: "Romanian" },
      { title: "Russian", value: "Russian" },
      { title: "Rwandan", value: "Rwandan" },
      { title: "Saudi", value: "Saudi" },
      { title: "Scottish", value: "Scottish" },
      { title: "Senegalese", value: "Senegalese" },
      { title: "Serbian", value: "Serbian" },
      { title: "Singaporean", value: "Singaporean" },
      { title: "Slovak", value: "Slovak" },
      { title: "Slovenian", value: "Slovenian" },
      { title: "Somali", value: "Somali" },
      { title: "South African", value: "South African" },
      { title: "South Korean", value: "South Korean" },
      { title: "Spanish", value: "Spanish" },
      { title: "Sri Lankan", value: "Sri Lankan" },
      { title: "Sudanese", value: "Sudanese" },
      { title: "Swazi", value: "Swazi" },
      { title: "Swedish", value: "Swedish" },
      { title: "Swiss", value: "Swiss" },
      { title: "Syrian", value: "Syrian" },
      { title: "Taiwanese", value: "Taiwanese" },
      { title: "Tajik", value: "Tajik" },
      { title: "Tanzanian", value: "Tanzanian" },
      { title: "Thai", value: "Thai" },
      { title: "Togolese", value: "Togolese" },
      { title: "Tunisian", value: "Tunisian" },
      { title: "Turkish", value: "Turkish" },
      { title: "Ugandan", value: "Ugandan" },
      { title: "Ukrainian", value: "Ukrainian" },
      { title: "Uruguayan", value: "Uruguayan" },
      { title: "Uzbek", value: "Uzbek" },
      { title: "Venezuelan", value: "Venezuelan" },
      { title: "Vietnamese", value: "Vietnamese" },
      { title: "Welsh", value: "Welsh" },
      { title: "Yemeni", value: "Yemeni" },
      { title: "Zambian", value: "Zambian" },
      { title: "Zimbabwean", value: "Zimbabwean" }
    ];
  };

  const fetchSendingCountries = async () => {
    const response = await $axios.get(`get/sending/countries`);
    sending_countries.value = response.data.data;
  };

  const fetchReceivingCountries = async () => {
    const response = await $axios.get(`/get/receiving/countries`);
    receiving_countries.value = response.data.data;
    pagination.value = response.data.data;

  };

  const fetchCountries = async (filters = {}) => {
    const response = await $axios.get(`/get/countries/list`, {
      params: { ...filters, pagination: false },
    });
    countries.value = response.data.data;
  };

  const fetchCurrencies = async (filters = {}) => {
    const response = await $axios.get(`/get/currencies/list`, {
      params: { ...filters, pagination: false },
    });
    currencies.value = response.data.data;
  };


  const fetchCountriesList = async (filters = {}) => {
    const response = await $axios.get(`/get/countries/list`, {
      params: filters,
    });
    countriesList.value = response.data.data.data;
    pagination.value = response.data.data;

  };

  const fetchCurrenciesList = async (filters = {}) => {
    const response = await $axios.get(`/get/currencies/list`, {
      params: filters,
    });
    currenciesList.value = response.data.data.data;
    pagination.value = response.data.data;

  };

  const autoInit = async () => {
    loading.value = true;
    try {
      await Promise.all([
        fetchCountries(),
        fetchCurrencies(),
        fetchSendingCountries(),
        fetchReceivingCountries(),
        timezonesArray(),
        nationalityArray(),
      ]);

    } catch (err) {
      error.value = "Failed to fetch data";
    } finally {
      loading.value = false;
    }
  };

  autoInit();
  return {
    countries,
    currencies,
    countriesList,
    currenciesList,
    pagination,
    sending_countries,
    receiving_countries,
    timezones,
    nationalities,
    fetchCountries,
    fetchCurrencies,
    fetchCountriesList,
    fetchCurrenciesList,
    fetchSendingCountries,
    fetchReceivingCountries,
    loading,
    error,
  };
});
