// Carousel functionality
let currentSlide = 0;
const slides = document.querySelectorAll('.carousel-item');
const indicators = document.querySelectorAll('.indicator');
const totalSlides = slides.length;

// Initialize the carousel
function initCarousel() {
    if (slides.length === 0) return;
    
    // Show the first slide
    showSlide(0);
    
    // Auto-advance the carousel every 5 seconds
    setInterval(() => {
        moveCarousel(1);
    }, 5000);
}

// Show a specific slide
function showSlide(index) {
    // Hide all slides
    slides.forEach(slide => {
        slide.classList.remove('active');
    });
    
    // Deactivate all indicators
    indicators.forEach(indicator => {
        indicator.classList.remove('active');
    });
    
    // Show the current slide and activate its indicator
    slides[index].classList.add('active');
    indicators[index].classList.add('active');
    
    // Update the current slide index
    currentSlide = index;
}

// Move the carousel by a certain number of slides
function moveCarousel(direction) {
    let newIndex = currentSlide + direction;
    
    // Handle wrapping around at the ends
    if (newIndex >= totalSlides) {
        newIndex = 0;
    } else if (newIndex < 0) {
        newIndex = totalSlides - 1;
    }
    
    showSlide(newIndex);
}

// Set the carousel to a specific slide (for indicator clicks)
function setCarousel(index) {
    showSlide(index);
}

// Initialize the carousel when the page loads
document.addEventListener('DOMContentLoaded', initCarousel);

// Mobile navigation toggle
function toggleMobileNav() {
    const nav = document.querySelector('nav ul');
    nav.classList.toggle('active');
}

// Smooth scrolling for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        
        const targetId = this.getAttribute('href');
        const targetElement = document.querySelector(targetId);
        
        if (targetElement) {
            window.scrollTo({
                top: targetElement.offsetTop - 100,
                behavior: 'smooth'
            });
        }
    });
});