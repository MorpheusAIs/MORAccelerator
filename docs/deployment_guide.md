# Deployment Guide for Morpheus Open Source Accelerator

This guide provides detailed instructions for deploying your Morpheus Open Source Accelerator application to either Vercel or Netlify.

## Prerequisites

Before deploying, ensure you have:
- A GitHub account
- Your enhanced code pushed to your GitHub repository
- Access to any required API keys or environment variables

## Option 1: Deploying to Vercel (Recommended for Next.js)

Vercel is the platform created by the team behind Next.js and offers the best integration for Next.js applications.

### Step 1: Prepare Your Repository

1. Extract the ZIP file containing the enhanced project
2. Install dependencies:
   ```bash
   cd MOR_Accelerator_New
   npm install
   ```
3. Push the code to your GitHub repository:
   ```bash
   git add .
   git commit -m "Enhanced application with animated staking flow and reward visualization"
   git push origin main
   ```

### Step 2: Deploy on Vercel

1. Go to [Vercel](https://vercel.com/) and sign in with GitHub
2. Click "Add New..." → "Project"
3. Select your repository "MOR_Accelerator_New"
4. Configure the project settings:
   - Framework Preset: Next.js
   - Root Directory: ./
   - Build Command: `npm run build`
   - Output Directory: .next
5. Environment Variables:
   - Add any required environment variables for blockchain interactions:
     - `NEXT_PUBLIC_INFURA_ID` (if using Infura)
     - `NEXT_PUBLIC_WALLET_CONNECT_ID` (if using WalletConnect)
     - Any other API keys or configuration variables
6. Click "Deploy"

### Step 3: Configure Custom Domain (Optional)

1. After deployment, go to "Settings" → "Domains"
2. Add your custom domain and follow the verification steps

## Option 2: Deploying to Netlify

Netlify is another excellent platform for deploying web applications with continuous deployment.

### Step 1: Prepare Your Repository

Follow the same steps as for Vercel to prepare your repository.

### Step 2: Create a netlify.toml File

Create a `netlify.toml` file in the root of your project with the following content:

```toml
[build]
  command = "npm run build"
  publish = ".next"

[build.environment]
  NETLIFY_NEXT_PLUGIN_SKIP = "true"

[[plugins]]
  package = "@netlify/plugin-nextjs"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

### Step 3: Deploy on Netlify

1. Go to [Netlify](https://app.netlify.com/) and sign in with GitHub
2. Click "Add new site" → "Import an existing project"
3. Select your GitHub repository
4. Configure the build settings:
   - Build command: `npm run build`
   - Publish directory: `.next`
5. Environment Variables:
   - Go to "Site settings" → "Environment variables"
   - Add the same environment variables as mentioned for Vercel
6. Click "Deploy site"

### Step 4: Configure Custom Domain (Optional)

1. Go to "Site settings" → "Domain management"
2. Add your custom domain and follow the verification steps

## Post-Deployment Verification

After deploying to either platform, verify the following:

1. The application loads correctly
2. Wallet connection works properly
3. Staking functionality is operational
4. Animations and visualizations render as expected
5. Network switching between Arbitrum and Base works correctly

## Troubleshooting Common Issues

### Build Failures

- **Issue**: Build fails due to missing dependencies
  **Solution**: Ensure all dependencies are correctly listed in package.json

- **Issue**: Environment variables not accessible
  **Solution**: Verify that all environment variables are correctly set in the platform's settings

### Runtime Errors

- **Issue**: Wallet connection issues
  **Solution**: Check browser console for errors and verify that the correct RPC URLs and chain IDs are configured

- **Issue**: Smart contract interactions failing
  **Solution**: Verify contract addresses and ABIs are correct for the deployed networks

## Updating Your Deployment

Both Vercel and Netlify support continuous deployment. When you push changes to your GitHub repository, they will automatically trigger a new build and deployment.

## Conclusion

Your Morpheus Open Source Accelerator application is now deployed and accessible to users. The enhanced UI with animated staking flow and reward visualization provides an engaging user experience while maintaining all the core functionality of the original application.
