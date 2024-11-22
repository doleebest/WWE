document.addEventListener('DOMContentLoaded', function() {
    const stars = document.querySelectorAll('.stars input[type="radio"]');
    const labels = document.querySelectorAll('.stars label');

    // 별점 선택 이벤트
    stars.forEach((star, index) => {
        star.addEventListener('click', () => {
            // 모든 별을 초기화
            labels.forEach(label => {
                label.style.color = '#ddd';
            });
            
            // 선택된 별까지 색칠
            for(let i = 0; i <= index; i++) {
                labels[i].style.color = '#FF8E8E';
            }
        });
    });

    // 마우스 호버 효과
    labels.forEach((label, index) => {
        label.addEventListener('mouseenter', () => {
            // 호버 시 해당 별까지 색칠
            for(let i = 0; i <= index; i++) {
                labels[i].style.color = '#FF8E8E';
            }
        });

        label.addEventListener('mouseleave', () => {
            // 마우스 떠날 때 선택된 별만 유지
            labels.forEach(label => {
                label.style.color = '#ddd';
            });
            const checkedStar = document.querySelector('.stars input[type="radio"]:checked');
            if (checkedStar) {
                const checkedIndex = Array.from(stars).indexOf(checkedStar);
                for(let i = 0; i <= checkedIndex; i++) {
                    labels[i].style.color = '#FF8E8E';
                }
            }
        });
    });
});
