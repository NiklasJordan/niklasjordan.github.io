document.addEventListener('DOMContentLoaded', function() {
    // Function to get URL parameters
    function getURLParameter(name) {
        const urlParams = new URLSearchParams(window.location.search);
        return urlParams.get(name);
    }

    // Function to fetch and parse YAML file
    async function fetchPopupConfig() {
        try {
            const response = await fetch('popups.yaml');
            if (!response.ok) {
                throw new Error('Failed to load popup configurations');
            }
            const yamlText = await response.text();
            return parseYAML(yamlText);
        } catch (error) {
            console.error('Error loading popup configurations:', error);
            return null;
        }
    }

    // Simple YAML parser for our specific format
    function parseYAML(yamlText) {
        const popups = {};
        let currentPopup = null;
        let currentProperty = null;
        let inBulletPoints = false;
        let bulletPoints = [];

        const lines = yamlText.split('\n');
        
        for (const line of lines) {
            // Skip comments and empty lines
            if (line.trim().startsWith('#') || !line.trim()) continue;
            
            // Detect popup section
            if (line.trim() === 'popups:') continue;
            
            // Detect new popup
            if (line.match(/^\s{2}\w+:/)) {
                const popupName = line.trim().replace(':', '');
                currentPopup = popupName;
                popups[currentPopup] = {};
                currentProperty = null;
                inBulletPoints = false;
                continue;
            }
            
            // Detect properties
            if (line.match(/^\s{4}\w+:/) && currentPopup) {
                const parts = line.trim().split(':');
                currentProperty = parts[0].trim();
                
                // Check if this is the bullet_points array
                if (currentProperty === 'bullet_points') {
                    inBulletPoints = true;
                    popups[currentPopup][currentProperty] = [];
                    continue;
                }
                
                // Handle normal properties (not arrays)
                inBulletPoints = false;
                const value = parts.slice(1).join(':').trim();
                // Remove quotes if present
                popups[currentPopup][currentProperty] = value.replace(/^"|"$|^'|'$/g, '');
                continue;
            }
            
            // Handle bullet points
            if (inBulletPoints && line.match(/^\s{6}-/) && currentPopup) {
                const bulletPoint = line.replace(/^\s{6}-\s*/, '').trim();
                // Remove quotes if present
                popups[currentPopup][currentProperty].push(bulletPoint.replace(/^"|"$|^'|'$/g, ''));
                continue;
            }
        }
        
        return { popups };
    }

    // Function to create and display popup
    function createPopup(config) {
        // Create popup elements
        const popupOverlay = document.createElement('div');
        popupOverlay.className = 'popup-overlay';
        
        // Add background video if specified
        if (config.background_video) {
            // Create and append the video element
            const video = document.createElement('video');
            video.className = 'popup-video-background';
            video.src = config.background_video;
            video.autoplay = true;
            video.loop = true;
            video.muted = true;
            video.playsInline = true;
            popupOverlay.appendChild(video);
            
            // Only create overlay if overlay_color is specified
            if (config.overlay_color) {
                // Create overlay with configurable color and opacity
                const videoOverlay = document.createElement('div');
                videoOverlay.className = 'popup-video-overlay';
                
                // Set the overlay color and opacity
                const overlayColor = config.overlay_color;
                const overlayOpacity = config.overlay_opacity || 0.5;
                videoOverlay.style.backgroundColor = overlayColor;
                videoOverlay.style.opacity = overlayOpacity;
                
                popupOverlay.appendChild(videoOverlay);
            }
        }
        
        const popupContainer = document.createElement('div');
        popupContainer.className = 'popup-container';
        
        // Create logo element
        const logo = document.createElement('img');
        logo.src = config.logo;
        logo.alt = config.title + ' Logo';
        logo.className = 'popup-logo';
        
        // Create content container
        const contentContainer = document.createElement('div');
        contentContainer.className = 'popup-content';
        
        // Add heading
        const heading = document.createElement('h2');
        heading.textContent = config.title;
        heading.style.color = config.highlight_color;
        
        // Add description
        const description = document.createElement('p');
        description.textContent = config.description;
        
        // Create bullet list
        const bulletList = document.createElement('ul');
        
        // Add bullet points
        config.bullet_points.forEach(point => {
            const listItem = document.createElement('li');
            
            // Create icon element
            const icon = document.createElement('i');
            icon.className = 'fa-solid fa-circle-check';
            icon.style.color = config.highlight_color;
            icon.style.marginRight = '10px';
            
            // Append icon and text to list item
            listItem.appendChild(icon);
            listItem.appendChild(document.createTextNode(point));
            
            bulletList.appendChild(listItem);
        });
        
        // Create button
        const button = document.createElement('a');
        button.href = config.button_url;
        button.target = '_blank';
        button.className = 'popup-button';
        button.style.backgroundColor = config.highlight_color;
        button.textContent = config.button_text;
        
        // Create close button container
        const closeContainer = document.createElement('div');
        closeContainer.className = 'popup-close-container';
        
        // Create close button
        const closeButton = document.createElement('button');
        closeButton.className = 'popup-close';
        closeButton.innerHTML = '&times;';
        closeButton.addEventListener('click', function() {
            document.body.removeChild(popupOverlay);
        });
        
        // Create back text
        const backText = document.createElement('span');
        backText.className = 'popup-back-text';
        backText.textContent = 'Back to niklasjordan.com';
        backText.addEventListener('click', function() {
            document.body.removeChild(popupOverlay);
        });
        
        // Add both to container
        closeContainer.appendChild(backText);
        closeContainer.appendChild(closeButton);
        
        // Append elements to the content container
        contentContainer.appendChild(heading);
        contentContainer.appendChild(description);
        contentContainer.appendChild(bulletList);
        contentContainer.appendChild(button);
        
        // Append elements to the popup container
        popupContainer.appendChild(closeContainer);
        popupContainer.appendChild(logo);
        popupContainer.appendChild(contentContainer);
        
        // Append the overlay to the body
        popupOverlay.appendChild(popupContainer);
        
        // Append the overlay to the body
        document.body.appendChild(popupOverlay);
    }

    // Main function to check source parameter and display appropriate popup
    async function initPopup() {
        const sourceParam = getURLParameter('source');
        
        if (!sourceParam) return;
        
        const popupConfigs = await fetchPopupConfig();
        if (!popupConfigs || !popupConfigs.popups || !popupConfigs.popups[sourceParam]) {
            console.log('No popup configuration found for source:', sourceParam);
            return;
        }
        
        createPopup(popupConfigs.popups[sourceParam]);
    }

    // Initialize popup system
    initPopup();
});
