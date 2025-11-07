# 🧹 React Native Cache Cleanup Guide

Over time, various cache folders from React Native development can consume several gigabytes. This guide shows how to safely clean them all.

---

## 📊 Check All Cache Sizes

### 1. Gradle Cache (~10GB)

```powershell
Get-ChildItem "$env:USERPROFILE\.gradle" -Recurse | Measure-Object -Property Length -Sum | Select-Object @{Name="Size(GB)";Expression={[math]::Round($_.Sum / 1GB, 2)}}
```

### 2. npm Cache (~2-5GB)

```powershell
npm cache verify
```

### 3. Metro Bundler Cache (~500MB)

Located in your project's `node_modules/.cache`

### 4. Android Build Cache (~1-2GB per project)

Located in `android/app/build` and `android/.gradle`

---

## 🗑️ Clean All Caches

### Clean Gradle Cache (Frees ~5GB)

### Step 1: Stop All Gradle Daemons

First, stop all running Gradle daemons:

```powershell
cd "C:\Users\Asus\Desktop\OMRElite\OMREliteRN74"
npm run stop
```

### Step 2: Delete Cache Folders

```powershell
# Delete downloaded dependencies and build cache
Remove-Item -Recurse -Force "$env:USERPROFILE\.gradle\caches"

# Delete daemon logs and crash dumps
Remove-Item -Recurse -Force "$env:USERPROFILE\.gradle\daemon"
```

**Note:** You may see path errors (Windows 260-char limit) but calculations still work.

---

### Clean npm Cache (Frees ~2-5GB)

```powershell
npm cache clean --force
```

---

### Clean Metro Bundler Cache

```powershell
cd "C:\Users\Asus\Desktop\OMRElite\OMREliteRN74"
npm run start:reset
# Press Ctrl+C after it starts
```

Or delete manually:

```powershell
Remove-Item -Recurse -Force "C:\Users\Asus\Desktop\OMRElite\OMREliteRN74\node_modules\.cache"
```

---

### Clean Project Build Files

```powershell
cd "C:\Users\Asus\Desktop\OMRElite\OMREliteRN74"
npm run clean
```

Or delete manually:

```powershell
Remove-Item -Recurse -Force "C:\Users\Asus\Desktop\OMRElite\OMREliteRN74\android\app\build"
Remove-Item -Recurse -Force "C:\Users\Asus\Desktop\OMRElite\OMREliteRN74\android\.gradle"
```

---

### Clean Temp Files (Optional - Frees ~1-5GB)

```powershell
# Clean Windows temp
Remove-Item -Recurse -Force "$env:TEMP\*" -ErrorAction SilentlyContinue

# Clean Metro temp
Remove-Item -Recurse -Force "$env:LOCALAPPDATA\Temp\metro-*" -ErrorAction SilentlyContinue
Remove-Item -Recurse -Force "$env:LOCALAPPDATA\Temp\react-*" -ErrorAction SilentlyContinue
```

---

## 📁 What Gets Deleted?

1. **`.gradle\caches`** - Downloaded dependencies, build cache (~5GB)
2. **`.gradle\daemon`** - Daemon logs and crash dumps (~100MB)
3. **npm cache** - Downloaded npm packages (~2-5GB)
4. **`node_modules\.cache`** - Metro bundler cache (~500MB)
5. **`android\app\build`** - Compiled APKs and build artifacts (~1-2GB per project)
6. **`android\.gradle`** - Project-level Gradle cache (~500MB)
7. **Temp files** - Metro and React Native temp files (~1-5GB)

**Total potential savings: 15-25GB**

---

## ✅ After Cleaning

- Gradle will automatically re-download dependencies on next build
- First build after cleaning will take longer (5-10 minutes)
- Subsequent builds will be fast again
- Your projects will continue to work normally

---

## 🔄 When to Clean?

Clean caches when:

- ✅ Running low on disk space (>15GB can be freed!)
- ✅ Getting strange build errors or dependency issues
- ✅ After upgrading React Native versions
- ✅ Metro bundler is slow or not updating
- ✅ "Module not found" errors that make no sense
- ✅ Every 2-3 months as maintenance

---

## ⚠️ Safe to Delete?

**YES!** It's completely safe to delete these folders:

- Gradle will recreate them automatically
- Your project source code is NOT affected
- Only cached/downloaded files are removed

**DO NOT delete:**

- `~/.gradle/wrapper` - Contains Gradle distributions (unless you want to re-download Gradle itself)

---

**Happy Coding! 🚀**
