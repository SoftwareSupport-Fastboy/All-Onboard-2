async function fetchAndCreateButtons() {
    try {
      const response = await fetch('https://script.google.com/macros/s/AKfycbx69Ev7Vlb37_3NxTpWMxrruS3hZPeikWuGnjLv9u8-ojVhuQO-BoOurJdEcHjiVK4Alg/exec?action=getPersonalBoardColumns');
      const data = await response.json();
  
      if (data.columnA && data.columnB) {
        createLinksAndButtons(data.columnA, data.columnB);
      } else {
        console.error('Dữ liệu không hợp lệ từ server');
      }
    } catch (error) {
      console.error('Không thể fetch dữ liệu', error);
    }
  }
  
  // Kiểm tra và bổ sung https:// nếu thiếu
  function ensureHttps(url) {
    if (!url.startsWith('http://') && !url.startsWith('https://')) {
      return `https://${url}`;
    }
    return url;
  }
  
  // Tạo các <a> và nút bấm sau mỗi 5 liên kết
  function createLinksAndButtons(names, urls) {
    const container = document.getElementById('Personal-Board-Button-fetch-data');
  
    if (!container) {
      console.error('Không tìm thấy container để gắn các liên kết');
      return;
    }
  
    // Clear container trước khi thêm dữ liệu mới
    container.innerHTML = '';
  
    // Duyệt qua danh sách để tạo <a> và nút
    for (let i = 0; i < names.length; i++) {
      const link = document.createElement('a');
      const urlToUse = ensureHttps(urls[i]);
      link.href = urlToUse;
      link.innerText = names[i];
      link.target = '_blank';
      link.classList.add('Personal-Board-Button');
  
      container.appendChild(link);
  
      // Sau mỗi 5 <a> thì thêm 1 nút
      if ((i + 1) % 5 === 0) {
        const btn = document.createElement('button');
        btn.innerText = `NHÓM SỐ ${(i + 1) / 5}`;
        btn.classList.add('Personal-Board-Button');
        btn.onclick = () => openGroupLinks(urls.slice(i - 4, i + 1));
        container.appendChild(btn);
      }
    }
  
    // Thêm nút nếu còn liên kết thiếu < 5 trong phần còn lại
    if (names.length % 5 !== 0) {
      const remainingStart = Math.floor(names.length / 5) * 5;
      const btn = document.createElement('button');
      btn.innerText = `NHÓM SỐ ${Math.floor(names.length / 5) + 1}`;
      btn.classList.add('Personal-Board-Button');
      btn.onclick = () => openGroupLinks(urls.slice(remainingStart));
      container.appendChild(btn);
    }
  }
  
  // Mở nhóm liên kết trong các tab mới
  function openGroupLinks(urls) {
    urls.forEach(url => {
      const safeUrl = ensureHttps(url);
      window.open(safeUrl, '_blank');
    });
  }
  
  // Gọi hàm fetch và tạo nút sau khi DOM sẵn sàng
  document.addEventListener('DOMContentLoaded', () => {
    fetchAndCreateButtons();
  });
  












async function fetchAndCreateURLTriggers() {
    try {
        const response = await fetch('https://script.google.com/macros/s/AKfycbx69Ev7Vlb37_3NxTpWMxrruS3hZPeikWuGnjLv9u8-ojVhuQO-BoOurJdEcHjiVK4Alg/exec?action=getURLTriggersColumns');
        const data = await response.json();

        if (data.columnA && data.columnB && data.columnC) {
            createURLTriggerElements(data.columnA, data.columnB, data.columnC);
        } else {
            console.error('Dữ liệu không hợp lệ từ server');
        }
    } catch (error) {
        console.error('Không thể fetch dữ liệu', error);
    }
}

function createURLTriggerElements(subjects, descriptions, urls) {
    const container = document.getElementById('URL_Triggers-fetch-data');

    if (!container) {
        console.error('Không tìm thấy container để gắn các phần tử');
        return;
    }

    // Clear container trước khi thêm dữ liệu mới
    container.innerHTML = '';

    for (let i = 0; i < subjects.length; i++) {
        // Tạo div lớn
        const div = document.createElement('div');
        div.className = 'url-trigger-box';

        // Tạo subject (cột A)
        const subject = document.createElement('div');
        subject.innerText = subjects[i];
        subject.className = 'url-trigger-subject';
        div.appendChild(subject);

        // Tạo span (cột B)
        const span = document.createElement('span');
        span.innerText = descriptions[i];
        span.className = 'url-trigger-description';
        div.appendChild(span);

        // Tạo textarea
        const textarea = document.createElement('textarea');
        textarea.placeholder = 'Nhập nội dung tại đây...';
        textarea.className = 'url-trigger-textarea';
        div.appendChild(textarea);

        // Tạo <a> (cột C, ẩn đi)
        const link = document.createElement('a');
        link.href = urls[i];
        link.innerText = 'Open Link';
        link.target = '_blank';
        link.className = 'url-trigger-link';
        div.appendChild(link);

        // Tạo nút kích hoạt
        const button = document.createElement('button');
        button.className = 'url-trigger-button';

        // Thêm sự kiện click cho nút
        button.addEventListener('click', () => handleButtonClick(textarea, link));

        div.appendChild(button);

        // Thêm sự kiện phím tắt cho textarea
        textarea.addEventListener('keydown', (e) => {
            // Enter
            if (e.ctrlKey && e.key === 'Enter') {
                e.preventDefault();
                handleButtonClick(textarea, link);
            }

            // Esc
            if (e.key === 'Escape') {
                e.preventDefault();
                textarea.value = '';
                textarea.blur();
            }

            // Tab
            if (e.key === 'Tab') {
                e.preventDefault(); // Ngăn hành vi mặc định của Tab
                const textareas = Array.from(container.querySelectorAll('.url-trigger-textarea'));
                const currentIndex = textareas.indexOf(textarea);
                const nextIndex = (currentIndex + 1) % textareas.length; // Quay vòng về textarea đầu tiên
                textareas[nextIndex].focus(); // Chuyển focus
            }

        });

        // Thêm div vào container
        container.appendChild(div);
    }
}

function handleButtonClick(textarea, link) {
    const inputValue = textarea.value.trim();
    const baseUrl = link.href;

    if (baseUrl.includes('*****')) {
        if (inputValue) {
            // Lọc chỉ lấy số từ nội dung của textarea
            const numbers = inputValue.match(/\d+/g); // Tìm tất cả các số (dãy số)

            if (numbers && numbers.length > 0) {
                for (const number of numbers) {
                    const updatedUrl = baseUrl.replace('*****', encodeURIComponent(number));
                    window.open(updatedUrl, '_blank'); // Mở mỗi số trong một tab mới
                }
            } else {
                alert('Không tìm thấy số nào trong nội dung, vui lòng nhập số để kích hoạt URL');
            }
        } else {
            alert('Textarea trống, vui lòng nhập nội dung để thay thế *****');
        }
    } else {
        alert('URL không chứa ***** để thay thế');
    }
}


// Gọi hàm fetch và tạo các phần tử sau khi DOM sẵn sàng
document.addEventListener('DOMContentLoaded', () => {
    fetchAndCreateURLTriggers();
});
