// Subscription management functionality
export function addSubscriptionControls() {
    ensureSingleControlPanel();
    console.log('[DEBUG] Adding subscription controls');
    
    const controlPanel = document.createElement('div');
    controlPanel.className = 'wl-control-panel';
    
    const selectAllBtn = document.createElement('button');
    selectAllBtn.textContent = 'Select All Channels';
    selectAllBtn.className = 'wl-btn select-all';
    
    const unsubscribeBtn = document.createElement('button');
    unsubscribeBtn.textContent = 'Unsubscribe Selected';
    unsubscribeBtn.className = 'wl-btn delete-selected';
    
    selectAllBtn.addEventListener('click', () => {
        const checkboxes = document.querySelectorAll('.subscription-checkbox');
        const allChecked = Array.from(checkboxes).every(cb => cb.checked);
        checkboxes.forEach(cb => cb.checked = !allChecked);
        selectAllBtn.textContent = allChecked ? 'Select All Channels' : 'Deselect All';
    });

    unsubscribeBtn.addEventListener('click', async () => {
        const selectedChannels = document.querySelectorAll('.subscription-checkbox:checked');
        console.log('[DEBUG] Selected channels:', selectedChannels.length);
        
        if (selectedChannels.length === 0) return;

        if (confirm(`Unsubscribe from ${selectedChannels.length} channels?`)) {
            let successCount = 0;

            for (const checkbox of selectedChannels) {
                try {
                    const channelItem = checkbox.closest('ytd-channel-renderer');
                    const channelName = channelItem?.querySelector('.ytd-channel-name')?.textContent;
                    console.log('[DEBUG] Processing channel:', channelName);
                    
                    const subscribeButton = channelItem.querySelector('ytd-subscribe-button-renderer button');
                    if (subscribeButton) {
                        subscribeButton.click();
                        await new Promise(r => setTimeout(r, 1500));
                        
                        const unsubscribeButton = document.querySelector('button.yt-spec-button-shape-next--call-to-action[aria-label="Se d\u00e9sabonner"]');
                        console.log('[DEBUG] Found unsubscribe button:', unsubscribeButton);
                        
                        if (unsubscribeButton) {
                            unsubscribeButton.click();
                            successCount++;
                            await new Promise(r => setTimeout(r, 2000));
                        } else {
                            console.log('[DEBUG] Unsubscribe button not found in dialog');
                        }
                    } else {
                        console.log('[DEBUG] Subscribe button not found for channel');
                    }
                } catch (error) {
                    console.error('[DEBUG] Error processing channel:', error);
                }
            }

            console.log(`[DEBUG] Successfully unsubscribed from ${successCount} channels`);
            
            if (successCount > 0) {
                alert(`Successfully unsubscribed from ${successCount} channels. Page will refresh.`);
                window.location.reload();
            } else {
                alert('No channels were unsubscribed. Please try again.');
            }
        }
    });
    
    controlPanel.appendChild(selectAllBtn);
    controlPanel.appendChild(unsubscribeBtn);

    const guideSection = document.querySelector('ytd-guide-section-renderer');
    if (guideSection) {
        guideSection.insertBefore(controlPanel, guideSection.firstChild);
    }

    function addCheckboxesToChannels() {
        const channelItems = document.querySelectorAll('ytd-channel-renderer');
        channelItems.forEach(item => {
            if (!item.querySelector('.subscription-checkbox-container')) {
                const container = document.createElement('div');
                container.className = 'subscription-checkbox-container';
                
                const checkbox = document.createElement('input');
                checkbox.type = 'checkbox';
                checkbox.className = 'subscription-checkbox';
                
                // Add visual label
                const label = document.createElement('label');
                label.className = 'subscription-checkbox-label';
                
                container.appendChild(checkbox);
                container.appendChild(label);
                
                // Insert near the channel info
                const channelInfo = item.querySelector('#info-container');
                if (channelInfo) {
                    channelInfo.insertBefore(container, channelInfo.firstChild);
                }

                // Add hover effect to the container
                item.addEventListener('mouseenter', () => {
                    container.style.opacity = '1';
                });
                item.addEventListener('mouseleave', () => {
                    if (!checkbox.checked) {
                        container.style.opacity = '0.3';
                    }
                });
            }
        });
    }

    const observer = new MutationObserver(() => {
        addCheckboxesToChannels();
    });

    const container = document.querySelector('#content');
    if (container) {
        observer.observe(container, {
            childList: true,
            subtree: true
        });
        addCheckboxesToChannels();
    }
}
