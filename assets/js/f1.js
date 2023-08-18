var settings = document.getElementById('settingsGear');
var toggleBtn = document.getElementById("toggle-btn");
var theme = document.getElementById("theme");
var navbar = document.getElementById("navbar");
let darkMode = localStorage.getItem("dark-mode");



// const url = 'https://fia-formula-1-championship-statistics.p.rapidapi.com/api/standings/drivers-standings?year=2023';
// const options = {
//   method: 'GET',
//   headers: {
//     'X-RapidAPI-Key': '7564f1cff3mshb76416c5fbcccacp17fa9djsn027a5a72bd56',
//     'X-RapidAPI-Host': 'fia-formula-1-championship-statistics.p.rapidapi.com'
//   }
// };

// const getDriversStandings = async () => {
//   try {
//     const response = await fetch(url, options);
//     const result = await response.json();
//     const driversStandingsDiv = document.getElementById('driversStandings');
//     const driverStandings = result.driverStandings;
//     const driverInfo = driverStandings.map(driver => `${driver.driver.firstname} - ${driver.car}`);
//     driversStandingsDiv.innerHTML = driverInfo.join('<br>');
//   } catch (error) {
//     console.error(error);
//   }
// };

// testing comment
const url = 'https://fia-formula-1-championship-statistics.p.rapidapi.com/api/standings/drivers-standings?year=2023';
const options = {
  method: 'GET',
  headers: {
    'X-RapidAPI-Key': '7564f1cff3mshb76416c5fbcccacp17fa9djsn027a5a72bd56',
    'X-RapidAPI-Host': 'fia-formula-1-championship-statistics.p.rapidapi.com'
  }
};

const getDriversStandings = async () => {
  try {
    const response = await fetch(url, options);
    const result = await response.json();
    const driversStandingsDiv = document.getElementById('driversStandings');
    const driverStandings = result.driverStandings;
    const driverInfo = driverStandings.map(driver => `${driver.driver.firstname} - ${driver.car}`);
    const ul = document.createElement('ul');
    driverInfo.forEach(info => {
      const li = document.createElement('li');
      li.textContent = info;
      ul.appendChild(li);
    });
    driversStandingsDiv.innerHTML = '';
    driversStandingsDiv.appendChild(ul);
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