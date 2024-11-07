// Vanilla JavaScript for initializing page elements, similar to React hooks
document.addEventListener("DOMContentLoaded", () => {
    // Example function to dynamically update rating stars
    const updateRatingStars = (rating) => {
        const stars = document.querySelectorAll(".star");
        stars.forEach((star, index) => {
            if (index < rating) {
                star.classList.add("filled");
            } else {
                star.classList.remove("filled");
            }
        });
    };

    // Initial rating setup
    updateRatingStars(4); // Set initial rating to 4 stars
});
