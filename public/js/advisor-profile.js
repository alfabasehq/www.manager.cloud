// One advisor's public page: /advisors/profile/?username=…
// Sending the advisor a message needs a signed-in sender, so the contact form is on the app's copy of this page.
import { errorMessage, escapeHtml, loadLanguages, note, renderAdvisorCard } from './advisor-card.js';

const profileEl = document.getElementById('profileContent');
const api = profileEl.dataset.api;
const username = new URLSearchParams(window.location.search).get('username');

async function loadProfile() {
    try {
        const [languages, response] = await Promise.all([
            loadLanguages(api),
            fetch(`${api}/api/advisors/profiles/${encodeURIComponent(username)}`)
        ]);

        if (response.status === 404) {
            profileEl.innerHTML = note('Advisor not found.');
            return;
        }
        if (!response.ok) throw new Error('Failed to load the advisor profile');

        const profile = await response.json();

        // The browser tab should name the advisor, not just "Advisor".
        if (profile.businessName) document.title = `${profile.businessName} — Manager Cloud`;

        profileEl.innerHTML = `
            ${renderAdvisorCard(profile, { direction: languages[profile.language]?.direction, full: true })}
            <p class="advisor-contact">
                <a href="${api}/advisors/profile?username=${encodeURIComponent(username)}" class="btn">
                    Contact ${escapeHtml(profile.businessName || 'this advisor')}
                </a>
            </p>`;
    } catch {
        profileEl.innerHTML = errorMessage('Failed to load the advisor profile. Please try again later.');
    }
}

if (username) await loadProfile();
else window.location.replace('/advisors/');
