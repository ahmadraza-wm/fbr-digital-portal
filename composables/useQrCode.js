/**
 * Pure canvas-based QR Code generator (no external library needed)
 * Uses qrcode-generator approach via dynamic script loading
 */
export const useQrCode = () => {
    /**
     * Generate QR code as data URL using canvas
     * @param {string} text - Text to encode
     * @param {number} size - Canvas size in pixels
     * @returns {Promise<string>} - Base64 data URL
     */
    const generateQrDataUrl = async (text, size = 200) => {
        if (!import.meta.client) return ''

        // Dynamically load qrcode library from CDN if not available
        if (!window.QRCode) {
            await new Promise((resolve, reject) => {
                const script = document.createElement('script')
                script.src = 'https://cdnjs.cloudflare.com/ajax/libs/qrcodejs/1.0.0/qrcode.min.js'
                script.onload = resolve
                script.onerror = reject
                document.head.appendChild(script)
            })
        }

        return new Promise((resolve) => {
            const container = document.createElement('div')
            container.style.display = 'none'
            document.body.appendChild(container)

            const qr = new window.QRCode(container, {
                text,
                width: size,
                height: size,
                colorDark: '#000000',
                colorLight: '#ffffff',
                correctLevel: window.QRCode.CorrectLevel.M,
            })

            setTimeout(() => {
                const canvas = container.querySelector('canvas')
                const img = container.querySelector('img')
                const dataUrl = canvas?.toDataURL('image/png') || img?.src || ''
                document.body.removeChild(container)
                resolve(dataUrl)
            }, 300)
        })
    }

    return { generateQrDataUrl }
}
