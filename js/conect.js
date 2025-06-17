    // Toggle Search Box
    const searchBtn = document.getElementById("searchBtn");
    const searchBox = document.getElementById("searchBox");
    searchBtn.addEventListener("click", () => {
    searchBox.classList.toggle("d-none");
});

function openModal() {
    document.getElementById("policyModal").style.display = "flex";
}

function closeModal() {
    document.getElementById("policyModal").style.display = "none";
}

window.onclick = function(event) {
    const modal = document.getElementById("policyModal");
    if (event.target === modal) {
        closeModal();
    }
}

    const cartIcon = document.getElementById('cartIcon');
    const cartSidebar = document.getElementById('cartSidebar');
    const closeCartBtn = document.getElementById('closeCartBtn');
    const cartItems = document.getElementById('cartItems');
    const emptyMessage = document.getElementById('emptyMessage');

    cartIcon.onclick = () => {
        cartSidebar.classList.add('open');
        updateCartView();
    };

    closeCartBtn.onclick = () => {
        cartSidebar.classList.remove('open');
    };

    function updateCartView() {
        const products = JSON.parse(localStorage.getItem('cart')) || [];
        cartItems.innerHTML = '';

        if (products.length > 0) {
        emptyMessage.style.display = 'none';
        products.forEach(p => {
            const item = document.createElement('div');
            item.innerHTML = `<strong>${p.name}</strong> - ${p.price} جنيه`;
            cartItems.appendChild(item);
        });
        } else {
        emptyMessage.style.display = 'block';
        }
    }

    function returnToShop() {
        window.location.href = 'product.html'; 
    }

    function addToCart(product) {
        const cart = JSON.parse(localStorage.getItem('cart')) || [];
        cart.push(product);
        localStorage.setItem('cart', JSON.stringify(cart));
    }

    // addToCart({ name: 'منتج 1', price: 100 });

document.addEventListener('DOMContentLoaded', function () {
    // إنشاء عناصر عائمة إضافية
    const floatingContainer = document.querySelector('.floating-elements');
    for (let i = 0; i < 5; i++) {
        const element = document.createElement('div');
        element.className = 'floating-element';
        const size = Math.random() * 100 + 50;
        element.style.width = `${size}px`;
        element.style.height = `${size}px`;
        element.style.top = `${Math.random() * 100}%`;
        element.style.left = `${Math.random() * 100}%`;
        element.style.animationDelay = `${Math.random() * 15}s`;
        element.style.animationDuration = `${Math.random() * 20 + 10}s`;
        floatingContainer.appendChild(element);
    }

    // تأثيرات عند التمرير
    window.addEventListener('scroll', function () {
        const scrollPosition = window.scrollY;
        const contactSection = document.querySelector('.contact-section');

        if (scrollPosition > 100) {
            contactSection.style.transform = 'translateY(0)';
            contactSection.style.opacity = '1';
        }
    });

    // معالجة إرسال النموذج
    const contactForm = document.getElementById('contactForm');
    const successMessage = document.getElementById('successMessage');

    contactForm.addEventListener('submit', function (e) {
        e.preventDefault();

        // إخفاء جميع رسائل الخطأ
        document.querySelectorAll('.error-message').forEach(msg => {
            msg.style.display = 'none';
        });

        // إزالة حدود الخطأ
        document.querySelectorAll('.error-field').forEach(field => {
            field.classList.remove('error-field');
        });

        // التحقق من الحقول الأساسية
        let isValid = true;

        if (!document.getElementById('name').value) {
            document.getElementById('nameError').style.display = 'block';
            document.getElementById('name').classList.add('error-field');
            isValid = false;
        }

        const email = document.getElementById('email').value;
        if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            document.getElementById('emailError').style.display = 'block';
            document.getElementById('email').classList.add('error-field');
            isValid = false;
        }

        const phone = document.getElementById('phone').value;
        if (!phone || !/^[0-9]{10,15}$/.test(phone)) {
            document.getElementById('phoneError').style.display = 'block';
            document.getElementById('phone').classList.add('error-field');
            isValid = false;
        }

        // التحقق من نوع الرسالة
        const selectedType = document.querySelector('.type-option.active');
        if (!selectedType) {
            document.getElementById('typeError').style.display = 'block';
            isValid = false;
        }

        // التحقق من حقل الرسالة المناسب
        const type = selectedType ? selectedType.getAttribute('data-type') : null;
        let messageField = null;

        if (type === 'complaint') {
            messageField = document.getElementById('complaint');
            if (!messageField.value) {
                document.getElementById('complaintError').style.display = 'block';
                messageField.classList.add('error-field');
                isValid = false;
            }
        } else if (type === 'suggestion') {
            messageField = document.getElementById('suggestion');
            if (!messageField.value) {
                document.getElementById('suggestionError').style.display = 'block';
                messageField.classList.add('error-field');
                isValid = false;
            }
        } else {
            messageField = document.getElementById('message');
            if (!messageField.value) {
                document.getElementById('messageError').style.display = 'block';
                messageField.classList.add('error-field');
                isValid = false;
            }
        }

        if (!isValid) {
            // التمرير إلى أول حقل به خطأ
            const firstError = document.querySelector('.error-field, .error-message[style*="display: block"]');
            if (firstError) {
                firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
            return;
        }

        // هنا يمكنك إضافة كود إرسال النموذج إلى الخادم
        // لمثالنا سنستخدم setTimeout لمحاكاة الإرسال
        const submitBtn = contactForm.querySelector('.btn');
        submitBtn.textContent = 'جاري الإرسال...';
        submitBtn.disabled = true;

        setTimeout(() => {
            // إظهار رسالة النجاح
            successMessage.style.display = 'block';

            // إعادة تعيين النموذج
            contactForm.reset();

            // إعادة تعيين حقول النص
            document.querySelectorAll('.textarea-container').forEach(container => {
                container.classList.remove('visible');
            });
            document.getElementById('generalMessage').classList.add('visible');

            // إعادة تعيين نوع الرسالة
            typeOptions.forEach(opt => opt.classList.remove('active'));

            // إعادة تعيين الزر
            submitBtn.textContent = 'إرسال الرسالة';
            submitBtn.disabled = false;

            // إخفاء رسالة النجاح بعد 5 ثواني
            setTimeout(() => {
                successMessage.style.display = 'none';
            }, 5000);

            // التمرير إلى أعلى الصفحة لرؤية رسالة النجاح
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        }, 1500);
    });

    // وظائف الأيقونات
    document.getElementById('whatsappContact').addEventListener('click', function () {
        window.open('https://wa.me/966501234567', '_blank');
    });

    document.getElementById('phoneContact').addEventListener('click', function () {
        window.open('tel:+966111234567', '_blank');
    });

    document.getElementById('emailContact').addEventListener('click', function () {
        window.location.href = 'mailto:info@example.com';
    });

    // تغيير نوع الرسالة
    const typeOptions = document.querySelectorAll('.type-option');
    const complaintDetails = document.getElementById('complaintDetails');
    const suggestionDetails = document.getElementById('suggestionDetails');
    const generalMessage = document.getElementById('generalMessage');

    typeOptions.forEach(option => {
        option.addEventListener('click', function () {
            typeOptions.forEach(opt => opt.classList.remove('active'));
            this.classList.add('active');

            // إخفاء جميع الحقول أولاً
            document.querySelectorAll('.textarea-container').forEach(container => {
                container.classList.remove('visible');
            });

            const type = this.getAttribute('data-type');
            let targetContainer;

            if (type === 'complaint') {
                targetContainer = complaintDetails;
            } else if (type === 'suggestion') {
                targetContainer = suggestionDetails;
            } else {
                targetContainer = generalMessage;
            }

            // إظهار الحقل المختار
            targetContainer.classList.add('visible');
        });
    });
});