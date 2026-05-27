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
            // 회색 상자의 배경 이미지를 업로드한 이미지로 변경
            imagePreview.style.backgroundImage = `url(${e.target.result})`;
            // 글씨("+ 터치하여 이미지 넣기") 숨김
            uploadText.style.display = 'none';
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
        useCORS: true, // 외부 이미지(폰트 등) 로드 허용
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
