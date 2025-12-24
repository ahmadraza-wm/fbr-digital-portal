import { useNuxtApp } from "#app";
import useUiFeedback from "@/composables/useUiFeedback";
import { useRouter } from "vue-router";


export function useComplaints() {

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

  const complaintslist = ref([]);
  const pagination = ref({});
  const comment = ref();

  const filters = ref({
    complaint_id: "",
    customer_id: "",
    status: "",

  });

  const resetFilters = async () => {
    filters.value = {
      complaint_id: "",
      customer_id: "",
      status: "",
    };

    await fetchComplaints()
  };

  const fetchComplaints = async (filters = {}, withPagination = true) => {
    showLoading("Fetching Complaints..");
    try {
      const response = await $axios.get("/complaints", {
        params: {
          ...filters,
          pagination: withPagination,
        },
      });

      if (response.data.success) {
        complaintslist.value = response.data.data.data;
        if (withPagination) {
          pagination.value = response.data.data;
        }
      } else {
        showError("Failed to fetch Complaints");
      }
    } catch (error) {
      console.error(error);
      showError("Something went wrong");
    } finally {
      hideLoading();
    }
  };


  const updateComplaintStatus = async (complaintId, status) => {
    try {
      showLoading("Updating status...");
      console.log('status in composable', status);
      const response = await $axios.patch(`/complaints/status/update/${complaintId}`, {
        status: status
      });
      if (response.data.success) {
        showSuccess("Complaint status updated successfully.");
        await fetchComplaints();

      } else {
        showError("Failed to update complaint status.");
      }
    } catch (error) {
      console.error(error);
      showError("An error occurred while updating status.");
    } finally {
      hideLoading();
    }
  };


  const fetchComplaintById = async (complaintId) => {
    try {
      showLoading("Loading complaint details...");
      const response = await $axios.get(`/complaints/${complaintId}`);
      console.log('fetchbyid response', response.data.data)
      if (response.data.success) {
        return {
          complaint: response.data.data.complaint,
          comments: response.data.data.comments || [],

        };


      } else {
        showError("Failed to fetch complaint details");
        return null;
      }
    } catch (error) {
      console.error(error);
      showError("An error occurred while fetching complaint details");
      return null;
    } finally {
      hideLoading();
    }
  };


  const submitComplainComments = async (complaintId, commentData) => {
    try {
      console.log('comment in composable', commentData);
      showLoading("Submitting Comments...");
      const response = await $axios.post(`/comments/${complaintId}/create`, commentData);

      if (response?.data?.success ?? true) {
        showSuccess("Complaint comment added successfully.");
      }

      return response;
    } catch (error) {
      console.error("Comment post error:", error);
      showError("Failed to add comment");
      throw error;
    }
  };


  const filterComplaints = async (filters = {}) => {
    showLoading("Filtering complaints...");
    try {
      const response = await $axios.get("complaints/search/filter", {
        params: filters,
      });
      if (response.data.success) {
        complaintslist.value = response.data.data.data;
      } else {
        showError("Failed to filter complaints");
      }
    } catch (error) {
      console.error("Filter error:", error);
      showError("Something went wrong while filtering");
    } finally {
      hideLoading();
    }
  };


  return {

    fetchComplaints,
    submitComplainComments,
    comment,
    complaintslist,
    filterComplaints,
    filters,
    resetFilters,
    fetchComplaintById,
    showError,
    pagination,
    updateComplaintStatus,
  }




}    
