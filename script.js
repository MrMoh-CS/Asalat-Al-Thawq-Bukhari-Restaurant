document.addEventListener("DOMContentLoaded", () => {
    
    // --- 1. منطق فتح وإغلاق قائمة الطعام (Accordion) ---
    const accordionHeaders = document.querySelectorAll(".category-header");
    
    accordionHeaders.forEach(header => {
        header.addEventListener("click", () => {
            const parentItem = header.parentElement;
            
            // تبديل حالة العنصر الحالي (فتح/إغلاق)
            parentItem.classList.toggle("active");
        });
    });

    // --- 2. التحقق التلقائي من حالة عمل المطعم ---
    checkRestaurantStatus();
    setInterval(checkRestaurantStatus, 60000); // تحديث الحالة كل دقيقة

    // --- 3. التنقل الانسيابي بين الأقسام (Smooth Scroll) ---
    const navLinks = document.querySelectorAll("nav ul li a");
    navLinks.forEach(link => {
        link.addEventListener("click", (e) => {
            e.preventDefault();
            const targetId = link.getAttribute("href");
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                targetSection.scrollIntoView({
                    behavior: "smooth",
                    block: "start"
                });
            }
        });
    });

    // --- 4. منطق سلايدر المراجعات (Carousel) ---
    const track = document.getElementById("carouselTrack");
    const dots = document.querySelectorAll(".carousel-dot");
    let currentIndex = 0;

    function goToSlide(index) {
        currentIndex = index;
        
        // الانتقال بمقدار 50% لكل مجموعة (أفقياً باتجاه اليمين بما أن الواجهة RTL)
        if (track) {
            track.style.transform = `translateX(${currentIndex * 50}%)`;
        }

        // تحديث حالة النقاط
        dots.forEach(dot => dot.classList.remove("active"));
        if (dots[currentIndex]) {
            dots[currentIndex].classList.add("active");
        }
    }

    // التنقل عند الضغط اليدوي على النقاط
    dots.forEach(dot => {
        dot.addEventListener("click", (e) => {
            const slideIndex = parseInt(e.target.getAttribute("data-slide"));
            goToSlide(slideIndex);
        });
    });

    // تشغيل التقليب التلقائي كل 6 ثوانٍ (فقط على الأجهزة الأكبر من الجوال)
    setInterval(() => {
        if (window.innerWidth >= 768) {
            let nextIndex = (currentIndex + 1) % 2; // التنقل بالتناوب بين المجموعتين 0 و 1
            goToSlide(nextIndex);
        }
    }, 6000);
});

/**
 * دالة تفاعلية لحساب حالة العمل وعرض شارة منسقة بجانب تفاصيل المطعم
 */
function checkRestaurantStatus() {
    const aboutSection = document.getElementById("about");
    if (!aboutSection) return;

    const now = new Date();
    const currentHour = now.getHours();
    const currentMinute = now.getMinutes();
    const currentTimeInMinutes = (currentHour * 60) + currentMinute;

    const openingTime = (12 * 60) + 30; // 12:30 ظهراً
    const midnight = 24 * 60;          // 12:00 منتصف الليل
    const closingTime = 1 * 60;         // 1:00 بعد منتصف الليل (اليوم التالي)

    let isOpen = false;

    // فترة ما بعد الظهر والمساء
    if (currentTimeInMinutes >= openingTime && currentTimeInMinutes < midnight) {
        isOpen = true;
    } 
    // فترة ما بعد منتصف الليل وحتى الواحدة صباحاً
    else if (currentTimeInMinutes >= 0 && currentTimeInMinutes < closingTime) {
        isOpen = true;
    }

    // إزالة الشارة السابقة للتحديث المباشر
    const oldBadge = document.querySelector(".status-badge");
    if (oldBadge) oldBadge.remove();

    // إنشاء شارة الحالة الجديدة
    const statusBadge = document.createElement("span");
    statusBadge.className = "status-badge";
    
    if (isOpen) {
        statusBadge.innerText = "🟢 مفتوح الآن - حياكم الله";
        statusBadge.style.color = "#2ecc71";
        statusBadge.style.backgroundColor = "rgba(46, 204, 113, 0.1)";
        statusBadge.style.border = "1px solid rgba(46, 204, 113, 0.2)";
    } else {
        statusBadge.innerText = "🔴 مغلق حالياً - نتشرف بكم في أوقات العمل";
        statusBadge.style.color = "#e74c3c";
        statusBadge.style.backgroundColor = "rgba(231, 76, 60, 0.1)";
        statusBadge.style.border = "1px solid rgba(231, 76, 60, 0.2)";
    }

    // تنسيق الشارة لتندمج مع بادجات قسم "حول المطعم"
    statusBadge.style.display = "inline-block";
    statusBadge.style.padding = "8px 20px";
    statusBadge.style.borderRadius = "30px";
    statusBadge.style.fontSize = "14px";
    statusBadge.style.fontWeight = "bold";

    // إضافتها بجانب بادج الأسعار
    const infoBadgesContainer = aboutSection.querySelector(".info-badges");
    if (infoBadgesContainer) {
        infoBadgesContainer.appendChild(statusBadge);
    }
}
