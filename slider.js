document.addEventListener("DOMContentLoaded", () => {
    const carousel = document.querySelector(".project-carousel");

    if (!carousel) return;

    const viewport = carousel.querySelector(".project-viewport");
    const track = carousel.querySelector(".project-track");
    const previousButton = carousel.querySelector(".carousel-prev");
    const nextButton = carousel.querySelector(".carousel-next");
    const dotsContainer = carousel.querySelector(".carousel-dots");
    const status = carousel.querySelector(".carousel-status");

    const originalSlides = Array.from(track.children);

    if (originalSlides.length === 0) return;

    // Create copies for continuous looping.
    const firstClone = originalSlides[0].cloneNode(true);
    const lastClone =
        originalSlides[originalSlides.length - 1].cloneNode(true);

    firstClone.setAttribute("aria-hidden", "true");
    lastClone.setAttribute("aria-hidden", "true");

    track.prepend(lastClone);
    track.append(firstClone);

    const totalSlides = originalSlides.length;
    let currentIndex = 1;
    let isAnimating = false;
    let touchStartX = 0;

    // Create one dot for each real project.
    const dots = originalSlides.map((_, index) => {
        const dot = document.createElement("button");

        dot.type = "button";
        dot.setAttribute(
            "aria-label",
            `Show project ${index + 1}`
        );

        dot.addEventListener("click", () => {
            if (isAnimating) return;

            currentIndex = index + 1;
            updateCarousel();
        });

        dotsContainer.appendChild(dot);
        return dot;
    });

    function updateCarousel(animate = true) {
        track.style.transition = animate
            ? "transform 450ms ease"
            : "none";

        track.style.transform =
            `translateX(-${currentIndex * 100}%)`;

        const realIndex =
            (currentIndex - 1 + totalSlides) % totalSlides;

        dots.forEach((dot, index) => {
            dot.setAttribute(
                "aria-current",
                index === realIndex ? "true" : "false"
            );
        });

        status.textContent =
            `Project ${realIndex + 1} of ${totalSlides}`;

        isAnimating = animate;
    }

    function moveNext() {
        if (isAnimating) return;

        currentIndex++;
        updateCarousel();
    }

    function movePrevious() {
        if (isAnimating) return;

        currentIndex--;
        updateCarousel();
    }

    nextButton.addEventListener("click", moveNext);
    previousButton.addEventListener("click", movePrevious);

    track.addEventListener("transitionend", () => {
        if (currentIndex === totalSlides + 1) {
            currentIndex = 1;
            updateCarousel(false);
        } else if (currentIndex === 0) {
            currentIndex = totalSlides;
            updateCarousel(false);
        } else {
            isAnimating = false;
        }
    });

    // Allow keyboard navigation when the carousel has focus.
    carousel.addEventListener("keydown", (event) => {
        if (event.key === "ArrowRight") {
            event.preventDefault();
            moveNext();
        } else if (event.key === "ArrowLeft") {
            event.preventDefault();
            movePrevious();
        }
    });

    // Basic touch/swipe support for mobile.
    viewport.addEventListener("touchstart", (event) => {
        touchStartX = event.changedTouches[0].clientX;
    }, { passive: true });

    viewport.addEventListener("touchend", (event) => {
        const touchEndX = event.changedTouches[0].clientX;
        const distance = touchEndX - touchStartX;

        if (Math.abs(distance) < 45) return;

        if (distance < 0) {
            moveNext();
        } else {
            movePrevious();
        }
    }, { passive: true });

    updateCarousel(false);
});