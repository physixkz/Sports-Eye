var settings = document.getElementById('settingsGear');
var toggleBtn = document.getElementById("toggle-btn");
var theme = document.getElementById("theme");
var navbar = document.getElementById("navbar");
let darkMode = localStorage.getItem("dark-mode");


document.addEventListener('DOMContentLoaded', function () {
    const columns = document.querySelectorAll('.column');
    const savedContentBox = document.getElementById('saved-content-box');
    const liveScoresButton = document.getElementById('live-scores-button');
    const refreshScoresButton = document.createElement('button');
    refreshScoresButton.textContent = 'Refresh Scores';
    refreshScoresButton.classList.add('refresh-scores-button');

    const apiData = document.getElementById('api-data');

    columns.forEach((column, index) => {
        column.addEventListener('click', function () {
            // Check if clicked element is a button, and exclude its content
            if (!column.classList.contains('button')) {
                const content = column.innerHTML;
                localStorage.setItem(`column_${index}`, content);
            }
        });
    });

    liveScoresButton.addEventListener('click', async function () {
        await fetchData();

        // Create and append the "Save Data" button
        const saveDataButton = document.createElement('button');
        saveDataButton.textContent = 'Save Data';
        saveDataButton.classList.add('save-data-button', 'button-style');
    
    // Clone the content of api-data div without the buttons
    const apiDataContentClone = apiData.cloneNode(true);
    const saveButtonToRemove = apiDataContentClone.querySelector('.save-data-button');
    const refreshButtonToRemove = apiDataContentClone.querySelector('.refresh-scores-button');
    if (saveButtonToRemove) {
        apiDataContentClone.removeChild(saveButtonToRemove);
    }
    if (refreshButtonToRemove) {
        apiDataContentClone.removeChild(refreshButtonToRemove);
    }

        saveDataButton.addEventListener('click', function () {
            const apiDataContent = apiDataContentClone.innerHTML;
            localStorage.setItem('api_data', apiDataContent);

            // Display saved content in the saved-content-box
            const savedContentDiv = document.createElement('div');
            savedContentDiv.classList.add('saved-content');
            savedContentDiv.innerHTML = apiDataContent;
            savedContentBox.appendChild(savedContentDiv);
        });

        // Remove existing "Save Data" button before appending
        const existingSaveDataButton = apiData.querySelector('.save-data-button');
        if (existingSaveDataButton) {
            existingSaveDataButton.remove();
        }

        apiData.appendChild(saveDataButton);

        // Append the "Refresh Scores" button
        apiData.appendChild(refreshScoresButton);
    });

    refreshScoresButton.addEventListener('click', async function () {
        await fetchData();
    });

    refreshScoresButton.textContent = 'Refresh Scores';
    refreshScoresButton.classList.add('refresh-scores-button', 'button-style', 'button-spacing');

    // Load content from local storage on page load
    columns.forEach((column, index) => {
        const content = localStorage.getItem(`column_${index}`);
        if (content) {
            column.innerHTML = content;
        }
    });

    // Load saved API data content from local storage
    const savedApiData = localStorage.getItem('api_data');
    if (savedApiData) {
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = savedApiData;

        const apiDataDiv = document.getElementById('api-data');
        const savedApiDataRows = tempDiv.querySelectorAll('.row');
        savedApiDataRows.forEach(row => {
            apiDataDiv.appendChild(row);
        });
    }
});

async function fetchData() {
    console.log("Fetching data...");

    const url = 'https://sports-live-scores.p.rapidapi.com/baseball/live';
    const options = {
        method: 'GET',
        headers: {
            'X-RapidAPI-Key': '8516b89c04msh14301adfc08cb2ap103260jsne97130bb1c31',
            'X-RapidAPI-Host': 'sports-live-scores.p.rapidapi.com'
        }
    };

    try {
        const response = await fetch(url, options);
        const result = await response.text();

        const jsonObject = JSON.parse(result);
        const matches = jsonObject.matches;

        const apiDataDiv = document.getElementById("api-data");
        apiDataDiv.innerHTML = ''; // Clear previous data

        let currentRow = 1;
        let currentColumn = 1;
        for (let i = 0; i < matches.length; i++) {
            if (currentColumn > 5) {
                currentColumn = 1;
                currentRow++;
            }

            if (currentColumn === 1) {
                const newRow = document.createElement("div");
                newRow.classList.add("row");
                newRow.id = "row" + currentRow;
                apiDataDiv.appendChild(newRow);
            }

            const match = matches[i];
            const matchDiv = document.createElement("div");
            matchDiv.classList.add("column");
            matchDiv.innerHTML = `
                <p>Away: ${match["Away Team"]}: ${match["Away Score"]}</p>
                <p>Home: ${match["Home Team"]}: ${match["Home Score"]}</p>
                <p>Status: ${match["Status"]}</p>
                <br>
            `;

            const currentRowElement = document.getElementById("row" + currentRow);
            currentRowElement.appendChild(matchDiv);

            currentColumn++;
        }
    } catch (error) {
        console.error(error);
    }
}

// Needs to be fixed
// smooth scrolling
document.querySelectorAll('navbar ul li a').forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const target = document.querySelector(link.getAttribute('href'));
      target.scrollIntoView({ behavior: 'smooth' });
    });
  });
  
  // pop up window for settings
  function openSettings() {
    document.getElementById('popup-container').style.display = 'block';
    document.getElementById('overlay').style.display = 'block';
    console.log('opened');
  }
  
  function closeSettings() {
    document.getElementById('popup-container').style.display = 'none';
    document.getElementById('overlay').style.display = 'none';
    console.log('closed');
  }
  
  settings.addEventListener('click', openSettings);
  
  //turns on and off dark mode in local storage
  function enableDarkMode() {
    theme.classList.add("darkModeTheme");
    toggleBtn.classList.remove("darkModeToggle");
    toggleBtn.innerHTML= "Light Mode";
    navbar.classList.add("navDark");
    navbar.classList.remove("navBkgn");
    localStorage.setItem("dark-mode", "enabled");
  };
  
  function disableDarkMode() {
    theme.classList.remove("darkModeTheme");
    toggleBtn.classList.add("darkModeToggle");
    toggleBtn.innerHTML= "Dark Mode";
    navbar.classList.remove("navDark");
    navbar.classList.add("navBkgn");
    localStorage.setItem("dark-mode", "disabled");
  };
  
  //auto sets to dark mode on refresh if enabled
  if (darkMode === "enabled") {
    enableDarkMode(); // set state of darkMode on page load
  }
  
  //button toggles dark mode and saves in local storage
  toggleBtn.addEventListener("click", (e) => {
    darkMode = localStorage.getItem("dark-mode"); // update darkMode when clicked
    if (darkMode === "disabled") {
      console.log('dark');
      enableDarkMode();
    } else {
      console.log('light');
      disableDarkMode();
    }
  });