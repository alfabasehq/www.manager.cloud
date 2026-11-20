// Accountants directory: loads the StoreRocket store-locator widget into .storerocket-store-locator.
(() => {
    const script = document.createElement('script');
    script.src = 'https://cdn.storerocket.io/widget.js';
    script.onload = () => StoreRocket.init({ selector: '.storerocket-store-locator', account: 'n0pj5rW86V' });
    script.onerror = () => {
        document.querySelector('.storerocket-store-locator').innerHTML =
            '<div class="alert alert-error">The directory could not be loaded. Please try again later.</div>';
    };
    document.body.appendChild(script);
})();
