export const useFileExport = () => {
    // Convert Blob (or text) into a string
    const blobToText = (input) =>
        new Promise((resolve, reject) => {
            const blob = input instanceof Blob ? input : new Blob([input]);
            const reader = new FileReader();
            reader.onload = () => resolve(reader.result);
            reader.onerror = reject;
            reader.readAsText(blob);
        });

    // Convert JSON array into CSV string
    const jsonToCsv = (json) => {
        if (!json || !json.length) return "";
        const headers = Object.keys(json[0]);
        return [
            headers.join(","),
            ...json.map((row) => headers.map((h) => `"${row[h] ?? ""}"`).join(",")),
        ].join("\r\n");
    };

    // Trigger browser download for a blob
    const downloadBlob = (blob, fileName) => {
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = fileName;
        document.body.appendChild(link);
        link.click();
        link.remove();
    };

    //  normalize different response formats into a Blob
    const normalizeResponseToBlob = (parsed, fallbackText) => {
        if (!parsed) {
            return new Blob([fallbackText], { type: "text/csv;charset=utf-8;" });
        }

        if (parsed.message) {
            throw new Error(parsed.message);
        }

        if (parsed.data) {
            if (typeof parsed.data === "string") {
                return new Blob([parsed.data], { type: "text/csv;charset=utf-8;" });
            }
            if (Array.isArray(parsed.data)) {
                return new Blob([jsonToCsv(parsed.data)], { type: "text/csv;charset=utf-8;" });
            }
        }

        if (Array.isArray(parsed)) {
            return new Blob([jsonToCsv(parsed)], { type: "text/csv;charset=utf-8;" });
        }
        return new Blob([fallbackText], { type: "text/csv;charset=utf-8;" });
    };

    return { blobToText, jsonToCsv, downloadBlob, normalizeResponseToBlob };
};
