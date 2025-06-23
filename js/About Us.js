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

    // تعريف المتغيرات مرة واحدة فقط
    const cartSidebar = document.getElementById('cartSidebar');
    const searchBox = document.getElementById('searchBox');
    // إغلاق السايدبار أو مربع البحث عند الضغط خارجهم
    document.addEventListener('mousedown', function(e) {
        // إغلاق السايدبار
        if (cartSidebar && cartSidebar.classList.contains('open')) {
            if (!cartSidebar.contains(e.target) && !e.target.closest('#cartIcon') && !e.target.closest('#cartIconCollapse')) {
                cartSidebar.classList.remove('open');
            }
        }
        // إغلاق مربع البحث
        if (searchBox && !searchBox.classList.contains('d-none')) {
            if (!searchBox.contains(e.target) && !e.target.closest('#searchBtn') && !e.target.closest('#searchBtnCollapse')) {
                searchBox.classList.add('d-none');
            }
        }
    });
});
