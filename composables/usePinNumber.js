import { useNuxtApp } from '#app'
import useUiFeedback from '@/composables/useUiFeedback'

export const usePinNumber = () => {
    const { $axios } = useNuxtApp()
    const { showLoading, hideLoading, showError, showSuccess } = useUiFeedback()


/*change pin number */
    const changePinStatus = async (data) => {
        showLoading()
        try {
            const res = await $axios.patch('/change/pins', data)
            showSuccess('Pin Number Change successfully')
            return true;
        }
        catch (error) {
            console.error(error);
            if (error.response && error.response.data) {
                const responseData = error.response.data;
                if (responseData.errors) {
                    const allErrors = Object.values(responseData.errors).flat();
                    const combinedErrors = allErrors.join('\n');
                    showError(combinedErrors);
                } else if (responseData.message) {
                    showError(responseData.message);
                } else {
                    showError("Something went wrong.");
                }
            } else {
                showError(error.message || "Network error occurred.");
            }
        }


        finally {
            hideLoading()
        }
    }
    const replacePinNumber = async (data) => {
        showLoading()
        try {
            const res = await $axios.patch('/replace/pins', data)
            showSuccess('Pin Number replace successfully');
            alert.value = false
            return res.data
        } catch (err) {
            console.error('Patch error:', err)
            showError(err?.response?.data?.message ?? 'Failed to replace Pin Number')
        } finally {
            hideLoading()
        }
    }
    const resolveStatusVariant = (status_value) => {
        const variants = {
            incomplete: {
                color: "#FFFFFF",
                background: "#FF5733", // Bright Red
                text: "INCOMPLETE",
            },
            awaiting_funds: {
                color: "#FFFFFF",
                background: "#FF9800", // Orange
                text: "AWAITING FUNDS",
            },
            verifying_transfer: {
                color: "#FFFFFF",
                background: "#4CAF50", // Green
                text: "VERIFYING TRANSFER",
            },
            compliance_review: {
                color: "#FFFFFF",
                background: "#673AB7", // Purple
                text: "COMPLIANCE REVIEW",
            },
            compliance_held: {
                color: "#FFFFFF",
                background: "#009688", // Teal
                text: "COMPLIANCE HELD",
            },
            processing_transfer: {
                color: "#FFFFFF",
                background: "#2196F3", // Blue
                text: "PROCESSING TRANSFER",
            },
            available_for_collection: {
                color: "#FFFFFF",
                background: "#9C27B0", // Deep Purple
                text: "AVAILABLE FOR COLLECTION",
            },
            send_to_partner: {
                color: "#FFFFFF",
                background: "#795548", // Brown
                text: "SEND TO PARTNER",
            },
            paid: {
                color: "#FFFFFF",
                background: "#4CAF50", // Green
                text: "PAID",
            },
            canceled: {
                color: "#FFFFFF",
                background: "#F44336", // Red
                text: "CANCELED",
            },
            canceling: {
                color: "#FFFFFF",
                background: "#FF5722", // Deep Orange
                text: "CANCELING",
            },
            refunded: {
                color: "#FFFFFF",
                background: "#607D8B", // Blue Grey
                text: "REFUNDED",
            },
        };

        return (
            variants[status_value] || {
                color: "#757575", // Default color (gray)
                background: "#E0E0E0", // Default background (light gray)
                text: "UNKNOWN",
            }
        );
    };

    return {
        replacePinNumber,
        changePinStatus ,
        resolveStatusVariant,
    }
}
