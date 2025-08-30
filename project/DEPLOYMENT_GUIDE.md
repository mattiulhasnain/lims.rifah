# 🚀 DigitalOcean Deployment Guide for LIMS

## What You'll Get
- ✅ Your LIMS app running on the internet
- ✅ Real PostgreSQL database (not just local storage)
- ✅ Professional system for your lab
- ✅ Multiple users can access it from anywhere

## 📋 Prerequisites
1. **DigitalOcean Account** with $200 student credits
2. **GitHub Account** (free)
3. **Your LIMS project** (already done!)

## 🗄️ Step 1: Create Database
1. Go to [DigitalOcean](https://cloud.digitalocean.com/)
2. Click **"Create"** → **"Databases"**
3. Choose **"PostgreSQL"**
4. Select **"db-s-1vcpu-1gb"** ($15/month) - **Perfect for 70 reports/day**
5. Choose a **datacenter region** close to you
6. Click **"Create Database Cluster"**
7. **Save the connection details** (you'll need them later)

## 🌐 Step 2: Deploy Your App
1. In DigitalOcean, click **"Create"** → **"Apps"**
2. Connect your **GitHub account**
3. Select your **LIMS repository**
4. Choose **"Deploy from source code"**
5. DigitalOcean will automatically detect your app structure
6. Click **"Next"** and **"Create Resources"**

## ⚙️ Step 3: Configure Environment
1. In your app settings, add these **Environment Variables**:
   ```
   DATABASE_URL=your_database_connection_string
   JWT_SECRET=your_secret_key_here
   NODE_ENV=production
   ```

## 🔗 Step 4: Connect Database
1. Go back to your **Database** in DigitalOcean
2. Copy the **Connection String**
3. Paste it as the **DATABASE_URL** in your app settings
4. **Restart your app**

## 🎉 Step 5: Test Your LIMS
1. Your app will be available at: `https://your-app-name.ondigitalocean.app`
2. **Login** with default credentials:
   - Username: `admin`
   - Password: `admin123`
3. **Test all features** - patients, tests, invoices, etc.

## 💰 Cost Breakdown
- **Database**: $15/month (perfect for 70 reports/day)
- **App Hosting**: $5/month (single backend instance)
- **Total**: $20/month
- **With $200 credits**: You can run for **10 months**

## 🆘 Need Help?
If something goes wrong:
1. Check the **Logs** in your DigitalOcean app
2. Make sure your **database is running**
3. Verify **environment variables** are set correctly

## 🔒 Security Notes
- **Change default passwords** after first login
- **Enable SSL** (DigitalOcean does this automatically)
- **Regular backups** are automatic with managed database

## 📱 Access Your LIMS
- **From any computer**: Use the web browser
- **From mobile**: Works on all devices
- **Multiple users**: Can access simultaneously
- **Data persistence**: All data is saved in the cloud

Your LIMS will now work like a professional laboratory management system! 🧪 