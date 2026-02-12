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
        if (state === "Other") continue; // Handle 'Other' at the end or separately if needed
        const option = document.createElement('option');
        option.value = state;
        option.textContent = state;
        stateSelect.appendChild(option);
    }

    // Add Other option at the end
    const otherOption = document.createElement('option');
    otherOption.value = "Other";
    otherOption.textContent = "Other";
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

    if (selectedState && stateCityData[selectedState]) {
        console.log(`Populating cities for ${selectedState}:`, stateCityData[selectedState]);
        stateCityData[selectedState].forEach(city => {
            const option = document.createElement('option');
            option.value = city;
            option.textContent = city;
            citySelect.appendChild(option);
        });
    } else {
        console.log(`No cities found for state: ${selectedState}`);
    }

    if (selectedState !== "Other") {
        const otherOption = document.createElement('option');
        otherOption.value = "Other";
        otherOption.textContent = "Other";
        citySelect.appendChild(otherOption);
    }
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
