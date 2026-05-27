document.addEventListener('DOMContentLoaded', () => {
    const photoContainer = document.getElementById('photo-container');
    const photoUpload = document.getElementById('photo-upload');
    const photoPreview = document.getElementById('photo-preview');
    const photoPlaceholder = document.getElementById('photo-trigger');
    const downloadBtn = document.getElementById('download-btn');
    const captureArea = document.getElementById('capture-area');

    // 1. 회색 상자 클릭 시 파일 업로드 창 호출
    photoContainer.addEventListener('click', () => {
        photoUpload.click();
    });

    // 2. 사진 업로드 시 Canvas를 활용한 강제 흑백 변환 (다운로드 캡처 버그 해결)
    photoUpload.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = function(event) {
            const img = new Image();
            img.onload = function() {
                // 원본 이미지를 Canvas에 그려 흑백 데이터로 추출
                const canvas = document.createElement('canvas');
                canvas.width = img.width;
                canvas.height = img.height;
                const ctx = canvas.getContext('2d');

                // 완벽한 흑백 필터 적용
                ctx.filter = 'grayscale(100%)';
                ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

                // 흑백 처리된 이미지를 src에 적용하여 브라우저 및 캡처에 동시 반영
                photoPreview.src = canvas.toDataURL('image/jpeg');
                photoPreview.style.display = 'block';
                photoPlaceholder.style.display = 'none'; // '사진 업로드' 글씨 숨김
            };
            img.src = event.target.result;
        };
        reader.readAsDataURL(file);
    });

    // 3. 작성된 결과물 고화질 캡처 및 다운로드 기능
    downloadBtn.addEventListener('click', () => {
        // 커서(깜빡임)가 캡처되는 것을 방지하기 위해 포커스 해제
        if (document.activeElement) {
            document.activeElement.blur();
        }

        // html2canvas 옵션: 화질 2배(scale: 2), 외부 배경 이미지 허용(useCORS)
        html2canvas(captureArea, {
            scale: 2, 
            useCORS: true,
            backgroundColor: null
        }).then(canvas => {
            const link = document.createElement('a');
            link.download = 'newspaper_profile.png';
            link.href = canvas.toDataURL('image/png');
            link.click();
        }).catch(err => {
            console.error('이미지 저장 중 오류 발생:', err);
            alert('이미지를 저장하는 중 문제가 발생했습니다.');
        });
    });
});