# 🚀 OMRElite React Native - Setup Guide

Complete setup guide for developers working on a **fresh Windows installation**.

---

## 📋 Prerequisites

Before you begin, ensure you have:

- A Windows PC with administrator access
- Stable internet connection (~2GB download required)
- An Android phone with USB cable
- At least 10GB free disk space

---

## 🛠️ Step-by-Step Installation

### 1️⃣ Install Node.js

1. Download **Node.js LTS** from: [https://nodejs.org/](https://nodejs.org/)
2. Run the installer (choose all default options)
3. Verify installation:
   ```bash
   node -v    # Should show v24.x or higher
   npm -v     # Should show v11.x or higher
   ```

---

### 2️⃣ Install Git

1. Download **Git for Windows** from: [https://git-scm.com/download/win](https://git-scm.com/download/win)
2. Run installer (use default settings)
3. Verify installation:
   ```bash
   git --version
   ```

---

### 3️⃣ Install Android Studio

1. Download **Android Studio** from: [https://developer.android.com/studio](https://developer.android.com/studio)
2. Run installer and select:
   - ✅ Android SDK
   - ✅ Android SDK Platform
   - ✅ Android Virtual Device (optional)

#### Configure SDK:

After installation:

1. Open **Android Studio**
2. Click **More Actions** → **SDK Manager**
3. In **SDK Platforms** tab, check:
   - ✅ **Android 14.0 (UpsideDownCake) - API Level 34**
   - ✅ **Android 6.0 (Marshmallow) - API Level 23**
4. In **SDK Tools** tab, check:
   - ✅ **Android SDK Build-Tools**
   - ✅ **Android SDK Command-line Tools**
   - ✅ **Android SDK Platform-Tools**
   - ✅ **Android Emulator** (if using emulator)
5. Click **Apply** and wait for downloads to complete

---

### 4️⃣ Set Environment Variables

#### Add System Variables:

1. Press `Win + X` → Select **System**
2. Click **Advanced system settings** → **Environment Variables**
3. Under **System variables**, click **New** and add:

   **Variable 1:**

   ```
   Variable name: ANDROID_HOME
   Variable value: C:\Users\YourUserName\AppData\Local\Android\Sdk
   ```

   **Variable 2:**

   ```
   Variable name: JAVA_HOME
   Variable value: C:\Program Files\Android\Android Studio\jbr
   ```

#### Update Path Variable:

1. Under **System variables**, find and select **Path**
2. Click **Edit** → **New** and add these entries:

   ```
   %ANDROID_HOME%\platform-tools
   %ANDROID_HOME%\tools
   %ANDROID_HOME%\tools\bin
   %JAVA_HOME%\bin
   ```

3. Click **OK** on all dialogs
4. **Restart your terminal** (or PC) for changes to take effect

---

### 5️⃣ Accept Android SDK Licenses

Open **Command Prompt** or **PowerShell** as Administrator:

```bash
cd %ANDROID_HOME%\cmdline-tools\latest\bin
sdkmanager --licenses
```

Press `y` to accept all licenses.

---

### 6️⃣ Setup Android Phone for Development

#### Enable Developer Mode:

1. Go to **Settings** → **About Phone**
2. Find **Build Number** (may be under "Software Information")
3. Tap **Build Number** rapidly **7 times**
4. You'll see: "You are now a developer!"

#### Enable USB Debugging:

1. Go to **Settings** → **Developer Options**
2. Enable **USB Debugging**
3. Enable **Install via USB** (if available)
4. Enable **Stay awake** (optional)

---

## 📦 Project Setup

### 7️⃣ Clone the Repository

```bash
git clone https://github.com/SADMAN30102001SAKIB/OMRElite.git
cd OMRElite
cd "Frontend (react native)"
```

---

### 8️⃣ Install Dependencies

```bash
npm install
```

This will install all required Node.js packages (~500MB).

---

### 9️⃣ Connect Your Android Device

1. Connect your Android phone to PC via **USB cable**
2. On your phone, you'll see a popup: **"Allow USB debugging?"**
3. Check **"Always allow from this computer"**
4. Tap **OK**

#### Verify Device Connection:

```bash
adb devices
```

You should see output like:

```
List of devices attached
ABC123XYZ    device
```

If you see `unauthorized`, disconnect USB, revoke USB debugging authorizations on phone, and reconnect.

---

### 🔟 Build and Run the App

#### 🎯 Recommended Method: Metro Interactive CLI

**This is the easiest and most reliable way to run your app!**

```bash
npm start
```

Metro bundler will start and show:

```
i - run on iOS
a - run on Android
d - open Dev Menu
r - reload app
```

**Just press `a`** and Metro will:

- ✅ Build the app automatically
- ✅ Install APK on your phone
- ✅ Launch the app
- ✅ Enable hot reload

**First build takes 5-10 minutes**, subsequent builds are much faster (30-60 seconds).

---

#### Alternative Methods (if Metro's `a` doesn't work)

**Method 1: npm run android**

```bash
npm run android
```

Starts Metro + builds + installs + launches automatically.

**Method 2: Stable build (if daemon crashes)**

```bash
npm run android:stable
```

Bypasses Gradle daemon issues on some systems.

---

## ✅ Verify Your Setup

Run these commands to verify everything is installed correctly:

```bash
# Node.js
node -v         # Should show v20.x or higher

# npm
npm -v          # Should show v9.x or higher

# Java
java -version   # Should show version 17

# Android SDK
echo %ANDROID_HOME%    # Should show SDK path

# ADB (Android Debug Bridge)
adb version     # Should show version info

# Connected devices
adb devices     # Should list your phone
```

---

## 🚨 Common Issues & Solutions

### Issue: `adb: command not found`

**Solution:**

- Environment variables not set correctly
- Restart terminal after setting environment variables
- Verify Path includes `%ANDROID_HOME%\platform-tools`

---

### Issue: `ANDROID_HOME is not set`

**Solution:**
Create file `android/local.properties`:

```properties
sdk.dir=C:\\Users\\YourUserName\\AppData\\Local\\Android\\Sdk
```

---

### Issue: `licenses not accepted`

**Solution:**

```bash
cd %ANDROID_HOME%\cmdline-tools\latest\bin
sdkmanager --licenses
```

Press `y` for all prompts.

---

### Issue: Device shows "unauthorized"

**Solution:**

1. On phone: Go to **Developer Options**
2. Tap **Revoke USB debugging authorizations**
3. Disconnect and reconnect USB
4. Accept the authorization prompt again

---

### Issue: `Gradle build failed` / `JVM crash` / `daemon has disappeared`

**This is a known issue with Gradle daemon on certain Windows systems.**

**Solution:**

Use the stable build method that disables the daemon:

```bash
# Terminal 1 - Start Metro
npm start

# Terminal 2 - Build without daemon
npm run android:stable
```

Or run Gradle directly with `--no-daemon` flag:

```bash
cd android
.\gradlew.bat clean --no-daemon
.\gradlew.bat app:installDebug --no-daemon
```

**Why this happens:**

- Gradle daemon caches data in memory for faster builds
- On some systems (OpenJDK 17 + Gradle 8.3 + Kotlin 1.9.22), the daemon crashes
- Using `--no-daemon` flag forces Gradle to run as a regular process (slightly slower but stable)

---

### Issue: Metro bundler port 8081 already in use

**Solution:**

```bash
# Kill the process using port 8081
npx react-native start --reset-cache
```

---

## 📱 Running on Phone

After successful build:

1. App will automatically install on your phone
2. App will launch automatically
3. Grant permissions when prompted:
   - ✅ Camera access
   - ✅ Storage/Media access
   - ✅ Audio access

---

## 🔄 Development Workflow

### Daily Development (Recommended):

**Just one command:**

```bash
npm start
```

Then press **`a`** in the Metro terminal to run on Android.

That's it! Metro handles everything:

- ✅ Builds your app
- ✅ Installs on your phone
- ✅ Launches automatically
- ✅ Hot reloads when you save files

### Edit Code:

1. Open any `.js` file in your editor
2. Make changes
3. Press `Ctrl+S` to save
4. **App automatically reloads on your phone!** ✨

### Useful Metro Commands:

Press these keys in the Metro terminal:

- **`r`** - Reload JavaScript bundle
- **`d`** - Open developer menu on phone
- **`i`** - Run on iOS (if you have Mac)

### When to Rebuild:

You only need to rebuild when you change **native code**:

- Modified files in `android/` folder
- Added new native dependencies
- Changed `AndroidManifest.xml`

To rebuild: Press `a` again in Metro terminal.

---

## 📂 Project Structure

```
Frontend (react native)/
├── android/              # Android native code
│   ├── app/
│   │   ├── build.gradle # App-level build config
│   │   └── src/         # MainActivity, AndroidManifest
│   ├── build.gradle     # Project-level build config
│   ├── settings.gradle  # Gradle settings
│   └── gradle.properties
├── components/          # React components
├── screens/            # Screen components
├── navigation/         # Navigation setup
├── utils/              # Utility functions
├── App.js              # Root component
├── index.js            # Entry point
├── package.json        # Dependencies
└── .gitignore
```

---

## 🔧 Configuration Details

### Current Setup:

- **React Native:** 0.73.6
- **React:** 18.2.0
- **Node:** v24+
- **Gradle:** 8.3
- **Android Min SDK:** 23 (Android 6.0+)
- **Android Target SDK:** 34 (Android 14)
- **Kotlin:** 1.9.22

---

## 📦 Key Dependencies

- `@react-navigation/native` - Navigation
- `react-native-image-picker` - Camera/Gallery access
- `react-native-pdf` - PDF viewing
- `react-native-fs` - File system access
- `react-native-permissions` - Permission handling
- `@react-native-async-storage/async-storage` - Local storage

---

## ⏱️ Estimated Setup Time

| Step                        | Time          |
| --------------------------- | ------------- |
| Node.js installation        | 5 min         |
| Git installation            | 2 min         |
| Android Studio + SDK        | 20-30 min     |
| Environment variables       | 5 min         |
| Project clone + npm install | 5 min         |
| First build & run           | 5-10 min      |
| **Total**                   | **40-60 min** |

---

## 💡 Tips for Success

1. ✅ **Just use `npm start` and press `a`** - Easiest workflow!
2. ✅ Keep Metro bundler running while developing
3. ✅ Use **USB 2.0** port (USB 3.0 can cause connection issues)
4. ✅ Use good quality USB cable
5. ✅ Keep phone screen unlocked during first build
6. ✅ Grant all permissions when app launches
7. ✅ First build takes 5-10 minutes, subsequent builds ~30-60 seconds
8. ✅ Save files to trigger hot reload - no need to rebuild!

---

## 🆘 Need Help?

If you encounter issues not covered here:

1. Check error message carefully
2. Search for error on [Stack Overflow](https://stackoverflow.com/)
3. Check [React Native Documentation](https://reactnative.dev/docs/environment-setup)
4. Open an issue on GitHub

---

## 📚 Additional Resources

- [React Native Docs](https://reactnative.dev/)
- [Android Studio User Guide](https://developer.android.com/studio/intro)
- [React Navigation](https://reactnavigation.org/)
- [Debugging React Native](https://reactnative.dev/docs/debugging)

---

## ✅ Post-Setup Checklist

After successful setup, you should be able to:

- ✅ Run `npm start` to start Metro bundler
- ✅ Press `a` in Metro to build and run app
- ✅ See app on your phone
- ✅ Make code changes and see hot reload
- ✅ Use developer menu on phone (shake or press `d`)
- ✅ Debug using Chrome DevTools
- ✅ Build release APK for distribution

## 🎯 Quick Command Reference

```bash
# MAIN COMMAND - Use this for everything!
npm start
# Then press 'a' to run on Android

# Alternative commands (rarely needed)
npm run android              # All-in-one: Metro + build + install
npm run android:stable       # Bypass daemon crashes

# Troubleshooting
cd android
.\gradlew.bat clean --no-daemon  # Clean build cache
cd ..

# Device management
adb devices                  # List connected devices
adb logcat                   # View Android system logs

# Metro commands (press in Metro terminal)
a - Run on Android
r - Reload app
d - Developer menu
```

# Restart Metro bundler with cache reset

npm start -- --reset-cache

```

---

**Happy Coding! 🚀**

If you found this guide helpful, please star the repository! ⭐
```
