
        // Mobile menu toggle
        const menuToggle = document.getElementById('menu-toggle');
        const mobileMenu = document.getElementById('mobile-menu');
        
        menuToggle.addEventListener('click', () => {
            menuToggle.classList.toggle('active');
            mobileMenu.classList.toggle('hidden');
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