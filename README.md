# Nebras Platform

مشروع ويب متكامل يتضمن عدة مشاريع فرعية متعلقة بمنصة Nebras.

## هيكل المشروع

```
nebras-platform/
├── index.html              # الصفحة الرئيسية
├── package.json            # ملف التكوين الرئيسي
├── test.js                 # ملف الاختبارات الرئيسي
├── test-results/           # نتائج الاختبارات
├── lighthouse-site/        # مشروع Lighthouse
├── nebras-final/           # الإصدار النهائي
├── nebras-site/            # موقع Nebras الرئيسي
├── nebras-v3/              # الإصدار الثالث
│   ├── index.html
│   ├── package.json
│   ├── test.js
│   └── run-test.js
└── nebras-v3-deploy/       # نشر الإصدار الثالث
```

## المشاريع الفرعية

### ١. Lighthouse Site
صفحة Lighthouse للتطبيق.

### ٢. Nebras Site
الموقع الرئيسي لمنصة Nebras.

### ٣. Nebras Final
الإصدار النهائي من المنصة.

### ٤. Nebras V3
الإصدار الثالث مع تحسينات جديدة.

## كيفية التشغيل

### تشغيل المشروع الرئيسي
```bash
# فتح ملف index.html في المتصفح
```

### تشغيل اختبارات V3
```bash
cd nebras-v3
npm install
npm test
```

## التقنيات المستخدمة

- HTML5
- JavaScript
- نظام اختبارات متكامل

## المساهمة

للمساهمة في المشروع، يرجى التواصل مع فريق التطوير.

## الترخيص

جميع الحقوق محفوظة © 2024 Nebras Platform
