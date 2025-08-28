// Get the menu toggle button and the mobile menu element
const menuToggle = document.getElementById('menu-toggle');
const mobileMenu = document.getElementById('mobile-menu');

// Get all the links inside the mobile menu
const menuLinks = document.querySelectorAll("#mobile-menu a"); 

// Add a click event listener to the menu toggle button
menuToggle.addEventListener('click', () => {
    // Toggle the 'active' class on the menu toggle button
    // This is often used to change the icon (e.g., from a hamburger to an 'X')
    menuToggle.classList.toggle('active');
    
    // Toggle the 'hidden' class on the mobile menu to show or hide it
    mobileMenu.classList.toggle('hidden');
});

// Add a click event listener to each link inside the mobile menu
menuLinks.forEach(link => {
    link.addEventListener("click", () => {
        // Hide the mobile menu by adding the 'hidden' class
        mobileMenu.classList.add("hidden");
        
        // Remove the 'active' class from the menu toggle button
        // This resets the icon back to its original state (e.g., the hamburger)
        menuToggle.classList.remove("active");
    });
});
        
        // Sticky header effect
        const header = document.querySelector('.header');
        window.addEventListener('scroll', () => {
            if (window.scrollY > 50) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
        });
        
        // Review carousel
        const reviewsContainer = document.getElementById('reviews-container');
        const reviewItems = document.querySelectorAll('.review-item');
        const prevButton = document.getElementById('prev-review');
        const nextButton = document.getElementById('next-review');
        const indicators = document.querySelectorAll('.review-indicator');
        
        let currentIndex = 0;
        
        function showReview(index) {
            // Hide all reviews
            reviewItems.forEach(item => item.classList.remove('active'));
            indicators.forEach(ind => ind.classList.remove('active'));
            
            // Show selected review
            reviewItems[index].classList.add('active');
            indicators[index].classList.add('active');
            
            // Move container
            reviewsContainer.style.transform = `translateX(-${index * 100}%)`;
            currentIndex = index;
        }
        
        prevButton.addEventListener('click', () => {
            const newIndex = (currentIndex - 1 + reviewItems.length) % reviewItems.length;
            showReview(newIndex);
        });
        
        nextButton.addEventListener('click', () => {
            const newIndex = (currentIndex + 1) % reviewItems.length;
            showReview(newIndex);
        });
        
        // Add click event to indicators
        indicators.forEach((indicator, index) => {
            indicator.addEventListener('click', () => {
                showReview(index);
            });
        });
        
        // Initialize first review
        showReview(0);
        
        // Smooth scrolling for anchor links
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function(e) {
                e.preventDefault();
                
                const targetId = this.getAttribute('href');
                if (targetId === '#') return;
                
                const targetElement = document.querySelector(targetId);
                if (targetElement) {
                    // Close mobile menu if open
                    if (!mobileMenu.classList.contains('hidden')) {
                        menuToggle.classList.remove('active');
                        mobileMenu.classList.add('hidden');
                    }
                    
                    window.scrollTo({
                        top: targetElement.offsetTop - 80,
                        behavior: 'smooth'
                    });
                }
            });
        });
       