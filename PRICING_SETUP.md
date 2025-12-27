# QRGen Pricing Tiers Implementation - Setup Guide

## 🎉 Implementation Complete!

This guide will help you configure and deploy the pricing tier system with 7-day Pro trial, usage enforcement, and Stripe payment integration.

---

## 📋 What Was Implemented

### ✅ Core Features

- **User Profile System**: Firestore `users` collection with subscription data
- **7-Day Pro Trial**: Automatic trial on signup for all new users
- **Usage Tracking**: Monthly QR code generation limits enforced
- **Trial Banner**: Dashboard countdown showing days remaining
- **Upgrade Modal**: Appears when Free tier users hit their limit
- **Feature Gating**: Size limits, analytics access based on tier
- **Firebase Functions**: Scheduled tasks for monthly reset and trial expiration
- **Stripe Integration**: Checkout flow and webhook handlers (test mode ready)
- **Security Rules**: Protected subscription fields in Firestore

### 📦 Files Created/Modified

#### New Files:

- `src/context/SubscriptionContext.jsx` - Subscription state management
- `src/utils/stripeUtils.js` - Stripe checkout utilities
- `functions/package.json` - Firebase Functions dependencies
- `functions/index.js` - Scheduled functions and Stripe webhooks

#### Modified Files:

- `src/pages/Signup.jsx` - Creates user profile with trial
- `src/pages/Login.jsx` - Handles Google OAuth first-time users
- `src/pages/Dashboard.jsx` - Trial banner, usage enforcement, feature gating
- `src/pages/Analytics.jsx` - Feature gate for Free tier
- `src/pages/Pricing.jsx` - Stripe checkout integration
- `src/App.jsx` - Wrapped with SubscriptionProvider
- `firestore.rules` - Added users collection security

---

## 🚀 Deployment Steps

### Step 1: Configure Stripe Test Keys

1. **Get Stripe Test Keys**:

   - Go to [Stripe Dashboard](https://dashboard.stripe.com/test/apikeys)
   - Copy your **Publishable Key** (starts with `pk_test_`)
   - Copy your **Secret Key** (starts with `sk_test_`)

2. **Update Frontend** (`src/utils/stripeUtils.js`):

   ```javascript
   const stripePromise = loadStripe("pk_test_YOUR_ACTUAL_KEY_HERE");
   ```

3. **Create Stripe Products & Prices**:
   - In Stripe Dashboard, go to Products
   - Create "Pro Monthly" product ($19/month)
   - Create "Pro Annual" product ($15/month, billed annually)
   - Copy the Price IDs and update `src/utils/stripeUtils.js`:
   ```javascript
   export const STRIPE_PRICES = {
     pro_monthly: "price_YOUR_MONTHLY_ID",
     pro_annual: "price_YOUR_ANNUAL_ID",
   };
   ```

### Step 2: Set Up Firebase Functions

1. **Install Firebase CLI** (if not already installed):

   ```bash
   npm install -g firebase-tools
   ```

2. **Login to Firebase**:

   ```bash
   firebase login
   ```

3. **Initialize Firebase Functions** (if not already done):

   ```bash
   firebase init functions
   # Select existing project: qrgen-f0568
   # Language: JavaScript
   # ESLint: Yes (optional)
   # Install dependencies: Yes
   ```

4. **Install Function Dependencies**:

   ```bash
   cd functions
   npm install
   cd ..
   ```

5. **Set Stripe Secret Keys as Environment Variables**:

   ```bash
   firebase functions:secrets:set STRIPE_SECRET_KEY
   # Paste your sk_test_... key when prompted

   firebase functions:secrets:set STRIPE_WEBHOOK_SECRET
   # Leave blank for now, will set after webhook creation
   ```

6. **Update Functions URL** in `src/utils/stripeUtils.js`:
   ```javascript
   const functionUrl = `https://us-central1-qrgen-f0568.cloudfunctions.net/createCheckoutSession`;
   ```

### Step 3: Deploy Firestore Rules

```bash
firebase deploy --only firestore:rules
```

### Step 4: Deploy Firebase Functions

```bash
firebase deploy --only functions
```

This will deploy:

- `resetMonthlyUsage` - Runs 1st of each month at midnight
- `checkTrialExpiration` - Runs daily at midnight
- `createCheckoutSession` - HTTP endpoint for checkout
- `stripeWebhook` - HTTP endpoint for Stripe events
- `createPortalSession` - HTTP endpoint for billing portal

### Step 5: Configure Stripe Webhook

1. **Get Webhook URL** from deployment output:

   ```
   https://us-central1-qrgen-f0568.cloudfunctions.net/stripeWebhook
   ```

2. **Create Webhook in Stripe**:

   - Go to [Stripe Webhooks](https://dashboard.stripe.com/test/webhooks)
   - Click "Add endpoint"
   - Paste your function URL
   - Select events:
     - `checkout.session.completed`
     - `customer.subscription.updated`
     - `customer.subscription.deleted`
   - Copy the **Signing Secret** (starts with `whsec_`)

3. **Update Webhook Secret**:

   ```bash
   firebase functions:secrets:set STRIPE_WEBHOOK_SECRET
   # Paste the whsec_... secret
   ```

4. **Redeploy Functions**:
   ```bash
   firebase deploy --only functions
   ```

### Step 6: Test the System

1. **Create Test User**:

   - Go to http://localhost:5173/signup (or your deployed URL)
   - Sign up with test email
   - Verify 7-day trial is active in Dashboard banner

2. **Test QR Generation**:

   - Generate 5 QR codes (Free tier limit)
   - Verify upgrade modal appears on 6th attempt

3. **Test Stripe Checkout**:

   - Click "Upgrade to Pro" button
   - Use Stripe test card: `4242 4242 4242 4242`
   - Any future date, any CVC
   - Complete checkout
   - Verify subscription is active in Dashboard

4. **Test Feature Gates**:
   - As Free user, verify size is capped at 256px
   - As Pro user (after checkout), verify 512px available
   - Check Analytics page access

---

## 🔧 Configuration Reference

### Tier Limits (in `SubscriptionContext.jsx`)

```javascript
const TIER_LIMITS = {
  free: {
    qrCodesPerMonth: 5,
    maxSize: 256,
    features: {
      analytics: false,
      highResolution: false,
      // ...
    },
  },
  pro: {
    qrCodesPerMonth: Infinity,
    maxSize: 512,
    features: {
      analytics: true,
      highResolution: true,
      // ...
    },
  },
};
```

### Trial Configuration

- **Duration**: 7 days (set in `Signup.jsx` and `Login.jsx`)
- **Default Tier After Trial**: `free`
- **Trial Status**: `subscriptionStatus: "trialing"`

### Monthly Reset

- **Schedule**: 1st of each month at midnight UTC
- **Reset Fields**: `qrCodesThisMonth` → 0
- **Function**: `resetMonthlyUsage` in `functions/index.js`

---

## 🧪 Testing with Stripe Test Mode

### Test Cards

| Scenario      | Card Number         | Result             |
| ------------- | ------------------- | ------------------ |
| Success       | 4242 4242 4242 4242 | Payment succeeds   |
| Decline       | 4000 0000 0000 0002 | Card declined      |
| Auth Required | 4000 0025 0000 3155 | 3D Secure required |

Use any:

- **Expiry**: Any future date (e.g., 12/34)
- **CVC**: Any 3 digits (e.g., 123)
- **ZIP**: Any 5 digits (e.g., 12345)

### Webhook Testing

Use Stripe CLI for local testing:

```bash
stripe listen --forward-to http://localhost:5001/qrgen-f0568/us-central1/stripeWebhook
stripe trigger checkout.session.completed
```

---

## 📊 Monitoring

### Check Function Logs

```bash
firebase functions:log
```

### Monitor Usage

Query Firestore to see usage stats:

```javascript
db.collection("users").where("qrCodesThisMonth", ">", 0).get();
```

### Stripe Dashboard

- [Payments](https://dashboard.stripe.com/test/payments)
- [Subscriptions](https://dashboard.stripe.com/test/subscriptions)
- [Webhook Events](https://dashboard.stripe.com/test/webhooks)

---

## 🚨 Troubleshooting

### Issue: Trial banner not showing

- Check browser console for SubscriptionContext errors
- Verify user document exists in Firestore `users` collection
- Check `trialEndsAt` field is a valid future date

### Issue: Checkout fails

- Verify Stripe publishable key is correct in `stripeUtils.js`
- Check browser console for errors
- Verify Firebase Function URL is correct
- Check Functions logs: `firebase functions:log`

### Issue: Webhook not updating user tier

- Verify webhook secret is set correctly
- Check webhook is configured for correct events
- View webhook attempts in Stripe Dashboard
- Check Functions logs for errors

### Issue: Monthly reset not working

- Verify scheduled function is deployed
- Check Functions logs around 1st of month
- Manually trigger: Use Firebase Console → Functions → Select function → Test

---

## 🎯 Next Steps

### Phase 1: Testing (Current)

- ✅ Test all features in development
- ✅ Verify Stripe test mode works
- ✅ Check trial expiration logic
- ✅ Test monthly reset locally

### Phase 2: Production Preparation

- [ ] Replace Stripe test keys with live keys
- [ ] Update webhook endpoint to production URL
- [ ] Configure custom domain for functions
- [ ] Set up error alerting (Sentry, etc.)
- [ ] Add email notifications for trial expiration

### Phase 3: Enhancements

- [ ] Add Enterprise tier checkout
- [ ] Implement customer portal access
- [ ] Add usage analytics dashboard
- [ ] Email reminders 2 days before trial ends
- [ ] Add payment retry logic for failed charges

---

## 📚 Key Files Reference

### Frontend

- **Context**: `src/context/SubscriptionContext.jsx`
- **Utils**: `src/utils/stripeUtils.js`
- **Dashboard**: `src/pages/Dashboard.jsx`
- **Pricing**: `src/pages/Pricing.jsx`

### Backend

- **Functions**: `functions/index.js`
- **Rules**: `firestore.rules`

### Configuration

- **Stripe Keys**: `src/utils/stripeUtils.js`
- **Function Secrets**: Firebase Console → Functions → Secrets

---

## 💡 Tips

1. **Always test in Stripe test mode first** - Switch to live keys only when ready
2. **Monitor function logs** - Use `firebase functions:log --only createCheckoutSession` for specific functions
3. **Keep secrets secure** - Never commit API keys to git
4. **Test edge cases** - Try canceling during checkout, expired cards, etc.
5. **Document price changes** - Keep track of Price IDs when updating plans

---

## 🆘 Support

If you encounter issues:

1. Check Firebase Functions logs
2. Check Stripe webhook events
3. Verify Firestore security rules allow operations
4. Review browser console for client-side errors

**Firebase Project ID**: `qrgen-f0568`  
**Region**: `us-central1` (default)

---

**Implementation Date**: December 2, 2025  
**Status**: ✅ Complete - Ready for Testing
