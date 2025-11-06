#### Make sure you have a signing key configured in:
`build.gradle`
`gradle.properties`

Otherwise the build will create an unsigned APK that won't install.

---

If you don't have a signing key, you can create one using the following command inside the `android/app` directory:

```
keytool -genkey -v -keystore my-release-key.keystore -alias my-key-alias -keyalg RSA -keysize 2048 -validity 10000 
```

This will create a `my-release-key.keystore` file. Then update your `gradle.properties` and `build.gradle` files accordingly:

`gradle.properties:`
```
...
MYAPP_RELEASE_STORE_FILE=my-release-key.keystore
MYAPP_RELEASE_KEY_ALIAS=my-key-alias
MYAPP_RELEASE_STORE_PASSWORD=your-store-password
MYAPP_RELEASE_KEY_PASSWORD=your-key-password
```

`build.gradle:`
```gradle
android {
    ...
    signingConfigs {
        ...
        if (project.hasProperty('OMRELITE_RELEASE_STORE_FILE')) {
            storeFile file(OMRELITE_RELEASE_STORE_FILE)
            storePassword OMRELITE_RELEASE_STORE_PASSWORD
            keyAlias OMRELITE_RELEASE_KEY_ALIAS
            keyPassword OMRELITE_RELEASE_KEY_PASSWORD
        }
    }
    ...
    buildTypes {
        ...
        release {
            signingConfig signingConfigs.release
            ...
        }
    }
    ...
}
```

---

##### Then run the following commands in your terminal:
```
cd "Frontend (react native)"

npx react-native set-icon --path "path/to/your/app-logo.png" --background "#FFFFFF"

cd android
./gradlew clean
./gradlew assembleRelease
cd..
adb install -r android/app/build/outputs/apk/release/app-release.apk
```