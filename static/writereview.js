stars.forEach((star, index) => {
    star.addEventListener('click', () => {
        // 모든 별을 초기화
        labels.forEach(label => {
            label.style.color = '#ddd';
        });

        // 선택된 별까지 색칠
        for (let i = 0; i <= index; i++) { 
            labels[index - i].style.color = '#FF8E8E'; // 역순으로 색칠
        }
    });
});

labels.forEach((label, index) => {
    label.addEventListener('mouseenter', () => {
        for (let i = 0; i <= index; i++) {
            labels[index - i].style.color = '#FF8E8E'; // 역순으로 색칠
        }
    });

    label.addEventListener('mouseleave', () => {
        labels.forEach(label => {
            label.style.color = '#ddd';
        });
        const checkedStar = document.querySelector('.stars input[type="radio"]:checked');
        if (checkedStar) {
            const checkedIndex = Array.from(stars).indexOf(checkedStar);
            for (let i = 0; i <= checkedIndex; i++) {
                labels[checkedIndex - i].style.color = '#FF8E8E'; // 역순으로 색칠
            }
        }
    });
});
