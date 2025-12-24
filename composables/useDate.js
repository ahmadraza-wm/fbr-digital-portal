// composables/useDate.js
export const useDate = () => {
    const formatDate = (dateStr) => {
        if (!dateStr) return '-';
        return dateStr.substring(0, 10); // Format: "YYYY-MM-DD"
    };

    return {
        formatDate,
    };
};
