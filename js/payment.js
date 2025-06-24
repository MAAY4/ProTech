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
    const cardForm = document.getElementById('card-details-form');

    if (method === 'card') {
        cardForm.classList.remove('disabled');
        cardForm.querySelectorAll('input').forEach(input => input.disabled = false);
        payBtn.innerHTML = '<i class="fas fa-lock"></i> تأكيد الدفع';
        payBtn.style.background = 'linear-gradient(45deg, var(--primary), #1a7b8b)';
    } else if (method === 'installment') {
        /*  بداية تفاعلات ذر الدفع بالتقسيط */
        /*
        cardForm.classList.remove('disabled');
        cardForm.querySelectorAll('input').forEach(input => input.disabled = false);
        payBtn.innerHTML = '<i class="fas fa-credit-card"></i> اختيار خطة التقسيط';
        payBtn.style.background = 'linear-gradient(45deg, var(--installment), #7d3cb1)';
        */
        /*  نهاية تفاعلات ذر الدفع بالتقسيط */
    } else if (method === 'cash') {
        cardForm.classList.add('disabled');
        cardForm.querySelectorAll('input').forEach(input => input.disabled = true);
        payBtn.innerHTML = '<i class="fas fa-money-bill-wave"></i> تأكيد الدفع عند الاستلام';
        payBtn.style.background = 'linear-gradient(45deg, var(--secondary), #e09a30)';
    }
}

// Form submission
document.getElementById('payButton').addEventListener('click', function (e) {
    e.preventDefault();

    // تحقق من طريقة الدفع
    const selectedMethod = document.querySelector('.method.active');
    if (selectedMethod && selectedMethod.getAttribute('onclick')) {
        if (selectedMethod.getAttribute('onclick').includes("'card'")) {
            // تحقق من بيانات البطاقة
            const cardNumber = document.getElementById('cardNumber').value.trim();
            const cardName = document.getElementById('cardName').value.trim();
            const expiryDate = document.getElementById('expiryDate').value.trim();
            const cvv = document.getElementById('cvv').value.trim();
            let valid = true;
            let message = '';
            if (!/^\d{16}$/.test(cardNumber.replace(/\s/g, ''))) {
                valid = false;
                message = 'يرجى إدخال رقم بطاقة صحيح (16 رقم)';
            } else if (cardName.length < 3) {
                valid = false;
                message = 'يرجى إدخال اسم حامل البطاقة بشكل صحيح';
            } else if (!/^\d{2}\/\d{2}$/.test(expiryDate)) {
                valid = false;
                message = 'يرجى إدخال تاريخ انتهاء صحيح (MM/YY)';
            } else if (!/^\d{3,4}$/.test(cvv)) {
                valid = false;
                message = 'يرجى إدخال رمز أمان صحيح (CVV)';
            }
            if (!valid) {
                showToast(message, 'error');
                this.disabled = false;
                this.innerHTML = '<i class="fas fa-lock"></i> تأكيد الدفع';
                return;
            }
            // تحقق من وجود عنوان
            if (!addresses || addresses.length === 0) {
                showToast('يرجى إضافة عنوان قبل إتمام الدفع', 'error');
                this.disabled = false;
                this.innerHTML = '<i class="fas fa-lock"></i> تأكيد الدفع';
                return;
            }
        } else if (selectedMethod.getAttribute('onclick').includes("'cash'")) {
            // تحقق من وجود عنوان للدفع عند الاستلام
            if (!addresses || addresses.length === 0) {
                showToast('يرجى إضافة عنوان قبل إتمام الدفع عند الاستلام', 'error');
                this.disabled = false;
                this.innerHTML = '<i class="fas fa-money-bill-wave"></i> تأكيد الدفع عند الاستلام';
                return;
            }
        }
    }

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
            window.location.href = 'product.html';
        }, 1000);
    }, 2000);
});

// تفعيل زر الدفع بالبطاقة افتراضياً
document.addEventListener('DOMContentLoaded', function () {
    const cardPaymentMethod = document.querySelector('.method[onclick*="\'card\'"]');
    if (cardPaymentMethod) {
        cardPaymentMethod.click();
    }
});

// تفعيل زر التقسيط افتراضياً
/* بداية تفعيل زر التقسيط افتراضياً */
/*
document.addEventListener('DOMContentLoaded', function () {
    selectPayment('installment');
});
*/
/* نهاية تفعيل زر التقسيط افتراضياً */

// ========== Address Modal Logic ==========
const addressBtn = document.getElementById('add-address-btn');
const addressModal = document.getElementById('address-modal');
const closeAddressModal = document.getElementById('close-address-modal');
const governorateSelect = document.getElementById('address-governorate');
const citySelect = document.getElementById('address-city');
const addressForm = document.getElementById('address-form');
const addressList = document.getElementById('address-list');
let editingAddressIndex = null;
let addresses = [];

const governorates = [
    'القاهرة', 'الجيزة', 'الإسكندرية', 'الدقهلية', 'البحر الأحمر', 'البحيرة', 'الفيوم', 'الغربية',
    'الإسماعيلية', 'المنوفية', 'المنيا', 'القليوبية', 'الوادي الجديد', 'السويس', 'اسوان', 'اسيوط',
    'بني سويف', 'بورسعيد', 'دمياط', 'الشرقية', 'جنوب سيناء', 'كفر الشيخ', 'مطروح', 'الأقصر',
    'قنا', 'شمال سيناء', 'سوهاج'
];

const citiesByGovernorate = {
    'القاهرة': [
        'المعادي','مدينة نصر','مصر الجديدة','حلوان','شبرا','الزيتون','عين شمس','المرج','التجمع','المقطم','السيدة زينب','الزمالك','العباسية','روض الفرج','الوايلي','المطرية','البساتين','دار السلام','الخليفة','الشرابية','بولاق','شبرا الخيمة','مدينة بدر','مدينة الشروق','مدينة 15 مايو','مدينة القاهرة الجديدة','مدينة السلام','مدينة المستقبل','مدينة النهضة','مدينة حدائق العاصمة','مدينة المعصرة','مدينة النزهة','مدينة الساحل','مدينة الأميرية'
    ],
    'الجيزة': [
        'الدقي','العجوزة','الهرم','فيصل','6 أكتوبر','الشيخ زايد','البدرشين','العياط','أوسيم','الحوامدية','كرداسة','منشأة القناطر','أبو النمرس','الصف','أطفيح','الواحات البحرية','حدائق أكتوبر','أكتوبر الجديدة','مدينة سفنكس الجديدة','مدينة زايد الجديدة','مدينة الواحات'
    ],
    'الإسكندرية': [
        'سيدي جابر','محرم بك','العجمي','المنتزه','برج العرب','العامرية','الجمرك','المعمورة','المندرة','اللبان','كرموز','العطارين','باكوس','سيدي بشر'
    ],
    'الدقهلية': [
        'المنصورة','طلخا','ميت غمر','دكرنس','منية النصر','الجمالية','شربين','بلقاس','السنبلاوين','أجا','تمي الأمديد','بني عبيد','المطرية','نبروه','المنزلة','الكردي','محلة دمنة','ميت سلسيل','الستاموني'
    ],
    'البحر الأحمر': [
        'الغردقة','رأس غارب','سفاجا','القصير','مرسى علم','شلاتين','حلايب'
    ],
    'البحيرة': [
        'دمنهور','كفر الدوار','رشيد','إيتاي البارود','أبو حمص','الدلنجات','المحمودية','الرحمانية','شبراخيت','حوش عيسى','إدكو','أبو المطامير','وادي النطرون','النوبارية الجديدة','بدر','كوم حمادة'
    ],
    'الفيوم': [
        'سنورس','إطسا','إبشواي','يوسف الصديق','طامية','الحادقة','الفيوم الجديدة'
    ],
    'الغربية': [
        'طنطا','المحلة الكبرى','كفر الزيات','زفتى','السنطة','بسيون','سمنود','قطور'
    ],
    'الإسماعيلية': [
        'فايد','القنطرة شرق','القنطرة غرب','التل الكبير','أبو صوير','القصاصين'
    ],
    'المنوفية': [
        'شبين الكوم','منوف','سرس الليان','أشمون','الباجور','بركة السبع','تلا','الشهداء','قويسنا','السادات'
    ],
    'المنيا': [
        'ملوي','مطاي','بني مزار','أبو قرقاص','سمالوط','دير مواس','العدوة','مغاغة'
    ],
    'القليوبية': [
        'بنها','شبرا الخيمة','قليوب','القناطر الخيرية','طوخ','قها','كفر شكر','الخانكة','شبين القناطر','الخصوص','العبور','العبور الجديدة','العبور الصناعية','العبور 2'
    ],
    'الوادي الجديد': [
        'الخارجة','الداخلة','الفرافرة','باريس','بلاط','شرق العوينات','غرب الموهوب','الموهوب'
    ],
    'السويس': [
        'عتاقة','الجناين','الأربعين','فيصل'
    ],
    'اسوان': [
        'دراو','كوم أمبو','نصر النوبة','إدفو','كلابشة','أبو سمبل السياحية','مدينة أسوان الجديدة'
    ],
    'اسيوط': [
        'ديروط','منفلوط','القوصية','أبنوب','أبو تيج','الغنايم','ساحل سليم','البداري','صدفا','مدينة أسيوط الجديدة'
    ],
    'بني سويف': [
        'الواسطى','ناصر','إهناسيا','ببا','سمسطا','الفشن','مدينة بني سويف الجديدة'
    ],
    'بورسعيد': [
        'بورفؤاد','الزهور','الضواحي','العرب','المناخ','الشرق','الجنوب'
    ],
    'دمياط': [
        'رأس البر','فارسكور','كفر سعد','الزرقا','السرو','كفر البطيخ','عزبة البرج','ميت أبو غالب','دمياط الجديدة'
    ],
    'الشرقية': [
        'الزقازيق','العاشر من رمضان','منيا القمح','بلبيس','مشتول السوق','القنايات','أبو حماد','أبو كبير','الإبراهيمية','فاقوس','الصالحية الجديدة','كفر صقر','أولاد صقر','الحسينية','ديرب نجم','ههيا','القرين','صان الحجر','منشأة أبو عمر'
    ],
    'جنوب سيناء': [
        'طور سيناء','شرم الشيخ','دهب','نويبع','طابا','سانت كاترين','أبو رديس','أبو زنيمة','رأس سدر'
    ],
    'كفر الشيخ': [
        'دسوق','فوه','مطوبس','سيدي سالم','قلين','الحامول','بلطيم','الرياض','بيلا','برج البرلس','مصيف بلطيم'
    ],
    'مطروح': [
        'مرسى مطروح','الحمام','العلمين','الضبعة','النجيلة','سيدي براني','السلوم','سيوة','مدينة العلمين الجديدة','مدينة مرسى مطروح الجديدة'
    ],
    'الأقصر': [
       'إسنا','أرمنت','الزينية','الطود','البياضية','القرنة','أرمنت الحيط','مدينة طيبة الجديدة'
    ],
    'قنا': [
        'نجع حمادي','دشنا','قفط','قوص','نقادة','فرشوط','أبوتشت','الوقف','مدينة قنا الجديدة'
    ],
    'شمال سيناء': [
        'العريش','بئر العبد','الشيخ زويد','رفح','الحسنة','نخل','مدينة العريش الجديدة'
    ],
    'سوهاج': [
        'أخميم','المراغة','البلينا','جرجا','جهينة','ساقلتة','طما','طهطا','دار السلام','المنشأة','العسيرات','مدينة سوهاج الجديدة'
    ]
};

governorates.forEach(gov => {
    const option = document.createElement('option');
    option.value = gov;
    option.textContent = gov;
    governorateSelect.appendChild(option);
});

governorateSelect.addEventListener('change', function() {
    const selectedGov = this.value;
    citySelect.innerHTML = '';
    if (citiesByGovernorate[selectedGov]) {
        citiesByGovernorate[selectedGov].forEach(city => {
            const option = document.createElement('option');
            option.value = city;
            option.textContent = city;
            citySelect.appendChild(option);
        });
    } else {
        const option = document.createElement('option');
        option.value = '';
        option.textContent = 'اختر المدينة';
        citySelect.appendChild(option);
    }
});

// عند تحميل الصفحة، إذا كان هناك محافظة مختارة، عبئ المدن
if (governorateSelect.value) {
    const event = new Event('change');
    governorateSelect.dispatchEvent(event);
}

addressBtn.addEventListener('click', () => {
    addressModal.style.display = 'block';
});
closeAddressModal.addEventListener('click', () => {
    addressModal.style.display = 'none';
});
window.addEventListener('click', (e) => {
    if (e.target === addressModal) {
        addressModal.style.display = 'none';
    }
});

function renderAddresses() {
    addressList.innerHTML = '';
    addresses.forEach((address, idx) => {
        const div = document.createElement('div');
        div.className = 'address-item';
        div.innerHTML = `
            <div class="address-details">
                <strong>${address.name}</strong> <br>
                <span><i class="fas fa-phone"></i> ${address.phone}</span><br>
                <span><i class="fas fa-map-marker-alt"></i> ${address.line1}${address.line2 ? '، ' + address.line2 : ''}</span><br>
                <span>${address.city}, ${address.governorate}, ${address.zip}</span>
            </div>
            <div class="address-actions">
                <button class="edit-address" title="تعديل" data-idx="${idx}"><i class="fas fa-edit"></i></button>
                <button class="delete-address" title="حذف" data-idx="${idx}"><i class="fas fa-trash"></i></button>
            </div>
        `;
        addressList.appendChild(div);
    });
}

function showToast(message, type = 'success') {
    // إزالة أي Toast موجود
    document.querySelectorAll('.custom-toast').forEach(e => e.remove());
    const toast = document.createElement('div');
    toast.className = `custom-toast custom-toast-${type}`;
    toast.innerHTML = `<i class="fas ${type === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle'}"></i> ${message}`;
    document.body.appendChild(toast);
    setTimeout(() => { toast.classList.add('show'); }, 10);
    setTimeout(() => { toast.classList.remove('show'); setTimeout(()=>toast.remove(), 400); }, 2500);
}

function showConfirm(message, onConfirm) {
    // إزالة أي نافذة تأكيد موجودة
    document.querySelectorAll('.custom-confirm').forEach(e => e.remove());
    const overlay = document.createElement('div');
    overlay.className = 'custom-confirm-overlay';
    const confirmBox = document.createElement('div');
    confirmBox.className = 'custom-confirm';
    confirmBox.innerHTML = `
        <div class="custom-confirm-message">${message}</div>
        <div class="custom-confirm-actions">
            <button class="btn-confirm-yes">نعم</button>
            <button class="btn-confirm-no">إلغاء</button>
        </div>
    `;
    overlay.appendChild(confirmBox);
    document.body.appendChild(overlay);
    confirmBox.querySelector('.btn-confirm-yes').onclick = () => { overlay.remove(); onConfirm(); };
    confirmBox.querySelector('.btn-confirm-no').onclick = () => overlay.remove();
}

addressForm.addEventListener('submit', function(e) {
    e.preventDefault();
    if (!this.checkValidity()) {
        this.reportValidity();
        return;
    }
    const address = {
        name: this['address-name'].value,
        phone: this['address-phone'].value,
        line1: this['address-line1'].value,
        line2: this['address-line2'].value,
        governorate: this['address-governorate'].value,
        city: this['address-city'].value,
        zip: this['address-zip'].value
    };
    if (editingAddressIndex !== null) {
        addresses[editingAddressIndex] = address;
        editingAddressIndex = null;
    } else {
        addresses.push(address);
    }
    renderAddresses();
    addressModal.style.display = 'none';
    this.reset();
    showToast('تمت إضافة العنوان بنجاح!','success');
});

addressList.addEventListener('click', function(e) {
    if (e.target.closest('.edit-address')) {
        const idx = +e.target.closest('.edit-address').dataset.idx;
        const address = addresses[idx];
        addressForm['address-name'].value = address.name;
        addressForm['address-phone'].value = address.phone;
        addressForm['address-line1'].value = address.line1;
        addressForm['address-line2'].value = address.line2;
        addressForm['address-governorate'].value = address.governorate;
        addressForm['address-city'].value = address.city;
        addressForm['address-zip'].value = address.zip;
        editingAddressIndex = idx;
        addressModal.style.display = 'block';
    } else if (e.target.closest('.delete-address')) {
        const idx = +e.target.closest('.delete-address').dataset.idx;
        showConfirm('هل أنت متأكد من حذف هذا العنوان؟', function() {
            addresses.splice(idx, 1);
            renderAddresses();
            showToast('تم حذف العنوان بنجاح!','success');
        });
    }
});
