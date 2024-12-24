import { isWatchLaterPage, isSubscriptionsPage, ensureSingleControlPanel } from './utils.js';
import { addWatchLaterControls } from './watchLaterManager.js';
import { addSubscriptionControls } from './subscriptionManager.js';

function initializeControls() {
    ensureSingleControlPanel();
    if (isWatchLaterPage()) {
        addWatchLaterControls();
    } else if (isSubscriptionsPage()) {
        addSubscriptionControls();
    }
}

let initAttempts = 0;
const maxAttempts = 10;
const interval = setInterval(() => {
    if (document.querySelector('ytd-guide-section-renderer')) {
        initializeControls();
        clearInterval(interval);
    }
    initAttempts++;
    if (initAttempts >= maxAttempts) {
        clearInterval(interval);
    }
}, 1000);

window.addEventListener('yt-navigate-finish', () => {
    setTimeout(initializeControls, 1000);
});
