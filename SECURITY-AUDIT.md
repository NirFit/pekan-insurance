# דוח סריקת אבטחה – פקאן סוכנות לביטוח

**תאריך:** 12 במרץ 2025  
**סוג:** ביקורת אבטחה סטטית

---

## סיכום מנהלים

בוצעה סריקת אבטחה על אתר פקאן סוכנות לביטוח. האתר הוא אתר סטטי (HTML/CSS/JS) המשתמש ב-Formspree לטופס יצירת קשר ו-Google Analytics (אופציונלי). זוהו מספר שיפורי אבטחה שיושמו.

---

## תיקונים שבוצעו

### 1. Content-Security-Policy (CSP)
- **בעיה:** חסר כותרת CSP – האתר היה חשוף להזרקת סקריפטים ממקורות חיצוניים.
- **תיקון:** נוסף meta tag עם מדיניות CSP:
  - הגבלת סקריפטים ל־`self`, Google Tag Manager, Google Analytics
  - הגבלת סגנונות ל־`self`, Google Fonts, Font Awesome
  - `frame-ancestors 'self'` – מניעת הטמעה ב־iframe (clickjacking)
  - `base-uri 'self'` – מניעת שינוי בסיס ה-URL
  - `form-action` – הגבלת שליחת טפסים

### 2. Permissions-Policy
- **בעיה:** הדפדפן יכול היה לאפשר גישה למצלמה, מיקרופון, מיקום ללא הגבלה.
- **תיקון:** נוסף `Permissions-Policy` שמבטל גישה ל־camera, microphone, geolocation, interest-cohort (FLoC).

### 3. Subresource Integrity (SRI)
- **בעיה:** Font Awesome נטען מ־CDN ללא אימות – סיכון במקרה של פגיעה ב־CDN.
- **תיקון:** נוסף `integrity` ו־`crossorigin="anonymous"` לקובץ Font Awesome 6.5.1.

### 4. סניטציה ולידציה בטופס
- **בעיה:** קלט המשתמש נשלח ל־Formspree ללא ניקוי – סיכון ל־XSS אם הנתונים יוצגו במקום אחר.
- **תיקון:**
  - הסרת תגי HTML (`<...>`)
  - הסרת `javascript:` מ־URLs
  - הסרת מאפייני אירוע (`onclick=`, וכו')
  - ולידציה לפורמט אימייל תקין לפני שליחה

### 5. Referrer Policy
- **קיים:** `strict-origin-when-cross-origin` – מונע דליפת מידע רגיש ב־Referer.

---

## פריטים שנבדקו – ללא בעיה

| פריט | סטטוס |
|------|--------|
| קישורים עם `target="_blank"` | כולם עם `rel="noopener noreferrer"` – מניעת tabnabbing |
| שימוש ב־`innerHTML` | רק מחרוזות סטטיות – אין קלט משתמש |
| `eval()` / `document.write` | לא בשימוש |
| סודות בקוד | `config.js` מכיל placeholders בלבד; Formspree ID ו־GA ID מיועדים לצד הלקוח |

---

## המלצות להמשך

1. **HTTPS:** וודא שהאתר נגיש רק דרך HTTPS (GitHub Pages מטפל בכך כברירת מחדל).
2. **עדכון תלויות:** Font Awesome ו־Google Fonts – עדכן לגרסאות חדשות כשמתפרסמות.
3. **Formspree:** השתמש ב־reCAPTCHA או הגבלת rate ב־Formspree כדי לצמצם ספאם.
4. **ניטור:** שקול שירות ניטור אבטחה (למשל Uptime Robot) לזיהוי השבתות או שינויים חריגים.

---

## קבצים שעודכנו

- `index.html` – CSP, Permissions-Policy, SRI
- `privacy.html` – CSP, Permissions-Policy, SRI
- `script.js` – סניטציה, ולידציית אימייל
