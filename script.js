// 필요한 HTML 요소들을 가져옵니다.
const imageInput = document.getElementById('image-input');
const imagePreview = document.getElementById('image-preview');
const uploadText = document.getElementById('upload-text');

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