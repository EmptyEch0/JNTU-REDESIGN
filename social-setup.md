# JNTU-GV Social Media Publishing Setup Guide

This document describes the step-by-step configuration required to enable administrative publishing to Instagram and LinkedIn.

---

## 1. Environment Variables Configuration

Add the following keys to your server's secure `.env` file (never expose these to the frontend):

```env
# Meta / Instagram Graph API Configuration
META_APP_ID=your_meta_app_id
META_APP_SECRET=your_meta_app_secret
INSTAGRAM_BUSINESS_ACCOUNT_ID=your_instagram_business_account_id

# LinkedIn API Configuration
LINKEDIN_CLIENT_ID=your_linkedin_client_id
LINKEDIN_CLIENT_SECRET=your_linkedin_client_secret
LINKEDIN_ORGANIZATION_ID=your_school_numeric_id
LINKEDIN_ORGANIZATION_VANITY_NAME=jntugv
LINKEDIN_OAUTH_SCOPES=openid profile email w_member_social w_organization_social

# Site URL Configuration (Used for OAuth redirects)
VITE_SITE_URL=https://jntugvcev.edu.in
```

---

## 2. Meta / Instagram Setup

Target Instagram Account: `_glitch_48`

### Step 1: Convert Instagram Account to Professional
1. Log in to the Instagram account `_glitch_48` on a mobile device or web browser.
2. Go to **Settings** > **Account type and tools**.
3. Select **Switch to professional account** and configure it as a **Business** or **Creator** account.

### Step 2: Connect Instagram to a Facebook Page
1. Create a Facebook Page for JNTU-GV (if not already existing).
2. Go to the Facebook Page's settings > **Linked Accounts** > **Instagram**.
3. Click **Connect Account** and sign in as `_glitch_48`.

### Step 3: Create a Meta Developer Application
1. Go to the [Meta Developer Portal](https://developers.facebook.com/).
2. Click **Create App** and select **Other** > **Business** app type.
3. Name the app and link it to your Facebook Business Manager (if applicable).

### Step 4: Configure App Products & Permissions
1. Add the following products to your developer app:
   *   **Facebook Login for Business**
   *   **Instagram Graph API**
2. In the App Settings, configure the OAuth Redirect URI to point to:
   `${VITE_SITE_URL}/api/admin/social/callback/instagram`
3. Request the following permissions:
   *   `instagram_basic`
   *   `instagram_content_publish`
   *   `pages_show_list`
   *   `pages_read_engagement`
4. Note that for public/production use, you must submit your app for **App Review** to obtain these permissions for external admin users. In Development, you can test with Administrator/Tester roles.

### Step 5: Locate your Instagram Business Account ID
1. You can find this in your Facebook Page settings (under Instagram connection details), or by making an API call using Meta's Graph Explorer:
   `GET /v19.0/me/accounts?fields=instagram_business_account`
2. Add this ID to the `.env` file under `INSTAGRAM_BUSINESS_ACCOUNT_ID`.

---

## 3. LinkedIn Developer Setup

Target LinkedIn School Page: `https://www.linkedin.com/school/jntugv/`

### Step 1: Create a LinkedIn Developer Application
1. Go to the [LinkedIn Developer Portal](https://developer.linkedin.com/).
2. Click **Create App** and enter your university/organization details.

### Step 2: Add Developer Products
1. In the app details, navigate to the **Products** tab and enable:
   *   **Community Management API** (provides the `w_organization_social` and `r_organization_social` permissions to post to school/company pages).
   *   **Share on LinkedIn** (provides the `w_member_social` permission).
   *   **Sign In with LinkedIn using OpenID Connect** (provides `openid`, `profile`, `email` permissions).

### Step 3: Configure Authentication & Scopes
1. Go to the **Auth** tab.
2. Note your **Client ID** and **Client Secret** and add them to `.env`.
3. In the **Authorized Redirect URLs** section, add:
   `${VITE_SITE_URL}/api/admin/social/callback/linkedin`
4. Set the `LINKEDIN_OAUTH_SCOPES` variable in your `.env` to request permissions for the products enabled. Example:
   `LINKEDIN_OAUTH_SCOPES=openid profile email w_member_social w_organization_social`

### Step 4: Access & Targeting
*   The admin connecting the LinkedIn account must be an **Administrator/Content Poster** of the JNTU-GV organization page.
*   The system uses the vanity name `'jntugv'` to automatically lookup the school's numeric ID on LinkedIn during publishing.
*   Alternatively, you can skip dynamic lookup by setting `LINKEDIN_ORGANIZATION_ID` in your `.env` file directly (e.g. `LINKEDIN_ORGANIZATION_ID=1234567`).
