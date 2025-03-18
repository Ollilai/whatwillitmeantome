# Credential Rotation Checklist

🚨 **IMPORTANT: Your credentials have been exposed in your `.env.local` file. You must rotate (change) them before making your repository public.** 🚨

## Step 1: Rotate Supabase Database Credentials

- [ ] Log in to [Supabase Dashboard](https://app.supabase.com/)
- [ ] Select your project: "eibnapzugfwvxdxhzins"
- [ ] Go to Project Settings → Database
- [ ] Reset the database password
- [ ] Update your local `.env.local` with the new connection string
- [ ] Update your Vercel environment variables with the new connection string

## Step 2: Rotate Supabase Service Role Key

- [ ] In the Supabase Dashboard, go to Project Settings → API
- [ ] Under "Project API keys", regenerate your service_role key
- [ ] Update your local `.env.local` with the new key
- [ ] Update your Vercel environment variables with the new key

## Step 3: Rotate Mistral AI API Key

- [ ] Log in to [Mistral AI Console](https://console.mistral.ai/)
- [ ] Go to API Keys section
- [ ] Revoke the exposed key: "QuyjjPXEf2Mk1ck4G9En7pNlJKXVECoN"
- [ ] Generate a new API key
- [ ] Update your local `.env.local` with the new key
- [ ] Update your Vercel environment variables with the new key

## Step 4: Verify Environment Setup

- [ ] After rotating all credentials, verify your application works locally
- [ ] Verify your application works on Vercel with the new credentials
- [ ] Make sure no sensitive data is committed to your Git repository

## Step 5: Making the Repository Public

Only after completing all the above steps:

- [ ] Update the repository visibility to Public in GitHub settings
- [ ] Add a clear README with setup instructions (without sensitive data)
- [ ] Include a SECURITY.md file with guidelines for reporting security issues 