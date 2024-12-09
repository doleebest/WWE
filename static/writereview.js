const stars = document.querySelectorAll('.stars input[type="radio"]');
const labels = document.querySelectorAll('.stars label');

stars.forEach((star, index) => {
    star.addEventListener('click', () => {
        // 모든 별 초기화
        labels.forEach(label => {
            label.style.color = '#ddd';
        });

        // 클릭된 별까지 색칠
        for (let i = 0; i <= index; i++) {
            labels[i].style.color = '#FF8E8E'; // 왼쪽부터 색칠
        }
    });
});

labels.forEach((label, index) => {
    label.addEventListener('mouseenter', () => {
        // 마우스 오버된 별까지 색칠
        for (let i = 0; i <= index; i++) {
            labels[i].style.color = '#FF8E8E';
        }
    });

    label.addEventListener('mouseleave', () => {
        // 모든 별 초기화
        labels.forEach(label => {
            label.style.color = '#ddd';
        });

        // 현재 선택된 별까지 다시 색칠
        const checkedStar = document.querySelector('.stars input[type="radio"]:checked');
        if (checkedStar) {
            const checkedIndex = Array.from(stars).indexOf(checkedStar);
            for (let i = 0; i <= checkedIndex; i++) {
                labels[i].style.color = '#FF8E8E'; // 왼쪽부터 색칠
            }
        }
    });
});
