# Google Play Store Release & Compliance Checklist
# قائمة متطلبات وفحص نشر التطبيق على متجر جوجل بلاي

This document outlines the complete compliance and preparation checklist required by Google Play Console before submitting the game for production review.

---

## 📋 Comprehensive Checklist

### 1. Privacy & Data Safety Policy (سياسة الخصوصية وأمان البيانات)
* [ ] **Public Privacy Policy URL**: Hosted on an accessible domain or GitHub Pages explaining user privacy (local storage usage, no third-party tracking).
* [ ] **Data Safety Declaration in Play Console**:
  * **Data Collected**: None (if offline local storage only) or disclose analytics if added.
  * **Data Sharing**: None.
  * **Security Practices**: State whether data is encrypted or kept on-device.
* [ ] **Android Permissions**: Zero unnecessary high-risk permissions in `AndroidManifest.xml`.

### 2. Content Rating & Age Suitability (تصنيف المحتوى والجمهور المستهدف)
* [ ] **IARC Content Questionnaire Completed**:
  * Category: Game -> Mystery / Deduction / Trivia / Party.
  * Violence: Mild fantasy/fictional text depictions of crime mysteries (no graphic gore or sexual content).
* [ ] **Target Age**: 12+ / 16+ (Teens and Adults).
* [ ] **Family Policy Compliance**: Ensure no ad networks violating children policies if targeted below 13.

### 3. Technical & Android Quality Guidelines (المعايير التقنية وجودة النظام)
* [ ] **Format**: Android App Bundle (`.aab`) signed with production release Keystore.
* [ ] **Target API Level**: Target SDK 34+ (Android 14+).
* [ ] **Back Navigation**: Hardware back button properly handled without crashes or unexpected exits.
* [ ] **Screen Responsiveness**: Fully tested on compact mobile phones, foldables, and tablets.
* [ ] **Pre-Launch Report (ANR & Crash Rate)**: Crash rate strictly below 1.09% across automated test devices.

### 4. App Access & Functional Review (الوصول والوظائف)
* [ ] **App Access Credentials**: Marked as *"All functionality is available without special access"* (since gameplay is local pass-and-play).
* [ ] **No Dead Ends / Placeholder Links**: All UI flows, buttons, and story interactions fully complete and functional.

### 5. Google Play Closed Testing Requirements (متطلب الاختبار لـ 20 مختبراً)
* [ ] **20 Testers Rule**: For personal developer accounts created after Nov 2023:
  * Minimum 20 opted-in testers in Closed Testing track.
  * Maintained active testing for 14 continuous days before requesting Production access.

### 6. Store Listing & Graphic Assets (أصول وتصميم صفحة المتجر)
* [x] **App Icon**: 512 × 512 px (PNG 32-bit, max 1024KB) generated and configured in `public/icon-512.png` and `android_icons/playstore-icon-512.png`.
* [x] **Android APK Mipmap Densities**: Prepared in `android_icons/`:
  - `mipmap-mdpi-ic_launcher.png` (48x48)
  - `mipmap-hdpi-ic_launcher.png` (72x72)
  - `mipmap-xhdpi-ic_launcher.png` (96x96)
  - `mipmap-xxhdpi-ic_launcher.png` (144x144)
  - `mipmap-xxxhdpi-ic_launcher.png` (192x192)
* [ ] **Feature Graphic**: 1024 × 500 px (JPG or PNG 24-bit, no alpha).
* [ ] **Phone Screenshots**: 2 to 8 high-resolution screenshots highlighting:
  1. Main Menu & Story Selection (اختيار ملف القضية).
  2. Player Setup & Roster (إعداد اللاعبين).
  3. Secret Role Card & Clues (الأدوار السرية وملف المشتبه به).
  4. Discussion & Investigation (جولة النقاش وكشف الأدلة).
  5. Voting & Killer Reveal (التصويت وكشف هوية القاتل).
* [ ] **Store Copy**:
  * Title: سيكرت كيلر (Secret Killer)
  * Short Description: لعبة الاستنتاج والتحقيق التفاعلية مع الأصدقاء.
  * Full Description: Detailed game description highlighting features and game rules without keyword stuffing.
