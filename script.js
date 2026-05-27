// 필요한 HTML 요소들을 가져옵니다.
const imageInput = document.getElementById('image-input');
const imagePreview = document.getElementById('image-preview');
const uploadText = document.getElementById('upload-text');
const downloadBtn = document.getElementById('download-btn');
const captureArea = document.getElementById('capture-area');

// 파일이 선택되었을 때 실행되는 이벤트
imageInput.addEventListener('change', function(event) {
    const file = event.target.files[0];
    
    if (file) {
        const reader = new FileReader();
        
        // 파일을 다 읽어오면 실행
        reader.onload = function(e) {
            const img = new Image();
            img.onload = function() {
                // 이미지를 완전히 흑백(Monochrome)으로 가공하기 위한 캔버스 생성
                const canvas = document.createElement('canvas');
                const ctx = canvas.getContext('2d');
                
                canvas.width = img.width;
                canvas.height = img.height;
                ctx.drawImage(img, 0, 0);
                
                // 이미지의 픽셀 데이터 가져오기
                const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
                const data = imgData.data;
                
                // 루프를 돌며 모든 픽셀을 흑백으로 전환 (저장 시에도 흑백 유지용)
                for (let i = 0; i < data.length; i += 4) {
                    const brightness = 0.299 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2];
                    data[i] = brightness;     // Red
                    data[i + 1] = brightness; // Green
                    data[i + 2] = brightness; // Blue
                }
                
                // 변환된 데이터를 캔버스에 다시 반영
                ctx.putImageData(imgData, 0, 0);
                
                // 흑백으로 변환된 이미지 주소를 img 태그에 대입하여 완전히 덮어씌움
                imagePreview.src = canvas.toDataURL();
                imagePreview.style.display = 'block';
                uploadText.style.display = 'none';
            };
            img.src = e.target.result;
        }
        
        // 이미지 파일을 Data URL 형태로 읽음
        reader.readAsDataURL(file);
    }
});

// 이미지 다운로드 버튼 클릭 이벤트
downloadBtn.addEventListener('click', function() {
    // 다운로드 중에는 버튼 텍스트 변경
    const originalText = downloadBtn.innerText;
    downloadBtn.innerText = "저장 중...";
    downloadBtn.disabled = true;

    // html2canvas를 사용하여 신문 영역을 캡처
    html2canvas(captureArea, {
        scale: 2, // 화질을 높이기 위해 2배수로 캡처
        useCORS: true, // 외부 이미지 로드 허용
        backgroundColor: null // 투명 배경 허용
    }).then(function(canvas) {
        // 캡처된 캔버스를 이미지 URL로 변환
        const image = canvas.toDataURL("image/png");
        
        // 임시 a 태그를 생성하여 다운로드 실행
        const link = document.createElement('a');
        link.href = image;
        link.download = 'newspaper_profile.png'; // 저장될 파일 이름
        link.click();

        // 버튼 상태 원상복구
        downloadBtn.innerText = originalText;
        downloadBtn.disabled = false;
    }).catch(function(error) {
        console.error("이미지 저장에 실패했습니다.", error);
        alert("이미지 저장 중 오류가 발생했습니다.");
        
        // 오류 발생 시 버튼 상태 원상복구
        downloadBtn.innerText = originalText;
        downloadBtn.disabled = false;
    });
});
