// Utility functions
export function ensureSingleControlPanel() {
    const existingPanels = document.querySelectorAll('.wl-control-panel');
    existingPanels.forEach(panel => panel.remove());
}

export function isWatchLaterPage() {
    return window.location.href.includes('list=WL');
}

export function isSubscriptionsPage() {
    return window.location.href.includes('/feed/channels');
}
