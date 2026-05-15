// =====================================================================
// seed-firestore.js — חד-פעמי: טוען את הגיליונות הקיימים ל-Firestore
// =====================================================================
// שימוש:
//   1. הורד service-account JSON מ-Firebase Console (Project Settings →
//      Service accounts → Generate new private key). שמור כ-serviceAccountKey.json
//      בתיקייה הראשית (היא ב-.gitignore — לא תיכנס ל-git).
//   2. npm install firebase-admin
//   3. node scripts/seed-firestore.js
// =====================================================================

const admin = require('firebase-admin');
const serviceAccount = require('../serviceAccountKey.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const db = admin.firestore();

const NEWSLETTERS = [
  { issueNumber: 36, parsha: 'במדבר',   coverUrl: 'newsletters/covers/cover-36.jpg', pdfHeUrl: 'newsletters/bachativa-issue-36-he.pdf', pdfEnUrl: 'newsletters/BaChativa-Issue36-English.pdf' },
  { issueNumber: 31, parsha: 'משפטים',  coverUrl: 'newsletters/covers/cover-31.jpg', pdfHeUrl: 'newsletters/newsletter-31-mishpatim.pdf', pdfEnUrl: '' },
  { issueNumber: 30, parsha: 'יתרו',    coverUrl: 'newsletters/covers/cover-30.jpg', pdfHeUrl: 'newsletters/newsletter-30-yitro.pdf', pdfEnUrl: '' },
  { issueNumber: 29, parsha: 'בשלח',    coverUrl: 'newsletters/covers/cover-29.jpg', pdfHeUrl: 'newsletters/newsletter-29-beshalach.pdf', pdfEnUrl: '' },
  { issueNumber: 28, parsha: 'בא',      coverUrl: 'newsletters/covers/cover-28.jpg', pdfHeUrl: 'newsletters/newsletter-28-bo.pdf', pdfEnUrl: '' },
  { issueNumber: 27, parsha: 'וארא',    coverUrl: 'newsletters/covers/cover-27.jpg', pdfHeUrl: 'newsletters/newsletter-27-vaera.pdf', pdfEnUrl: '' },
  { issueNumber: 26, parsha: 'שמות',    coverUrl: 'newsletters/covers/cover-26.jpg', pdfHeUrl: 'newsletters/newsletter-26-shemot.pdf', pdfEnUrl: '' },
];

async function seed() {
  const batch = db.batch();
  for (const n of NEWSLETTERS) {
    const ref = db.collection('newsletters').doc(String(n.issueNumber));
    batch.set(ref, {
      ...n,
      title: 'עלון בחטיבה',
      published: true,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    });
  }
  await batch.commit();
  console.log(`✓ Seeded ${NEWSLETTERS.length} newsletters to Firestore.`);
}

seed().catch((e) => {
  console.error('Seed failed:', e);
  process.exit(1);
});
