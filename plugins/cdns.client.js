export default defineNuxtPlugin(() => {
    if (process.client) {
        // Load CSS
        const css = document.createElement('link');
        css.rel = 'stylesheet';
        css.href = 'https://cdn.jsdelivr.net/npm/daterangepicker/daterangepicker.css';
        document.head.appendChild(css);

        // Load JS (jQuery → Moment → DateRangePicker)
        const jquery = document.createElement('script');
        jquery.src = 'https://cdn.jsdelivr.net/npm/jquery@3.6.0/dist/jquery.min.js';
        jquery.onload = () => {
            const moment = document.createElement('script');
            moment.src = 'https://cdn.jsdelivr.net/npm/moment@2.29.4/moment.min.js';
            moment.onload = () => {
                const daterangepicker = document.createElement('script');
                daterangepicker.src = 'https://cdn.jsdelivr.net/npm/daterangepicker/daterangepicker.min.js';
                document.body.appendChild(daterangepicker);
            };
            document.body.appendChild(moment);
        };
        document.body.appendChild(jquery);
    }
});
