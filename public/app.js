(() => {
  const steps = {
    capture: document.getElementById('step-capture'),
    style: document.getElementById('step-style'),
    result: document.getElementById('step-result')
  };

  function goToStep(name) {
    Object.values(steps).forEach(s => s.classList.remove('active'));
    steps[name].classList.add('active');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  // ---- Tabs (camera / upload) ----
  const tabBtns = document.querySelectorAll('.tab-btn');
  const tabPanels = {
    camera: document.getElementById('tab-camera'),
    upload: document.getElementById('tab-upload')
  };
  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      tabBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      Object.values(tabPanels).forEach(p => p.classList.remove('active'));
      tabPanels[btn.dataset.tab].classList.add('active');
      if (btn.dataset.tab !== 'camera') stopCamera();
    });
  });

  // ---- Camera ----
  const video = document.getElementById('video');
  const canvas = document.getElementById('canvas');
  const startCameraBtn = document.getElementById('startCameraBtn');
  const shootBtn = document.getElementById('shootBtn');
  let mediaStream = null;

  async function startCamera() {
    try {
      mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'user' },
        audio: false
      });
      video.srcObject = mediaStream;
      startCameraBtn.hidden = true;
      shootBtn.hidden = false;
    } catch (err) {
      alert('無法開啟相機，請確認已允許權限，或改用「上傳照片」。');
      console.error(err);
    }
  }

  function stopCamera() {
    if (mediaStream) {
      mediaStream.getTracks().forEach(t => t.stop());
      mediaStream = null;
    }
    startCameraBtn.hidden = false;
    shootBtn.hidden = true;
  }

  startCameraBtn.addEventListener('click', startCamera);

  shootBtn.addEventListener('click', () => {
    const w = video.videoWidth;
    const h = video.videoHeight;
    canvas.width = w;
    canvas.height = h;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(video, 0, 0, w, h);
    canvas.toBlob(blob => {
      setPhoto(blob);
      stopCamera();
    }, 'image/png');
  });

  // ---- Upload ----
  const fileInput = document.getElementById('fileInput');
  fileInput.addEventListener('change', () => {
    const file = fileInput.files[0];
    if (file) setPhoto(file);
  });

  // ---- Shared photo state ----
  const previewWrap = document.getElementById('previewWrap');
  const previewImg = document.getElementById('previewImg');
  let currentPhotoBlob = null;

  function setPhoto(blob) {
    currentPhotoBlob = blob;
    previewImg.src = URL.createObjectURL(blob);
    previewWrap.hidden = false;
  }

  document.getElementById('retakeBtn').addEventListener('click', () => {
    currentPhotoBlob = null;
    previewWrap.hidden = true;
    fileInput.value = '';
  });

  document.getElementById('nextToStyleBtn').addEventListener('click', () => {
    if (!currentPhotoBlob) {
      alert('請先拍照或上傳照片');
      return;
    }
    goToStep('style');
  });

  document.getElementById('backToCaptureBtn').addEventListener('click', () => {
    goToStep('capture');
  });

  // ---- Generate ----
  const generateBtn = document.getElementById('generateBtn');
  const loading = document.getElementById('loading');
  const errorBox = document.getElementById('errorBox');
  const resultWrap = document.getElementById('resultWrap');
  const resultImg = document.getElementById('resultImg');
  const downloadBtn = document.getElementById('downloadBtn');

  async function generate() {
    if (!currentPhotoBlob) {
      goToStep('capture');
      return;
    }
    const style = document.querySelector('input[name="style"]:checked').value;

    goToStep('result');
    loading.hidden = false;
    errorBox.hidden = true;
    resultWrap.hidden = true;

    try {
      const formData = new FormData();
      formData.append('photo', currentPhotoBlob, 'photo.png');
      formData.append('style', style);

      const res = await fetch('/api/generate', {
        method: 'POST',
        body: formData
      });
      const data = await res.json();

      if (!res.ok) throw new Error(data.error || '生成失敗，請稍後再試。');

      resultImg.src = data.image;
      downloadBtn.href = data.image;
      resultWrap.hidden = false;
    } catch (err) {
      errorBox.textContent = '❌ ' + err.message;
      errorBox.hidden = false;
    } finally {
      loading.hidden = true;
    }
  }

  generateBtn.addEventListener('click', generate);

  document.getElementById('anotherBtn').addEventListener('click', () => {
    goToStep('style');
  });

  document.getElementById('restartBtn').addEventListener('click', () => {
    currentPhotoBlob = null;
    previewWrap.hidden = true;
    fileInput.value = '';
    goToStep('capture');
  });
})();
