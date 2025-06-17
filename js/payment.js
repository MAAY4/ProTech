// Flip credit card animation
function flipCard() {
    const card = document.getElementById('cardPreview');
    card.classList.toggle('flipped');

    // Smooth transition effect
    card.style.transition = 'transform 0.6s cubic-bezier(0.4, 0, 0.2, 1)';

    // Reset transition after completion
    setTimeout(() => {
        card.style.transition = '';
    }, 600);
}

// Format card number input
document.getElementById('cardNumber').addEventListener('input', function (e) {
    let value = e.target.value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    let formatted = value.replace(/(\d{4})/g, '$1 ').trim();
    e.target.value = formatted.substring(0, 19);

    // Update card preview with animation
    const cardNumber = document.querySelector('.card-number');
    if (value.length > 12) {
        cardNumber.textContent = '•••• •••• •••• ' + value.substring(12, 16);
    } else if (value.length > 8) {
        cardNumber.textContent = '•••• •••• ' + value.substring(8, 12) + ' ' + (value.length > 12 ? value.substring(12, 16) : '••••');
    } else if (value.length > 4) {
        cardNumber.textContent = '•••• ' + value.substring(4, 8) + ' •••• ••••';
    } else {
        cardNumber.textContent = '•••• •••• •••• ••••';
    }

    // Add animation
    cardNumber.style.transform = 'scale(1.05)';
    setTimeout(() => {
        cardNumber.style.transform = 'scale(1)';
    }, 300);
});

// Format expiry date input
document.getElementById('expiryDate').addEventListener('input', function (e) {
    let value = e.target.value.replace(/\D/g, '');
    if (value.length > 2) {
        value = value.substring(0, 2) + '/' + value.substring(2, 4);
    }
    e.target.value = value.substring(0, 5);

    // Update card preview with animation
    const expiryElement = document.querySelector('.expiry-date');
    expiryElement.textContent = value || '12/25';
    expiryElement.style.transform = 'scale(1.1)';
    setTimeout(() => {
        expiryElement.style.transform = 'scale(1)';
    }, 300);
});

// Update card holder name
document.getElementById('cardName').addEventListener('input', function (e) {
    const nameElement = document.querySelector('.card-holder-name');
    nameElement.textContent = e.target.value || 'محمد أحمد';
    nameElement.style.transform = 'scale(1.1)';
    setTimeout(() => {
        nameElement.style.transform = 'scale(1)';
    }, 300);
});

// Update CVV code
document.getElementById('cvv').addEventListener('input', function (e) {
    let value = e.target.value.replace(/\D/g, '');
    e.target.value = value.substring(0, 4);

    // Update card preview
    const cvvElement = document.querySelector('.card-cvv');
    if (value.length > 0) {
        cvvElement.textContent = 'CVV: ' + '•'.repeat(value.length) + (value.length < 3 ? '•'.repeat(3 - value.length) : '');
    } else {
        cvvElement.textContent = 'CVV: •••';
    }
});

// اختيار طريقة الدفع
function selectPayment(method) {
    // إزالة التنشيط من جميع الأزرار
    document.querySelectorAll('.method').forEach(item => {
        item.classList.remove('active');
    });

    // تنشيط الزر المحدد
    event.currentTarget.classList.add('active');

    // تغيير زر الدفع الرئيسي حسب الاختيار
    const payBtn = document.getElementById('payButton');
    if (method === 'installment') {
        payBtn.innerHTML = '<i class="fas fa-credit-card"></i> اختيار خطة التقسيط';
        payBtn.style.background = 'linear-gradient(45deg, var(--installment), #7d3cb1)';
    } else if (method === 'cash') {
        payBtn.innerHTML = '<i class="fas fa-money-bill-wave"></i> تأكيد الدفع عند الاستلام';
        payBtn.style.background = 'linear-gradient(45deg, var(--secondary), #e09a30)';
    } else {
        payBtn.innerHTML = '<i class="fas fa-lock"></i> تأكيد الدفع';
        payBtn.style.background = 'linear-gradient(45deg, var(--accent), #0087c1)';
    }
}

// Form submission
document.getElementById('payButton').addEventListener('click', function (e) {
    e.preventDefault();

    // Simulate payment processing
    const originalText = this.innerHTML;
    this.innerHTML = '<i class="fas fa-spinner fa-spin"></i> جاري المعالجة...';
    this.disabled = true;

    setTimeout(() => {
        // Show success (in a real app, you'd check payment status)
        this.innerHTML = '<i class="fas fa-check"></i> تم الدفع بنجاح!';
        this.style.background = 'linear-gradient(45deg, var(--success), #27ae60)';

        // Redirect after 2 seconds
        setTimeout(() => {
            alert('تمت عملية الدفع بنجاح! شكراً لشرائك.');
            // window.location.href = 'success.html';
        }, 2000);
    }, 3000);
});

// تفعيل زر التقسيط افتراضياً
document.addEventListener('DOMContentLoaded', function () {
    selectPayment('installment');
});