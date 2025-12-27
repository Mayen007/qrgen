# QRGen Netlify Deployment Guide

## 🎉 Netlify Functions Setup Complete!

Your subscription system has been migrated from Firebase Functions to Netlify Functions - no credit card required for deployment!

---

## 📁 What Changed

### New Files:

- `netlify/functions/createCheckoutSession.js` - Stripe checkout handler
- `netlify/functions/stripeWebhook.js` - Stripe webhook handler
- `netlify/functions/createPortalSession.js` - Customer billing portal
- `netlify/functions/package.json` - Function dependencies
- `.env.example` - Environment variables template

### Modified Files:

- `src/utils/stripeUtils.js` - Updated to call Netlify Functions
- `netlify.toml` - Added functions configuration

---

## 🚀 Deployment Steps

### Step 1: Get Firebase Service Account Credentials

1. Go to [Firebase Console](https://console.firebase.google.com/project/qrgen-f0568/settings/serviceaccounts/adminsdk)
2. Click **"Generate New Private Key"**
3. Save the JSON file (keep it secure!)
4. You'll need these values:
   - `project_id`
   - `client_email`
   - `private_key`

### Step 2: Install Netlify CLI (for local testing)

```bash
npm install -g netlify-cli
```

### Step 3: Set Up Environment Variables Locally

1. Copy the example file:

   ```bash
   cp .env.example .env
   ```

2. Edit `.env` and fill in:
   - **STRIPE_SECRET_KEY**: From Stripe Dashboard > API Keys (sk*test*...)
   - **STRIPE_WEBHOOK_SECRET**: Leave empty for now, will set after deployment
   - **FIREBASE_PROJECT_ID**: `qrgen-f0568`
   - **FIREBASE_CLIENT_EMAIL**: From the service account JSON
   - **FIREBASE_PRIVATE_KEY**: From the service account JSON (keep the quotes and \\n)

### Step 4: Install Function Dependencies

```bash
cd netlify/functions
npm install
cd ../..
```

### Step 5: Test Locally

```bash
netlify dev
```

This will start:

- Frontend at `http://localhost:8888`
- Functions at `http://localhost:8888/.netlify/functions/`

### Step 6: Deploy to Netlify

1. **Link to Netlify** (if not already):

   ```bash
   netlify login
   netlify init
   ```

2. **Set Environment Variables in Netlify**:

   ```bash
   netlify env:set STRIPE_SECRET_KEY "sk_test_YOUR_KEY"
   netlify env:set FIREBASE_PROJECT_ID "qrgen-f0568"
   netlify env:set FIREBASE_CLIENT_EMAIL "your-email@qrgen-f0568.iam.gserviceaccount.com"
   netlify env:set FIREBASE_PRIVATE_KEY "-----BEGIN PRIVATE KEY-----\nYOUR_KEY\n-----END PRIVATE KEY-----\n"
   ```

   Or set them in the Netlify Dashboard:

   - Go to Site Settings > Environment Variables
   - Add each variable

3. **Deploy**:
   ```bash
   netlify deploy --prod
   ```

### Step 7: Configure Stripe Webhook

1. After deployment, get your webhook URL:

   ```
   https://YOUR_SITE_NAME.netlify.app/.netlify/functions/stripeWebhook
   ```

2. Go to [Stripe Webhooks](https://dashboard.stripe.com/test/webhooks)
3. Click **"Add endpoint"**
4. Enter your webhook URL
5. Select events:
   - `checkout.session.completed`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
6. Copy the **Signing Secret** (whsec\_...)

7. Add webhook secret to Netlify:

   ```bash
   netlify env:set STRIPE_WEBHOOK_SECRET "whsec_YOUR_SECRET"
   ```

8. Redeploy to apply:
   ```bash
   netlify deploy --prod
   ```

---

## 🧪 Testing

### Test Locally

1. Start local server:

   ```bash
   netlify dev
   ```

2. In a separate terminal, use Stripe CLI to forward webhooks:

   ```bash
   stripe listen --forward-to http://localhost:8888/.netlify/functions/stripeWebhook
   ```

3. Test checkout flow at `http://localhost:8888`

### Test Production

1. Visit your deployed site
2. Sign up for an account
3. Verify 7-day trial banner appears
4. Generate 5 QR codes (Free tier limit)
5. Click "Upgrade to Pro"
6. Use test card: `4242 4242 4242 4242`
7. Verify Pro features unlock

---

## 📊 What About Scheduled Tasks?

### Option A: Manual Monthly Reset (Simplest)

Since Netlify doesn't have built-in scheduled tasks for free tier, you can:

1. **Manual Reset**: On the 1st of each month, run a script in Firestore console:

   ```javascript
   db.collection("users")
     .get()
     .then((snapshot) => {
       const batch = db.batch();
       snapshot.docs.forEach((doc) => {
         batch.update(doc.ref, { qrCodesThisMonth: 0 });
       });
       return batch.commit();
     });
   ```

2. **Trial Expiration**: Already handled automatically in `SubscriptionContext.jsx` when users log in!

### Option B: Use GitHub Actions (Free Scheduled Tasks)

I can set up a GitHub Action that runs monthly to reset usage. Would you like me to add this?

### Option C: Upgrade to Netlify Pro ($19/mo)

Includes scheduled functions. Not needed for now since we have workarounds.

---

## 💰 Costs

**Netlify Free Tier Includes:**

- ✅ 125K function invocations/month
- ✅ 100GB bandwidth/month
- ✅ 300 build minutes/month
- ✅ Automatic HTTPS
- ✅ Deploy previews
- ✅ **No credit card required!**

This is more than enough for your app's current usage.

---

## 🔧 Key Differences from Firebase

| Feature             | Firebase Functions            | Netlify Functions              |
| ------------------- | ----------------------------- | ------------------------------ |
| **Deployment**      | Requires Blaze plan           | Free tier available            |
| **Invocations**     | 2M/month free                 | 125K/month free                |
| **Scheduled Tasks** | Built-in cron                 | Not included (need workaround) |
| **Setup**           | Complex secrets management    | Simple env vars                |
| **Cost**            | Pay-as-you-go after free tier | Flat $19/mo Pro plan           |

---

## 📚 Function Endpoints

After deployment, your functions will be available at:

- **Checkout**: `https://YOUR_SITE.netlify.app/.netlify/functions/createCheckoutSession`
- **Webhook**: `https://YOUR_SITE.netlify.app/.netlify/functions/stripeWebhook`
- **Portal**: `https://YOUR_SITE.netlify.app/.netlify/functions/createPortalSession`

---

## 🆘 Troubleshooting

### Issue: Functions not deploying

- Check `netlify/functions/package.json` exists
- Run `npm install` in `netlify/functions/`
- Check build logs in Netlify Dashboard

### Issue: Environment variables not working

- Verify variables are set in Netlify Dashboard
- Redeploy after setting variables
- Check variable names match exactly (case-sensitive)

### Issue: Stripe webhook failing

- Verify webhook URL is correct
- Check webhook secret is set
- View webhook attempts in Stripe Dashboard
- Check function logs in Netlify Dashboard

### Issue: Firebase permission errors

- Verify service account credentials are correct
- Ensure private key has `\n` newlines preserved
- Check Firestore rules allow admin access

---

## ✅ Next Steps

1. ✅ Install dependencies: `cd netlify/functions && npm install`
2. ✅ Get Firebase service account credentials
3. ✅ Set up environment variables locally
4. ✅ Test with `netlify dev`
5. ✅ Deploy to Netlify
6. ✅ Configure Stripe webhook
7. ✅ Test end-to-end with Stripe test card

---

**Updated**: December 2, 2025  
**Status**: ✅ Ready for Deployment (No Credit Card Required!)
