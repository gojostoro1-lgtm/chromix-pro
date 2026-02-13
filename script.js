/**
 * ===================================================
 * CHROMIX - PROFESSIONAL COLOR HARMONY ENGINE
 * Version 2.0.0
 * Author: Ammar
 * 
 * محرك ألوان احترافي - جميع العمليات محلية
 * جاهز للتحويل إلى Android WebView
 * ===================================================
 */

'use strict';

// ========== التهيئة عند تحميل الصفحة ==========
document.addEventListener('DOMContentLoaded', () => {
    initializeApp();
});

/**
 * تهيئة التطبيق وإعداد المستمعات
 */
function initializeApp() {
    // عناصر التحكم
    const hexInput = document.getElementById('hexInput');
    const colorWheel = document.getElementById('colorWheel');
    const colorValues = document.getElementById('colorValues');
    
    // القيم الافتراضية
    const defaultColor = '#6366F1';
    
    // توليد الألوان الافتراضية
    generateAllColorSchemes(defaultColor);
    updateRGBValues(defaultColor, colorValues);
    
    // ===== مستمعات الأحداث =====
    
    // عند تغيير HEX يدوياً
    hexInput.addEventListener('input', function(e) {
        let color = e.target.value;
        
        // التحقق من صحة الـ HEX
        if (isValidHex(color)) {
            colorWheel.value = color;
            generateAllColorSchemes(color);
            updateRGBValues(color, colorValues);
        }
    });
    
    // عند تغيير اللون من عجلة الألوان
    colorWheel.addEventListener('input', function(e) {
        const color = e.target.value;
        hexInput.value = color;
        generateAllColorSchemes(color);
        updateRGBValues(color, colorValues);
    });
}

/**
 * التحقق من صحة كود HEX
 */
function isValidHex(color) {
    return /^#[0-9A-Fa-f]{6}$/.test(color);
}

/**
 * تحديث عرض قيم RGB
 */
function updateRGBValues(hex, element) {
    const rgb = hexToRgb(hex);
    element.textContent = `RGB: ${rgb.r}, ${rgb.g}, ${rgb.b}`;
}

/**
 * تحويل HEX إلى RGB
 */
function hexToRgb(hex) {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return { r, g, b };
}

/**
 * تحويل RGB إلى HSL
 * HSL = Hue, Saturation, Lightness
 */
function rgbToHsl(r, g, b) {
    r /= 255;
    g /= 255;
    b /= 255;
    
    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    let h, s, l = (max + min) / 2;

    if (max === min) {
        h = s = 0;
    } else {
        const d = max - min;
        s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
        
        switch (max) {
            case r: h = (g - b) / d + (g < b ? 6 : 0); break;
            case g: h = (b - r) / d + 2; break;
            case b: h = (r - g) / d + 4; break;
        }
        h /= 6;
    }

    return {
        h: Math.round(h * 360),
        s: Math.round(s * 100),
        l: Math.round(l * 100)
    };
}

/**
 * تحويل HSL إلى HEX
 */
function hslToHex(h, s, l) {
    s /= 100;
    l /= 100;
    
    const c = (1 - Math.abs(2 * l - 1)) * s;
    const x = c * (1 - Math.abs((h / 60) % 2 - 1));
    const m = l - c/2;
    
    let r, g, b;
    
    if (h < 60) { r = c; g = x; b = 0; }
    else if (h < 120) { r = x; g = c; b = 0; }
    else if (h < 180) { r = 0; g = c; b = x; }
    else if (h < 240) { r = 0; g = x; b = c; }
    else if (h < 300) { r = x; g = 0; b = c; }
    else { r = c; g = 0; b = x; }
    
    const toHex = (n) => {
        const hex = Math.round((n + m) * 255).toString(16);
        return hex.length === 1 ? '0' + hex : hex;
    };
    
    return `#${toHex(r)}${toHex(g)}${toHex(b)}`.toUpperCase();
}

/**
 * توليد جميع أنظمة الألوان
 */
function generateAllColorSchemes(baseHex) {
    const rgb = hexToRgb(baseHex);
    const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b);
    
    // توليد كل نظام
    generateMonochromatic(hsl);
    generateComplementary(hsl);
    generateTriadic(hsl);
    generateTetradic(hsl);
    generateAnalogous(hsl);
}

/**
 * نظام أحادي اللون - Monochromatic
 * درجات مختلفة من نفس اللون
 */
function generateMonochromatic(hsl) {
    const container = document.getElementById('monochromaticGrid');
    container.innerHTML = '';
    
    // 5 درجات: غامق - عادي - فاتح
    const colors = [
        hslToHex(hsl.h, hsl.s, Math.max(0, hsl.l - 30)),
        hslToHex(hsl.h, hsl.s, Math.max(0, hsl.l - 15)),
        hslToHex(hsl.h, hsl.s, hsl.l),
        hslToHex(hsl.h, hsl.s, Math.min(100, hsl.l + 15)),
        hslToHex(hsl.h, hsl.s, Math.min(100, hsl.l + 30))
    ];
    
    colors.forEach(color => addColorBox(container, color));
}

/**
 * نظام متكامل - Complementary
 * اللون الأساسي + اللون المقابل (180 درجة)
 */
function generateComplementary(hsl) {
    const container = document.getElementById('complementaryGrid');
    container.innerHTML = '';
    
    const complementHue = (hsl.h + 180) % 360;
    
    const colors = [
        hslToHex(hsl.h, hsl.s, hsl.l),
        hslToHex(complementHue, hsl.s, hsl.l),
        hslToHex(hsl.h, hsl.s - 20, hsl.l + 15),
        hslToHex(complementHue, hsl.s - 20, hsl.l + 15)
    ];
    
    colors.forEach(color => addColorBox(container, color));
}

/**
 * نظام ثلاثي - Triadic
 * 3 ألوان متساوية البعد (120 درجة)
 */
function generateTriadic(hsl) {
    const container = document.getElementById('triadicGrid');
    container.innerHTML = '';
    
    const colors = [
        hslToHex(hsl.h, hsl.s, hsl.l),
        hslToHex((hsl.h + 120) % 360, hsl.s, hsl.l),
        hslToHex((hsl.h + 240) % 360, hsl.s, hsl.l)
    ];
    
    colors.forEach(color => addColorBox(container, color));
}

/**
 * نظام رباعي - Tetradic
 * زوجان من الألوان المتقابلة (90 درجة بين كل لون)
 */
function generateTetradic(hsl) {
    const container = document.getElementById('tetradicGrid');
    container.innerHTML = '';
    
    const colors = [
        hslToHex(hsl.h, hsl.s, hsl.l),
        hslToHex((hsl.h + 90) % 360, hsl.s, hsl.l),
        hslToHex((hsl.h + 180) % 360, hsl.s, hsl.l),
        hslToHex((hsl.h + 270) % 360, hsl.s, hsl.l)
    ];
    
    colors.forEach(color => addColorBox(container, color));
}

/**
 * نظام متجاور - Analogous
 * ألوان متجاورة على دائرة الألوان
 */
function generateAnalogous(hsl) {
    const container = document.getElementById('analogousGrid');
    container.innerHTML = '';
    
    const colors = [
        hslToHex((hsl.h - 40 + 360) % 360, hsl.s, hsl.l),
        hslToHex((hsl.h - 20 + 360) % 360, hsl.s, hsl.l),
        hslToHex(hsl.h, hsl.s, hsl.l),
        hslToHex((hsl.h + 20) % 360, hsl.s, hsl.l),
        hslToHex((hsl.h + 40) % 360, hsl.s, hsl.l)
    ];
    
    colors.forEach(color => addColorBox(container, color));
}

/**
 * إضافة مربع لوني مع معلومات كاملة
 */
function addColorBox(container, hexColor) {
    const colorBox = document.createElement('div');
    colorBox.className = 'color-item';
    colorBox.style.backgroundColor = hexColor;
    
    // إضافة كود HEX
    const hexSpan = document.createElement('span');
    hexSpan.className = 'color-hex';
    hexSpan.textContent = hexColor;
    
    colorBox.appendChild(hexSpan);
    
    // نسخ اللون عند النقر
    colorBox.addEventListener('click', function(e) {
        e.stopPropagation();
        copyToClipboard(hexColor);
        showToast(`✅ تم نسخ ${hexColor}`);
    });
    
    container.appendChild(colorBox);
}

/**
 * نسخ النص إلى الحافظة
 */
function copyToClipboard(text) {
    // إنشاء عنصر نصي مؤقت
    const textArea = document.createElement('textarea');
    textArea.value = text;
    textArea.style.position = 'fixed';
    textArea.style.opacity = '0';
    document.body.appendChild(textArea);
    textArea.select();
    
    try {
        document.execCommand('copy');
    } catch (err) {
        console.error('فشل النسخ:', err);
    }
    
    document.body.removeChild(textArea);
}

/**
 * إظهار رسالة تأكيد
 */
function showToast(message) {
    // البحث عن toast موجود أو إنشاء جديد
    let toast = document.querySelector('.toast-message');
    
    if (!toast) {
        toast = document.createElement('div');
        toast.className = 'toast-message';
        document.body.appendChild(toast);
    }
    
    toast.textContent = message;
    toast.classList.add('show');
    
    setTimeout(() => {
        toast.classList.remove('show');
    }, 2000);
}

/**
 * دالة مساعدة: توليد لون عشوائي
 * للاستخدام المستقبلي
 */
function generateRandomColor() {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}

// تصدير الدوال للاستخدام العام
window.Chromix = {
    generateRandomColor,
    hexToRgb,
    rgbToHsl,
    hslToHex
};