// Đóng mở các container
const AllOnboardcontainer = document.getElementById('All_Onboard_container');
const AllOnboardInput = document.getElementById('All_Onboard-Input');
const CheckOnboardcontainer = document.getElementById('Check_Onboard_container');
const CheckOnboardInput = document.getElementById('Check_Onboard-Input');
const Admincontainer = document.getElementById('Admin_container');
const AdminInput = document.getElementById('Admin-Input');

AllOnboardInput.addEventListener('click', function () {
  AllOnboardcontainer.style.display = 'flex';
  CheckOnboardcontainer.style.display = 'none';
  Admincontainer.style.display = 'none';
});
CheckOnboardInput.addEventListener('click', function () {
  AllOnboardcontainer.style.display = 'none';
  CheckOnboardcontainer.style.display = 'flex';
  Admincontainer.style.display = 'none';
});
AdminInput.addEventListener('click', function () {
  AllOnboardcontainer.style.display = 'none';
  CheckOnboardcontainer.style.display = 'none';
  Admincontainer.style.display = 'flex';
});






// Darkmode toggle
const themeSwitchCheckbox = document.querySelector('.theme-switch__checkbox');
const sunMoonIcon = document.getElementById('Sun-Moon_icon_ID');

if (sunMoonIcon === null) {
    console.error('Element with ID Sun-Moon_icon_ID not found.');
}

if (localStorage.getItem('darkMode') === 'enabled') {
    document.documentElement.classList.add('dark-mode');
    themeSwitchCheckbox.checked = true;
    sunMoonIcon?.classList.add('moon-and-shadow-icon');
} else {
    document.documentElement.classList.remove('dark-mode');
    sunMoonIcon?.classList.add('sun-and-glow-icon');
}

themeSwitchCheckbox.addEventListener('change', function () {
    if (this.checked) {
        document.documentElement.classList.add('dark-mode');
        localStorage.setItem('darkMode', 'enabled');
        sunMoonIcon?.classList.replace('sun-and-glow-icon', 'moon-and-shadow-icon');
    } else {
        document.documentElement.classList.remove('dark-mode');
        localStorage.setItem('darkMode', 'disabled');
        sunMoonIcon?.classList.replace('moon-and-shadow-icon', 'sun-and-glow-icon');
    }
});