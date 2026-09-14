import fs from 'fs';
import path from 'path';
import { AR_STRINGS, EN_STRINGS } from '../src/data/translations';
import { PRIVACY_POLICY_URL, PRIVACY_CONTACT_EMAIL, DEVELOPER_IDENTITY } from '../src/config/privacy';

console.log('--- RUNNING PRIVACY & DATA COMPLIANCE TESTS ---');

// 1. Check public/privacy.html
const privacyHtmlPath = path.resolve('public/privacy.html');
if (!fs.existsSync(privacyHtmlPath)) {
  throw new Error('public/privacy.html does not exist!');
}
const htmlContent = fs.readFileSync(privacyHtmlPath, 'utf8');

const requiredSections = [
  'Privacy Policy',
  'سياسة الخصوصية',
  'Firebase',
  'AdMob',
  'Gemini',
  'Deletion',
  'حذف البيانات',
  'Children',
  '13',
  '[DEVELOPER_OR_COMPANY_NAME_PLACEHOLDER]',
  '[PRIVACY_CONTACT_EMAIL_PLACEHOLDER]'
];

for (const section of requiredSections) {
  if (!htmlContent.includes(section)) {
    throw new Error(`privacy.html missing required text: ${section}`);
  }
}
console.log('✅ PASS: public/privacy.html contains all necessary legal, AdMob, Firebase, AI, and children privacy disclosures.');

// 2. Check play-data-safety.md documentation
const dataSafetyDoc = path.resolve('docs/play-data-safety.md');
if (!fs.existsSync(dataSafetyDoc)) {
  throw new Error('docs/play-data-safety.md does not exist!');
}
const docContent = fs.readFileSync(dataSafetyDoc, 'utf8');
if (!docContent.includes('Google Play Data Safety Factual Mapping') || !docContent.includes('AdMob') || !docContent.includes('Firebase')) {
  throw new Error('play-data-safety.md is missing critical mappings!');
}
console.log('✅ PASS: docs/play-data-safety.md contains Google Play Console Data Safety questionnaire mapping.');

// 3. Check privacy configuration
if (typeof PRIVACY_POLICY_URL !== 'string') {
  throw new Error('PRIVACY_POLICY_URL must be exported as string');
}
if (typeof PRIVACY_CONTACT_EMAIL !== 'string' || typeof DEVELOPER_IDENTITY !== 'string') {
  throw new Error('Privacy constants missing in src/config/privacy.ts');
}
console.log('✅ PASS: src/config/privacy.ts exports valid config keys.');

// 4. Check translations
if (!AR_STRINGS.privacyPolicy || !EN_STRINGS.privacyPolicy) {
  throw new Error('Missing privacyPolicy translation key');
}
if (!AR_STRINGS.privacyPolicyDesc || !EN_STRINGS.privacyPolicyDesc) {
  throw new Error('Missing privacyPolicyDesc translation key');
}
if (!AR_STRINGS.viewPolicy || !EN_STRINGS.viewPolicy) {
  throw new Error('Missing viewPolicy translation key');
}
if (!AR_STRINGS.privacyPolicyTitle || !EN_STRINGS.privacyPolicyTitle) {
  throw new Error('Missing privacyPolicyTitle translation key');
}
console.log('✅ PASS: Translations for Privacy Policy exist in both AR and EN dictionaries.');

// 5. Check index.html for unauthorized tracking scripts
const indexHtml = fs.readFileSync(path.resolve('index.html'), 'utf8');
if (indexHtml.includes('googletagmanager.com') || indexHtml.includes('gtag') || indexHtml.includes('analytics.js')) {
  throw new Error('Found unauthorized tracking scripts in index.html');
}
console.log('✅ PASS: index.html contains no unauthorized web tracking or telemetry scripts.');

console.log('--- ALL PRIVACY & DATA COMPLIANCE TESTS PASSED ---');
