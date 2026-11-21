document.addEventListener('DOMContentLoaded', () => {
    const urlInput = document.getElementById('urlInput');
    const pasteBtn = document.getElementById('pasteBtn');
    const downloadBtn = document.getElementById('downloadBtn');
    const loadingSection = document.getElementById('loadingSection');
    const loadingText = document.getElementById('loadingText');
    const errorSection = document.getElementById('errorSection');
    const errorText = document.getElementById('errorText');
    const resultSection = document.getElementById('resultSection');

    const authorAvatar = document.getElementById('authorAvatar');
    const authorName = document.getElementById('authorName');
    const videoDesc = document.getElementById('videoDesc');
    const downloadHdBtn = document.getElementById('downloadHdBtn');
    const downloadAudioBtn = document.getElementById('downloadAudioBtn');

    // Nút dán link từ clipboard
    pasteBtn.addEventListener('click', async () => {
        try {
          const text = await navigator.clipboard.readText();
          urlInput.value = text;
          showError('', false);
        } catch (err) {
          showError('Không thể truy cập bộ nhớ tạm. Vui lòng dán thủ công!');
        }
    });

    // Nút tải video
    downloadBtn.addEventListener('click', async () => {
        const url = urlInput.value.trim();
        if (!url) {
          showError('Vui lòng dán link video TikTok cần tải!');
          return;
        }

        if (!url.includes('tiktok.com') && !url.includes('douyin.com')) {
          showError('Link bạn nhập không phải là link TikTok hợp lệ!');
          return;
        }

        // Reset hiển thị
        showError('', false);
        resultSection.classList.add('hidden');
        loadingSection.classList.remove('hidden');

        let progress = 0;
        const steps = [
          'Đang kết nối tới máy chủ TikTok...',
          'Đang bóc tách watermark & logo...',
          'Đang chuẩn bị file Full HD & Nhạc nền...',
          'Hoàn tất xử lý, chuẩn bị hiển thị...'
        ];

        const interval = setInterval(() => {
            progress += 1;
            if (progress < steps.length) {
              loadingText.textContent = steps[progress];
            }
          }, 500);

        try {
          // Sử dụng API tikwm công khai để lấy video không logo
          const apiURL = `https://www.tikwm.com/api/?url=${encodeURIComponent(url)}`;
          const response = await fetch(apiURL);
          const data = await response.json();

          clearInterval(interval);
          loadingSection.classList.add('hidden');

          if (data.code === 0 && data.data) {
            const videoData = data.data;

            // Hiển thị thông tin
            authorAvatar.src = videoData.author.avatar || 'https://via.placeholder.com/50';
            authorName.textContent = videoData.author.nickname || videoData.author.unique_id || 'Hoàng Phúc Yêu Hải Yến';
            videoDesc.textContent = videoData.title || 'Video TikTok không logo (Hoàng Phúc Yêu Hải Yến)';

            // Xử lý nút tải HD trực tiếp (Tránh mở tab mới)
            setupDownloadButton(downloadHdBtn, videoData.hdplay || videoData.play, 'HoangPhuc_TikTok_HD.mp4');
            setupDownloadButton(downloadAudioBtn, videoData.music, 'HoangPhuc_TikTok_Audio.mp3');

            resultSection.classList.remove('hidden');
            resultSection.scrollIntoView({ behavior: 'smooth' });
          } else {
            showError('Không tìm thấy video. Vui lòng kiểm tra lại link!');
          }
        } catch (err) {
          clearInterval(interval);
          loadingSection.classList.add('hidden');
          showError('Lỗi kết nối mạng hoặc máy chủ bận. Vui lòng thử lại!');
        }
    });

    function showError(message, show = true) {
      if (show) {
        errorText.textContent = message;
        errorSection.classList.remove('hidden');
      } else {
        errorSection.classList.add('hidden');
      }
    }

    // Hàm hỗ trợ tải file trực tiếp về máy thay vì mở tab mới
    function setupDownloadButton(button, fileUrl, defaultFilename) {
      button.onclick = async (e) => {
        e.preventDefault();
        if (!fileUrl) {
          alert('Không có file tải xuống cho mục này!');
          return;
        }
        try {
          button.innerHTML = `<i class="fa-solid fa-spinner fa-spin"></i> Đang tải...`;
          const response = await fetch(fileUrl);
          const blob = await response.blob();
          const blobUrl = window.URL.createObjectURL(blob);

          const a = document.createElement('a');
          a.style.display = 'none';
          a.href = blobUrl;
          a.download = defaultFilename;
          document.body.appendChild(a);
          a.click();

          window.URL.revokeObjectURL(blobUrl);
          document.body.removeChild(a);

          button.innerHTML = button.classList.contains('hd')
          ? `<i class="fa-solid fa-video"></i> Tải Không Logo (Full HD)`
          : `<i class="fa-solid fa-music"></i> Tải Nhạc Nền (MP3)`;
        } catch (err) {
          // Fallback mở tab mới nếu CORS chặn fetch blob
          window.open(fileUrl, '_blank');
          button.innerHTML = button.classList.contains('hd')
          ? `<i class="fa-solid fa-video"></i> Tải Không Logo (Full HD)`
          : `<i class="fa-solid fa-music"></i> Tải Nhạc Nền (MP3)`;
        }
      };
    }
});
