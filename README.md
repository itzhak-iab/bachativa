# בחטיבה — bachativa.com

אתר "בחטיבה" — הפרסומים השבועיים של חטיבת חשמונאים.

## ארכיטקטורה
- **Firebase Hosting** — האירוח הסטטי + SSL חינמי
- **Firestore** — אוסף `newsletters` עם metadata של כל גיליון
- **GA4** — Tracking ID `G-DLNEH3K485`
- **דומיין**: bachativa.com (Namecheap → Firebase)

## מבנה הקבצים
```
.
├── firebase.json              קונפיג Firebase Hosting + Firestore
├── .firebaserc                project alias (bachativa)
├── firestore.rules            כללי גישה (read-only ציבורי)
├── firestore.indexes.json     אינדקסים
├── storage.rules              כללי Storage
├── package.json               npm scripts (seed/deploy)
├── scripts/
│   └── seed-firestore.js      טעינה חד-פעמית של הגיליונות הקיימים
└── public/                    מה שמתפרסם
    ├── index.html             הדף הראשי (טוען דינמית מ-Firestore)
    ├── firebase-config.js     ⚠️ צריך לעדכן אחרי יצירת הפרויקט
    ├── 404.html
    ├── robots.txt
    ├── sitemap.xml
    ├── images/                לוגו ותמונות UI
    └── newsletters/
        ├── *.pdf              קבצי PDF של הגיליונות (HE + EN)
        └── covers/*.jpg       תמונות שער
```

## Setup ראשוני (חד-פעמי)

### 1. Firebase project
```bash
npm install -g firebase-tools
firebase login
firebase use --add   # בחר את הפרויקט bachativa
```

### 2. Deploy ראשון
```bash
firebase deploy
```

### 3. Seed Firestore (חד-פעמי)
הורד service account key מ-Firebase Console (Project Settings → Service accounts →
Generate new private key), שמור כ-`serviceAccountKey.json` בתיקיית הroot.
```bash
npm install
npm run seed
```

### 4. עדכן את `public/firebase-config.js`
Firebase Console → Project Settings → General → Your apps → Web app →
SDK setup → Config. העתק את הערכים ל-`firebase-config.js`.

## הוספת גיליון חדש

### א. הוסף את הקבצים
1. שים את ה-PDF (עברית, ואנגלית אם קיים) ב-`public/newsletters/`.
2. צור תמונת שער 800px-רוחב מהעמוד הראשון של ה-PDF, שמור כ-`public/newsletters/covers/cover-NN.jpg`.

### ב. הוסף doc ל-Firestore
דרך Firebase Console (Firestore Database → newsletters → Add document):
- Document ID: מספר הגיליון (לדוגמה `37`)
- שדות:
  - `issueNumber` (number) — `37`
  - `parsha` (string) — `"נשא"` (בלי "פרשת")
  - `coverUrl` (string) — `"newsletters/covers/cover-37.jpg"`
  - `pdfHeUrl` (string) — `"newsletters/bachativa-issue-37-he.pdf"`
  - `pdfEnUrl` (string) — אם קיים, אחרת `""`
  - `title` (string) — `"עלון בחטיבה"`
  - `published` (boolean) — `true`

### ג. דחוף ל-GitHub
```bash
git add public/newsletters/
git commit -m "Add issue 37 — נשא"
git push
firebase deploy --only hosting
```

האתר יעלה אוטומטית. הגיליון יופיע אצל הגולשים בריענון הבא.

## פיתוח מקומי
```bash
npm run serve   # firebase emulator על http://localhost:5000
```

## דומיין מותאם
DNS records ב-Namecheap → Advanced DNS:
- `A` `@` → IPs של Firebase Hosting (מסופקים על-ידי הקונסול)
- `A` `@` → IP נוסף
- `CNAME` `www` → `bachativa.com` (או IP)

הקונסול של Firebase Hosting → Add custom domain → bachativa.com יוביל אותך
דרך תהליך אימות ו-SSL automático (יכול לקחת עד 24 שעות).

## קשר
- WhatsApp: https://chat.whatsapp.com/GtnA5TVKyn1GpxQwiiSIdb
- Email: bachativa@gmail.com
- אתר העמותה: https://chashmonayim.org
