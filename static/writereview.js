document.addEventListener("DOMContentLoaded", () => {
    const stars = document.querySelectorAll(".star");

    stars.forEach((star, index) => {
        star.addEventListener("click", () => {
            updateRatingStars(index + 1);
        });
    });

    function updateRatingStars(rating) {
        stars.forEach((star, index) => {
            if (index < rating) {
                star.classList.add("filled");
            } else {
                star.classList.remove("filled");
            }
        });
    }
});
