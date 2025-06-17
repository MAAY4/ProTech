document.addEventListener('DOMContentLoaded', () => {
    // ظهور عناصر الصفحه
    function revealOnScroll() {
        document.querySelectorAll('.fade-in').forEach(el => {
            const rect = el.getBoundingClientRect();
            if (rect.top < window.innerHeight - 60) {
                el.classList.add('visible');
            }
        });
    }
    window.addEventListener('scroll', revealOnScroll);
    window.addEventListener('resize', revealOnScroll);
    
    revealOnScroll();
});