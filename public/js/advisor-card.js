// How an advisor appears in the directory listing and on their own page.
// A profile is written in whichever language the advisor's clients speak, so each card carries its own text direction.

export function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text ?? '';
    return div.innerHTML;
}

export function countryName(code) {
    if (!code) return '';
    try {
        return new Intl.DisplayNames(['en'], { type: 'region' }).of(code.toUpperCase()) || code;
    } catch {
        return code.toUpperCase();
    }
}

export const loading = (text) => `<div class="spinner-note"><span class="spinner dark"></span>${text}</div>`;
export const note = (text) => `<div class="card center muted">${text}</div>`;
export const errorMessage = (text) => `<div class="alert alert-error">${text}</div>`;

// Languages by code, used for the text direction of a card. Empty when the list cannot be loaded.
export async function loadLanguages(api) {
    try {
        const response = await fetch(`${api}/api/languages`);
        if (!response.ok) return {};
        const data = await response.json();
        return Object.fromEntries((data.languages || []).map((language) => [language.code, language]));
    } catch {
        return {};
    }
}

function website(url) {
    // Anything that is not a web address is left out rather than made into a link.
    if (!/^https?:\/\//i.test(url || '')) return '';
    const label = url.replace(/^https?:\/\//i, '').replace(/\/$/, '');
    return `
        <div class="advisor-card-website">
            <a href="${escapeHtml(url)}" target="_blank" rel="noopener noreferrer">${escapeHtml(label)}</a>
        </div>`;
}

const description = (profile) =>
    profile.description ? `<p class="advisor-card-description">${escapeHtml(profile.description)}</p>` : '';

// profile: { username, businessName, description, website, language, countries }
// options.direction: 'ltr' | 'rtl'; options.full renders the advisor's own page instead of a listing card.
export function renderAdvisorCard(profile, { direction = 'ltr', full = false } = {}) {
    const dir = direction === 'rtl' ? ' dir="rtl"' : '';

    if (full) {
        const countries = (profile.countries || [])
            .map((c) => `<span class="badge badge-neutral">${escapeHtml(countryName(c.country))}</span>`)
            .join('');
        return `
            <div class="card advisor-card"${dir}>
                ${profile.businessName ? `<h1 class="advisor-card-title">${escapeHtml(profile.businessName)}</h1>` : ''}
                ${description(profile)}
                ${website(profile.website)}
            </div>
            ${countries ? `
            <div class="card advisor-card-countries">
                <h2 class="advisor-card-countries-title">Active in</h2>
                <div class="badge-row">${countries}</div>
            </div>` : ''}`;
    }

    return `
        <div class="card advisor-card"${dir}>
            ${profile.businessName ? `<a class="advisor-card-link" href="/advisors/profile/?username=${encodeURIComponent(profile.username)}">${escapeHtml(profile.businessName)}</a>` : ''}
            ${description(profile)}
            ${website(profile.website)}
        </div>`;
}
