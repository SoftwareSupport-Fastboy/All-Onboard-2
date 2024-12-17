// đăng ký the service worker
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/service-worker.js').then((registration) => {
            console.log('Service Worker registered with scope:', registration.scope);
        }).catch((error) => {
            console.log('Service Worker registration failed:', error);
        });
    });
}



// Global variable to store the data
// Global variable to store the data
let allData = [];
let countdownTimer;
let countdownValue = 9;

const API_URL = "https://script.googleusercontent.com/macros/echo?user_content_key=wzZtVG8a-l0MQ4w8jZxwoi1pn-ZmeHtfZpa4Bch6XmTYz50RCUKR2eEGK75I3I-bHEeW5sVMsWVb4W85Nj6-NNKb-H85CGTVm5_BxDlH2jW0nuo2oDemN9CCS2h10ox_1xSncGQajx_ryfhECjZEnPnxmQEFzp4mHjR31VNMmQnI7V7nzLaplU5-VycdK-MfsO26v7535yDU98-P9oQ1v47qjhsbNZmGkLWLxVOm0MOV-mPxIk_Kd9z9Jw9Md8uu&lib=M0lsbAYAVLnIBkgppLjA8AAZORf4TutOS";

async function fetchData() {
  try {
    const loader = document.getElementById("loader");
    const gaploi_loading = document.getElementById("gap-loi-loading");

    // Set a timeout to trigger if loading takes more than 20 seconds
    const timeout = setTimeout(() => {
      gaploi_loading.style.visibility = "visible";
    }, 20000); // 20 seconds

    const response = await fetch(API_URL);
    const data = await response.json();
    loader.style.display = "flex"; // Show the loader

    if (Array.isArray(data) && data.length > 0) {
      allData = data; // Store the data in a global variable
      
      // Update total rows in the HTML
      document.getElementById("total-row-whole-sheet").textContent = `Tổng số onboard: ${data.length}`;
      loader.style.display = "none"; // Hide the loader
      clearTimeout(timeout); // Clear the timeout since data has been fetched
    } else {
      console.error("No data found.");
      
      // If no data, set total rows to 0
      document.getElementById("total-row-whole-sheet").textContent = "Tổng số onboard: 0";
      loader.style.display = "none"; // Hide the loader
      clearTimeout(timeout); // Clear the timeout since data has been fetched
    }
  } catch (error) {
    console.error("Error fetching data:", error);
    
    const gaploi_loading = document.getElementById("gap-loi-loading");
    gaploi_loading.style.visibility = "visible";
    
    // If an error occurs, set total rows to an error message
    document.getElementById("total-row-whole-sheet").textContent = "Tổng số onboard: (không lấy được dữ liệu, hãy refresh lại)";
  }
}



function populateTable(data) {
  const tableBody = document.getElementById("tableBody");
  tableBody.innerHTML = ""; // Clear previous table data

  data.forEach(row => {
    const tr = document.createElement("tr");

    row.forEach(cell => {
      const td = document.createElement("td");

      // Kiểm tra nếu cell chứa "Ticket#"
      if (typeof cell === "string" && cell.startsWith("Ticket#")) {
        const ticketId = cell.split("#")[1]; // Lấy phần số sau Ticket#
        const link = document.createElement("a");
        link.textContent = cell; // Giữ nguyên hiển thị
        link.href = `https://crm.fastboy.dev/tickets/detail/${ticketId}`; // Tạo hyperlink
        link.target = "_blank"; // Mở link trong tab mới
        td.appendChild(link); // Gắn hyperlink vào ô
      } else {
        td.textContent = cell; // Nếu không phải "Ticket#", hiển thị nội dung thông thường
      }

      tr.appendChild(td);
    });

    tableBody.appendChild(tr);
  });
}


// function startLoader() {
//   const countdownElement = document.getElementById("countdown");


//   countdownTimer = setInterval(() => {
//     if (countdownValue > 0) {
//       countdownElement.textContent = countdownValue--; // Decrement countdown
//     } else {
//       clearInterval(countdownTimer); // Stop countdown when it reaches 0
//     }
//   }, 1000); // Update countdown every second
// }

// function stopLoader() {
//   clearInterval(countdownTimer); // Stop the countdown timer
//   document.getElementById("loader").style.display = "none"; // Hide the loader
// }

// Call startLoader when window loads or before fetching data
window.onload = function() {
  // startLoader(); // Start loader and countdown on window load
  fetchData();    // Fetch data in the background
  setTimeout(stopLoader, 10000); // Stop loader after 15 seconds
};

// Trigger search when input is provided and enter is pressed
document.getElementById("searchInput").addEventListener("keydown", function (e) {
    if (e.key === "Enter") {  // Check if the Enter key was pressed
      const searchQuery = document.getElementById("searchInput").value.trim();
      
      if (searchQuery) {
        searchTable(searchQuery);  // Perform search if there's input
      } else {
        // If the search input is empty, clear the table
        document.getElementById("tableBody").innerHTML = "";
      }
    }
  });
  
  // Trigger search when search button is clicked
  document.getElementById("searchBtn").addEventListener("click", function () {
    const searchQuery = document.getElementById("searchInput").value.trim();
    
    if (searchQuery) {
      searchTable(searchQuery);  // Perform search if there's input
    } else {
      // If the search input is empty, clear the table
      document.getElementById("tableBody").innerHTML = "";
      const resultCountElement = document.getElementById('resultCount');
      resultCountElement.textContent = `Tìm thấy 0 kết quả`;
    }
  });
  

// function searchTable(query) {
//   const filteredData = allData.filter(row => {
//     return row.some(cell => String(cell).toLowerCase() === query.toLowerCase());
//   });

//   if (filteredData.length > 0) {
//     populateTable(filteredData); // Populate table with filtered data
//   } else {
//     // Display "không tìm thấy" if no results are found
//     const tableBody = document.getElementById("tableBody");
//     tableBody.innerHTML = ""; // Clear previous table data

//     const tr = document.createElement("tr");
//     const td = document.createElement("td");
//     td.textContent = "Không tìm thấy"; // Message to display
//     td.colSpan = allData[0] ? allData[0].length : 1; // Span across all columns
//     td.style.textAlign = "center"; // Center the message

//     tr.appendChild(td);
//     tableBody.appendChild(tr);
//   }
// }

// Function to search the table and display results
function searchTable(query) {
  // Split the query by commas and trim any extra spaces around each term
  const searchTerms = query.split(",").map(term => term.trim().toLowerCase());

  // Filter data based on search terms
  const filteredData = allData.filter(row => {
      return searchTerms.every(term => 
          row.some(cell => String(cell).toLowerCase() === term) // Exact match check
      );
  });

  // Display the number of results found
  const resultCountElement = document.getElementById('resultCount'); // Assume you have an element with this ID
  resultCountElement.textContent = `Tìm thấy ${filteredData.length} kết quả`; // Update the count

  if (filteredData.length > 0) {
      populateTable(filteredData); // Populate table with filtered data
  } else {
      // Display "không tìm thấy" if no results are found
      const tableBody = document.getElementById("tableBody");
      tableBody.innerHTML = ""; // Clear previous table data

      const tr = document.createElement("tr");
      const td = document.createElement("td");
      td.textContent = "Không tìm thấy"; // Message to display
      td.colSpan = allData[0] ? allData[0].length : 1; // Span across all columns
      td.style.textAlign = "center"; // Center the message

      tr.appendChild(td);
      tableBody.appendChild(tr);
  }
}


        // URLs for API requests
        const staffURL = "https://script.google.com/macros/s/AKfycbx69Ev7Vlb37_3NxTpWMxrruS3hZPeikWuGnjLv9u8-ojVhuQO-BoOurJdEcHjiVK4Alg/exec?action=getColumnA";
        const monthURL = "https://script.google.com/macros/s/AKfycbx69Ev7Vlb37_3NxTpWMxrruS3hZPeikWuGnjLv9u8-ojVhuQO-BoOurJdEcHjiVK4Alg/exec?action=getColumnB";
        const servicesURL = "https://script.google.com/macros/s/AKfycbx69Ev7Vlb37_3NxTpWMxrruS3hZPeikWuGnjLv9u8-ojVhuQO-BoOurJdEcHjiVK4Alg/exec?action=getColumnD";
        const activeURL = "https://script.google.com/macros/s/AKfycbx69Ev7Vlb37_3NxTpWMxrruS3hZPeikWuGnjLv9u8-ojVhuQO-BoOurJdEcHjiVK4Alg/exec?action=getColumnE";


        // Elements
        const searchInput = document.getElementById('searchInput');
        const staffButton = document.getElementById('staffButton');
        const monthButton = document.getElementById('monthButton');
        const staffDropdown = document.getElementById('staffDropdown');
        const monthDropdown = document.getElementById('monthDropdown');
        const servicesButton = document.getElementById('servicesButton');
        const servciesDropdown = document.getElementById('servciesDropdown');
        const activeButton = document.getElementById('activeButton');
        const activeDropdown = document.getElementById('activeDropdown');

        // Function to fetch data from API
        async function fetchOtherData(url) {
            try {
                const response = await fetch(url);
                if (!response.ok) throw new Error("Network response was not ok");
                return await response.json();
            } catch (error) {
                console.error("Fetch error:", error);
                return [];
            }
        }

        
// Function to populate and show dropdown
function showDropdown(dropdown, data) {
  dropdown.innerHTML = ''; // Clear existing items
  data.forEach(item => {
      const div = document.createElement('div');
      div.textContent = item;
      div.addEventListener('click', () => {
          // Append the selected item to the existing input value with a comma
          if (searchInput.value) {
              searchInput.value += `, ${item}`; // Add a comma and the selected item
          } else {
              searchInput.value = item; // If input is empty, just set the value
          }
          dropdown.style.display = 'none'; // Hide dropdown
          searchTable(searchInput.value); // Trigger search with the updated value
      });
      dropdown.appendChild(div);
  });
  dropdown.style.display = 'block';
}


        // Fetch and populate data for staff and month lists
        let staffList = [];
        let monthList = [];
        let servicesList = [];
        let activeList = [];

        async function initializeData() {
            staffList = await fetchOtherData(staffURL);
            monthList = await fetchOtherData(monthURL);
            servicesList = await fetchOtherData(servicesURL);
            activeList = await fetchOtherData(activeURL);

        }

        // Attach events to buttons
        staffButton.addEventListener('click', () => {
            const rect = staffButton.getBoundingClientRect();
            staffDropdown.style.top = `${rect.bottom + window.scrollY}px`;
            staffDropdown.style.left = `${rect.left + window.scrollX}px`;
            showDropdown(staffDropdown, staffList);
        });

        monthButton.addEventListener('click', () => {
            const rect = monthButton.getBoundingClientRect();
            monthDropdown.style.top = `${rect.bottom + window.scrollY}px`;
            monthDropdown.style.left = `${rect.left + window.scrollX}px`;
            showDropdown(monthDropdown, monthList);
        });

        servicesButton.addEventListener('click', () => {
          const rect = servicesButton.getBoundingClientRect();
          servciesDropdown.style.top = `${rect.bottom + window.scrollY}px`;
          servciesDropdown.style.left = `${rect.left + window.scrollX}px`;
          showDropdown(servciesDropdown, servicesList);
        });

        activeButton.addEventListener('click', () => {
          const rect = activeButton.getBoundingClientRect();
          activeDropdown.style.top = `${rect.bottom + window.scrollY}px`;
          activeDropdown.style.left = `${rect.left + window.scrollX}px`;
          showDropdown(activeDropdown, activeList);
        });

        // Hide dropdown when clicking outside
        document.addEventListener('click', (event) => {
            if (!staffDropdown.contains(event.target) && event.target !== staffButton) {
                staffDropdown.style.display = 'none';
            }
            if (!monthDropdown.contains(event.target) && event.target !== monthButton) {
                monthDropdown.style.display = 'none';
            }
            if (!activeDropdown.contains(event.target) && event.target !== activeButton) {
              activeDropdown.style.display = 'none';
            }
            if (!servciesDropdown.contains(event.target) && event.target !== servicesButton) {
              servciesDropdown.style.display = 'none';
            }
        });

        // Initialize data on page load
        initializeData();



        // Fetch data from the URL
fetch('https://script.google.com/macros/s/AKfycbx69Ev7Vlb37_3NxTpWMxrruS3hZPeikWuGnjLv9u8-ojVhuQO-BoOurJdEcHjiVK4Alg/exec?action=getC1')
.then(response => response.json())  // Parse the response as JSON
.then(data => {
  // Get the value of C1 from the response
  const c1Value = data.C1;

  // Find the element with the ID 'TẤT CẢ ONBOARD TÍNH TỚI THÁNG ...'
  const targetElement = document.getElementById('Tieu-De');
  const targetElement2 = document.getElementById('Tieu-De-2');
  const targetElement3 = document.getElementById('Tieu-De-3');

  // Update the content of the element with the formatted string
  if (targetElement) {
    targetElement.textContent = `TẤT CẢ ONBOARD TÍNH TỚI THÁNG ${c1Value}`;
  }
  if (targetElement2) {
    targetElement2.textContent = ` (tính tới tháng ${c1Value})`;
  }
  if (targetElement3) {
    targetElement3.textContent = `tháng ${c1Value}`;
  }
})
.catch(error => {
  console.error('Error fetching data:', error);
});




//input thì hiện nút cancel
const search_Input = document.getElementById('searchInput');
const cancelButton = document.querySelector('.cancel-button');

// Hiển thị hoặc ẩn nút khi nhập nội dung
searchInput.addEventListener('input', function () {
    if (this.value.trim() !== '') {
        cancelButton.style.display = 'flex';
        search_Input.style.paddingRight = '30px'; // Thêm khoảng cách để tránh nút che text
    } else {
        cancelButton.style.display = 'none';
        search_Input.style.paddingRight = ''; // Reset padding về mặc định
    }
});

// Reset input và ẩn nút khi bấm phím Escape
search_Input.addEventListener('keydown', function (event) {
    if (event.key === 'Escape') {
        resetSearchInput();
    }
});

// Reset input và ẩn nút khi bấm vào nút cancel
cancelButton.addEventListener('click', function () {
    resetSearchInput();
});

// Hàm reset input và ẩn nút
function resetSearchInput() {
  search_Input.value = '';
    cancelButton.style.display = 'none';
    search_Input.style.paddingRight = ''; // Reset padding về mặc định
}