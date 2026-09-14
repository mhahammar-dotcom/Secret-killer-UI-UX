# Google Play Data Safety Factual Mapping

**App Name:** Secret Killer (سيكرت كيلر)  
**Package Name:** `com.secretkiller.game`  
**Purpose:** Reference guide for completing the Google Play Console Data Safety questionnaire.  
*Notice: This document is developer-facing and is not a substitute for the public Privacy Policy.*

---

## High-Level Overview

1. **Does the app collect or share any user data?**
   - **Yes.** The app collects optional user-submitted feedback/ratings via Firebase Firestore, and uses Google AdMob which collects device identifiers (GAID) and diagnostic data for ad serving.
2. **Is all user data encrypted in transit?**
   - **Yes.** All data sent from the app to Google Cloud / Firebase and Google AdMob uses HTTPS / TLS encryption.
3. **Do you provide a way for users to request that their data be deleted?**
   - **Yes.** Local data can be deleted anytime by clearing app storage in device settings. Users can email the developer contact to request deletion of any feedback submitted via Firebase.
4. **Target Audience:**
   - General audience (Ages 13+). Not directed to children under 13.

---

## Detailed Data Safety Mapping Table

| Data Type | Collected? | Shared? | Purpose | Optional / Required | Retention / Ephemeral | Third-Party Recipient |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **App Ratings & User Feedback** (User-entered text, star rating, feedback category) | **Yes** (Only if submitted) | **No** (Stored in developer's private Firestore) | App functionality, Product improvement, Bug triage | **Optional** (User initiates submission voluntarily in Rating modal) | Retained in Firestore database until deleted on request. Offline backup in device localStorage. | Google Cloud / Firebase (Service Provider / Database hosting) |
| **Device or other IDs** (Advertising ID / GAID) | **Yes** (Collected directly by AdMob SDK) | **Yes** (Shared with AdMob ad network) | Advertising / Marketing, Fraud prevention, Analytics/Diagnostic | **Optional** (Subject to Google UMP Consent form in EEA/UK) | Managed by Google Play services and Google AdMob according to Google's data retention policies. | Google LLC (Google AdMob) |
| **App Diagnostics & Crash Logs** (Ad error logs, ad performance metrics) | **Yes** (Processed by AdMob SDK) | **Yes** (Shared with AdMob) | Advertising performance, fraud detection, stability | **Required** when ads are loaded | Managed by Google AdMob according to Google policies. | Google LLC (Google AdMob) |
| **Location (Coarse/IP-based)** | **Yes** (Derived by AdMob at network layer) | **Yes** (Processed by AdMob) | Geographic ad serving, regulatory compliance | **Required** for network ad delivery | Handled by Google AdMob network layer. No GPS or fine location is requested. | Google LLC (Google AdMob) |
| **User Preferences & Game State** (Sound settings, timer, custom mystery cases) | **Local Only** (Stored in WebView `localStorage`) | **No** (Never transmitted off device) | Game functionality (retaining sound settings, local pass-and-play cases) | **Required** for in-game preferences | Stored on-device until user clears cache/data or uninstalls. | None (Never leaves the device) |
| **Personal Info** (Name, Email, Address, Phone, Accounts) | **NO** | **NO** | N/A | N/A | N/A | None |
| **Financial Info** (Credit card, in-app billing) | **NO** | **NO** | N/A | N/A | N/A | None |
| **Health & Fitness** | **NO** | **NO** | N/A | N/A | N/A | None |
| **Messages / Contacts** | **NO** | **NO** | N/A | N/A | N/A | None |
| **Photos / Videos / Audio** | **NO** | **NO** | N/A | N/A | N/A | None (Microphone and Camera permissions are not requested) |

---

## Artificial Intelligence (AI) / Gemini Status

- **Status in Production Android APK:** **NOT ACTIVE / NOT TRANSMITTED.**
- The production Android application contains entirely local game rules, static story pools, dynamic clue generators, and offline voting logic.
- An administrative development endpoint (`POST /api/generate-case`) exists in the backend repository (`server.ts`) using `@google/genai`, but it is **not called by the frontend** and **not bundled into or reachable by the native Android APK**.
- No user-created prompts, player names, or gameplay interactions are sent to Gemini from the Android APK.
- If an AI feature is connected to a public backend in a future release, user input handling and AI safety disclosures must be declared accordingly before release.

---

## Play Console Form Preparation Checklist

1. **Data Collection & Security:**
   - Data collection is declared for:
     - *User Content:* Other user-generated content (Ratings & feedback text).
     - *Device or other IDs:* Advertising ID (AdMob).
   - Transfer: All collected data is encrypted in transit via HTTPS/TLS.
   - Deletion request mechanism: Provided via privacy contact email.
2. **Privacy Policy Link:**
   - Deploy `public/privacy.html` to a public HTTPS URL.
   - Enter that URL in **Play Console -> Policy and programs -> App content -> Privacy policy**.
   - Set `PRIVACY_POLICY_URL` in `src/config/privacy.ts` once live.
3. **Ads Declaration:**
   - Select **"Yes, my app contains ads"** in Play Console.
4. **App Access:**
   - Select **"All functionality is available without special access"** (no login or account required).
