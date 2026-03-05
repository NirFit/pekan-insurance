# פקאן סוכנות לביטוח - אתר פרימיום

גרסה מעודכנת ומקצועית של אתר סוכנות הביטוח פקאן.

## הפעלה

```bash
open index.html
# או: python3 -m http.server 8080
```

## הגדרות (config.js)

לפני העלאה לייצור - ערוך את `config.js`:

1. **Formspree** – הירשם חינם ב-[formspree.io](https://formspree.io), צור טופס וקבל Form ID.  
   החלף `YOUR_FORMSPREE_ID` ב-ID שקיבלת.

2. **Google Analytics** – הוסף את ה-Measurement ID (G-XXXXXXXXXX) אם יש לך.

## מבנה הפרויקט

- `index.html` - דף הבית
- `styles.css` - עיצוב
- `script.js` - אינטראקטיביות
- `config.js` - הגדרות (Formspree, GA)
- `sitemap.xml` - למנועי חיפוש
- `robots.txt` - הנחיות לרובוטים

## תכונות

- עיצוב RTL מלא לעברית
- רספונסיבי
- טופס צור קשר (Formspree)
- SEO: meta tags, structured data, sitemap
- Lazy loading לתמונות
- Google Analytics (אופציונלי)
