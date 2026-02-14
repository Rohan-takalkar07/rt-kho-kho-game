// Requires state_city_data.js to be loaded first

/**
 * Populates the state dropdown.
 * @param {string} stateSelectId - The ID of the state <select> element.
 */
window.populateStates = function (stateSelectId) {
    const stateSelect = document.getElementById(stateSelectId);
    if (!stateSelect) return;

    // Keep the first "Select State" option
    const firstOption = stateSelect.options[0];
    stateSelect.innerHTML = '';
    stateSelect.appendChild(firstOption);

    for (const state in stateCityData) {
        if (state === "Other") continue;
        const option = document.createElement('option');
        option.value = state;
        option.textContent = state;
        stateSelect.appendChild(option);
    }

    // Add Other option at the end
    const otherOption = document.createElement('option');
    otherOption.value = "Other";
    otherOption.textContent = "Other (Custom State)";
    stateSelect.appendChild(otherOption);
}

/**
 * Populates the city dropdown based on the selected state.
 * @param {string} stateSelectId - The ID of the state <select> element.
 * @param {string} citySelectId - The ID of the city <select> element.
 */
window.populateCities = function (stateSelectId, citySelectId) {
    const stateSelect = document.getElementById(stateSelectId);
    const citySelect = document.getElementById(citySelectId);

    if (!stateSelect || !citySelect) return;

    const selectedState = stateSelect.value;

    // Clear existing options, keep the first one
    const firstOption = citySelect.options[0];
    citySelect.innerHTML = '';
    citySelect.appendChild(firstOption);

    if (selectedState && selectedState !== "Other") {
        // Load default cities
        let cities = stateCityData[selectedState] || [];

        // Load custom cities from localStorage
        const customCities = JSON.parse(localStorage.getItem('custom_cities') || '{}');
        if (customCities[selectedState]) {
            cities = [...new Set([...cities, ...customCities[selectedState]])];
        }

        cities.forEach(city => {
            const option = document.createElement('option');
            option.value = city;
            option.textContent = city;
            citySelect.appendChild(option);
        });
    }

    // Add "Customize/Other" option for city
    const otherOption = document.createElement('option');
    otherOption.value = "Other";
    otherOption.textContent = "Other (Customize/Add New)";
    citySelect.appendChild(otherOption);
}

/**
 * Saves a custom city to localStorage for the given state.
 * @param {string} state - The name of the state.
 * @param {string} city - The name of the custom city.
 * @returns {boolean} - True if successfully added, false otherwise.
 */
window.addCityToState = function (state, city) {
    if (!state || !city || state === "Other") return false;

    const customCities = JSON.parse(localStorage.getItem('custom_cities') || '{}');
    if (!customCities[state]) {
        customCities[state] = [];
    }

    if (!customCities[state].includes(city)) {
        customCities[state].push(city);
        localStorage.setItem('custom_cities', JSON.stringify(customCities));
        return true;
    }
    return false;
}

/**
 * Centralized toggle handler for showing/hiding custom input fields.
 * Also handles city population when state changes and real-time validation.
 */
window.toggleOtherInput = function (selectId, inputId, citySelectId) {
    const select = document.getElementById(selectId);
    const input = document.getElementById(inputId);

    if (!select || !input) return;

    const isStateSelect = selectId.toLowerCase().includes('state');

    if (isStateSelect && citySelectId) {
        populateCities(selectId, citySelectId);
    }

    if (select.value === 'Other') {
        input.style.display = 'block';
        input.focus();

        // Add real-time validation listener for State
        if (isStateSelect && citySelectId) {
            input.oninput = function () {
                const typedValue = this.value.trim();
                // Check if typed state matches any known state (case-insensitive)
                const matchedState = Object.keys(stateCityData).find(
                    s => s.toLowerCase() === typedValue.toLowerCase()
                );

                if (matchedState && matchedState !== "Other") {
                    // Temporarily mock the select value to load cities
                    const tempStateSelect = { value: matchedState };
                    const citySelect = document.getElementById(citySelectId);

                    // Clear existing options, keep the first one
                    const firstOption = citySelect.options[0];
                    citySelect.innerHTML = '';
                    citySelect.appendChild(firstOption);

                    // Load default cities for the matched state
                    let cities = stateCityData[matchedState] || [];

                    // Load custom cities from localStorage
                    const customCities = JSON.parse(localStorage.getItem('custom_cities') || '{}');
                    if (customCities[matchedState]) {
                        cities = [...new Set([...cities, ...customCities[matchedState]])];
                    }

                    cities.forEach(city => {
                        const option = document.createElement('option');
                        option.value = city;
                        option.textContent = city;
                        citySelect.appendChild(option);
                    });

                    // Add "Customize/Other" option for city
                    const otherOption = document.createElement('option');
                    otherOption.value = "Other";
                    otherOption.textContent = "Other (Customize/Add New)";
                    citySelect.appendChild(otherOption);

                    this.style.borderColor = '#22c55e'; // Green for valid match
                } else {
                    this.style.borderColor = ''; // Reset
                }

                if (typeof validateForm === 'function') validateForm();
                else if (typeof validate === 'function') validate(this);
            };
        } else if (selectId.toLowerCase().includes('city')) {
            // Add real-time validation for City
            input.oninput = function () {
                const typedValue = this.value.trim();
                const saveBtn = document.getElementById('saveCityBtn');

                // Simple validation: at least 2 characters, only letters, spaces, and hyphens/dots
                const isValid = typedValue.length >= 2 && /^[a-zA-Z\s\.\-]+$/.test(typedValue);

                if (saveBtn) {
                    saveBtn.style.display = isValid ? (saveBtn.classList.contains('add-city-btn') ? 'flex' : 'block') : 'none';
                }

                this.style.borderColor = isValid ? '#22c55e' : (typedValue.length > 0 ? '#ef4444' : '');

                if (typeof validateForm === 'function') validateForm();
                else if (typeof validate === 'function') validate(this);
            };
        }
    } else {
        input.style.display = 'none';
        input.value = '';
        input.oninput = null; // Clean up
    }

    // Trigger validation if present globally
    if (typeof validateForm === 'function') validateForm();
    else if (typeof validate === 'function') validate(select);
}

/**
 * Centralized toggle handler for showing/hiding color picker.
 */
window.toggleColorInput = function (selectId, inputId) {
    const select = document.getElementById(selectId);
    const input = document.getElementById(inputId);

    if (!select || !input) return;

    if (select.value === 'Customize') {
        input.style.display = 'block';
        input.focus();
    } else {
        input.style.display = 'none';
    }

    // Trigger validation if present globally
    if (typeof validateForm === 'function') validateForm();
}

/**
 * Initializes the dropdowns and adds event listeners.
 * @param {string} stateSelectId 
 * @param {string} citySelectId 
 */
window.initStateCityDropdowns = function (stateSelectId, citySelectId) {
    populateStates(stateSelectId);

    const stateSelect = document.getElementById(stateSelectId);
    if (stateSelect) {
        stateSelect.addEventListener('change', () => {
            populateCities(stateSelectId, citySelectId);
        });
    }
}
