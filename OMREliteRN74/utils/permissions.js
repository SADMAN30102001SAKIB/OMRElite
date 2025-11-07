import {Platform, Alert} from 'react-native';
import {
  PERMISSIONS,
  RESULTS,
  check,
  request,
  requestMultiple,
  openSettings,
} from 'react-native-permissions';

// Professional alert handler for storage
const showPermissionAlert = () => {
  Alert.alert(
    'Storage Permission Required',
    'OMRElite needs storage access to save and manage PDF files. Please grant the permission to continue.',
    [
      {text: 'Cancel', style: 'cancel'},
      {
        text: 'Open Settings',
        onPress: () =>
          openSettings().catch(() => console.warn('Cannot open settings')),
      },
    ],
  );
};

// Professional alert handler for camera
const showCameraPermissionAlert = () => {
  Alert.alert(
    'Camera Permission Required',
    'OMRElite needs camera access to capture OMR sheets. Please grant the permission to continue.',
    [
      {text: 'Cancel', style: 'cancel'},
      {
        text: 'Open Settings',
        onPress: () =>
          openSettings().catch(() => console.warn('Cannot open settings')),
      },
    ],
  );
};

// Professional storage permission handler for all Android versions
export const requestStoragePermissions = async () => {
  if (Platform.OS !== 'android') {
    return true;
  }

  try {
    const androidVersion = Platform.Version;

    if (androidVersion >= 33) {
      // Android 13+ - Request granular media permissions
      const mediaPermissions = [
        PERMISSIONS.ANDROID.READ_MEDIA_IMAGES,
        PERMISSIONS.ANDROID.READ_MEDIA_VIDEO,
        PERMISSIONS.ANDROID.READ_MEDIA_AUDIO,
      ];

      const results = await requestMultiple(mediaPermissions);
      const allGranted = mediaPermissions.every(
        permission => results[permission] === RESULTS.GRANTED,
      );

      if (!allGranted) {
        showPermissionAlert();
        return false;
      }
      return true;
    } else if (androidVersion >= 30) {
      // Android 11-12 - Request READ_EXTERNAL_STORAGE
      const result = await request(PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE);

      if (result !== RESULTS.GRANTED) {
        showPermissionAlert();
        return false;
      }
      return true;
    } else {
      // Android 10 and below - Request both READ and WRITE
      const storagePermissions = [
        PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE,
        PERMISSIONS.ANDROID.WRITE_EXTERNAL_STORAGE,
      ];

      const results = await requestMultiple(storagePermissions);
      const allGranted = storagePermissions.every(
        permission => results[permission] === RESULTS.GRANTED,
      );

      if (!allGranted) {
        showPermissionAlert();
        return false;
      }
      return true;
    }
  } catch (error) {
    console.error('Error requesting storage permissions:', error);
    return false;
  }
};

// Professional permission check without requesting
export const checkStoragePermissions = async () => {
  if (Platform.OS !== 'android') {
    return true;
  }

  try {
    const androidVersion = Platform.Version;

    if (androidVersion >= 33) {
      const results = await Promise.all([
        check(PERMISSIONS.ANDROID.READ_MEDIA_IMAGES),
        check(PERMISSIONS.ANDROID.READ_MEDIA_VIDEO),
        check(PERMISSIONS.ANDROID.READ_MEDIA_AUDIO),
      ]);
      return results.every(result => result === RESULTS.GRANTED);
    } else if (androidVersion >= 30) {
      const result = await check(PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE);
      return result === RESULTS.GRANTED;
    } else {
      const results = await Promise.all([
        check(PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE),
        check(PERMISSIONS.ANDROID.WRITE_EXTERNAL_STORAGE),
      ]);
      return results.every(result => result === RESULTS.GRANTED);
    }
  } catch (error) {
    console.error('Error checking storage permissions:', error);
    return false;
  }
};

// Camera permission handler
export const requestCameraPermission = async () => {
  if (Platform.OS !== 'android') {
    return true;
  }

  try {
    const result = await request(PERMISSIONS.ANDROID.CAMERA);

    if (result === RESULTS.GRANTED) {
      return true;
    } else if (result === RESULTS.DENIED) {
      showCameraPermissionAlert();
      return false;
    } else if (result === RESULTS.BLOCKED) {
      showCameraPermissionAlert();
      return false;
    }
    return false;
  } catch (error) {
    console.error('Error requesting camera permission:', error);
    return false;
  }
};

// Check camera permission without requesting
export const checkCameraPermission = async () => {
  if (Platform.OS !== 'android') {
    return true;
  }

  try {
    const result = await check(PERMISSIONS.ANDROID.CAMERA);
    return result === RESULTS.GRANTED;
  } catch (error) {
    console.error('Error checking camera permission:', error);
    return false;
  }
};
