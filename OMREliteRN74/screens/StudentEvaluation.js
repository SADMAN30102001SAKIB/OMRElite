import React, {useState, useEffect} from 'react';
import {
  ScrollView,
  ActivityIndicator,
  View,
  Alert,
  ToastAndroid,
  AppState,
} from 'react-native';
import FileViewer from 'react-native-file-viewer';
import RNFS from 'react-native-fs';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import StudentEvaluationInfo from '../components/StudentEvaluationInfo';
import styles from '../screenStyles/OmrEvaluationStyle';
import {
  checkStoragePermissions,
  requestStoragePermissions,
} from '../utils/permissions';

const StudentEvaluation = ({route, navigation}) => {
  let {formData, localFilePath, index, student, idx} = route.params;
  const [isLoading, setIsLoading] = useState(false);
  let [localPath, setLocalPath] = useState(student.localPath);
  let [errorHeader, setErrorHeader] = useState('');
  let [errorFileDelete, setErrorFileDelete] = useState(false);
  const [appState, setAppState] = useState(AppState.currentState);

  useEffect(() => {
    const subscription = AppState.addEventListener(
      'change',
      async nextAppState => {
        if (
          appState.match(/inactive|background/) &&
          nextAppState === 'active'
        ) {
          if (errorFileDelete) {
            Alert.alert('Error', errorHeader);
            const hasPermissions = await checkStoragePermissions();
            if (hasPermissions) {
              await RNFS.unlink(localPath);
            }
            setErrorFileDelete(false);
          }
        }
        setAppState(nextAppState);
      },
    );

    return () => {
      subscription.remove();
    };
  }, [appState]);

  const openPDF = async () => {
    // Check permissions before file operations
    const hasPermissions = await checkStoragePermissions();
    if (!hasPermissions) {
      const granted = await requestStoragePermissions();
      if (!granted) {
        Alert.alert(
          'Permission Required',
          'Storage permission is required to access PDF files.',
        );
        return;
      }
    }

    const directoryExists = await RNFS.exists(localPath);
    if (directoryExists) {
      FileViewer.open(localPath).catch(async error => {
        ToastAndroid.show(
          "Can't Open PDF!\n" +
            'Go Manually Open It in Your Device From This Path: ' +
            localPath.substring(localPath.indexOf('Download')),
          ToastAndroid.LONG,
        );
        if (errorFileDelete) {
          Alert.alert('Error', errorHeader);
          const hasPermissions = await checkStoragePermissions();
          if (hasPermissions) {
            await RNFS.unlink(localPath);
          }
          setErrorFileDelete(false);
        }
        console.log('Error Opening PDF:', error);
      });
    } else {
      Alert.alert(
        'File Does Not Exist!',
        'Please Re-Generate to get PDF back.',
      );
    }
  };

  async function convertUriToFile(uri, fileName, mimeType) {
    try {
      // Check permissions before file operations
      const hasPermissions = await checkStoragePermissions();
      if (!hasPermissions) {
        const granted = await requestStoragePermissions();
        if (!granted) {
          throw new Error('Storage permission not granted');
        }
      }

      const fileExists = await RNFS.exists(uri);
      if (!fileExists) {
        throw new Error('File does not exist at the provided URI.');
      }

      // Return file object directly - no base64 conversion needed!
      const fileObject = {
        uri: uri,
        name: fileName,
        type: mimeType,
      };

      return fileObject;
    } catch (error) {
      console.log('Error converting URI to file:', error);
      throw error;
    }
  }

  function guessMimeType(uri) {
    const extension = uri.split('.').pop().toLowerCase();
    switch (extension) {
      case 'jpg':
      case 'jpeg':
        return 'image/jpeg';
      case 'png':
        return 'image/png';
      default:
        return 'application/octet-stream';
    }
  }

  const handleSubmit = async source => {
    // Check permissions before file operations
    const hasPermissions = await checkStoragePermissions();
    if (!hasPermissions) {
      const granted = await requestStoragePermissions();
      if (!granted) {
        Alert.alert(
          'Permission Required',
          'Storage permission is required to process files.',
        );
        return;
      }
    }

    // User must always provide new photos
    if (!source.length) {
      Alert.alert(
        'Photos Required',
        'Please take or select new photos to re-evaluate this student.',
      );
      return;
    }

    setIsLoading(true);
    let file1 = await convertUriToFile(
      source[0],
      source[0].split('/').pop(),
      guessMimeType(source[0]),
    );
    let file2 = null;
    if (source[1]) {
      file2 = await convertUriToFile(
        source[1],
        source[1].split('/').pop(),
        guessMimeType(source[1]),
      );
    }

    const formdata = new FormData();
    formdata.append('isRoll', formData.isRoll);
    formdata.append('rollDigit', formData.rollDigit);
    formdata.append('setCount', formData.setCount);
    formdata.append('questionsCount', formData.questionsCount);
    formdata.append('mpq', formData.mpq);
    formdata.append('isNegative', formData.isNegative);
    formdata.append('negativeMark', formData.negativeMark);
    for (let i = 1; i <= formData.setCount; i++) {
      for (let j = 1; j <= formData.questionsCount; j++) {
        formdata.append('set' + i + 'Q' + j, formData['set' + i + 'Q' + j]);
      }
    }
    formdata.append('file1', file1);
    formdata.append('file2', file2);
    formdata.append('regenerate', true);
    formdata.append('idno', student.idno);
    formdata.append('setno', student.setno);
    for (let j = 1; j <= formData.questionsCount; j++) {
      formdata.append('Q' + j, student['Q' + j]);
    }
    formdata.append('marks', student.marks);

    try {
      const response = await axios.post(
        'https://sakib30102001.pythonanywhere.com/upload',
        formdata,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
          responseType: 'blob',
        },
      );

      if (response.data) {
        setIsLoading(false);

        errorHeader = response.headers.error;
        setErrorHeader(response.headers.error);

        const lastIndex = localFilePath.lastIndexOf('/');
        const customDirectoryPath = localFilePath.substring(0, lastIndex);
        const directoryExists = await RNFS.exists(customDirectoryPath);
        if (!directoryExists) {
          await RNFS.mkdir(customDirectoryPath);
        }
        const time = new Date().getTime();
        localPath = `${customDirectoryPath}/RESULT_${time}.pdf`;
        setLocalPath(`${customDirectoryPath}/RESULT_${time}.pdf`);

        const reader = new FileReader();
        reader.readAsDataURL(response.data);
        reader.onloadend = () => {
          const base64data = reader.result;
          const base64WithoutPrefix = base64data.split(',')[1];

          RNFS.writeFile(localPath, base64WithoutPrefix, 'base64')
            .then(async () => {
              openPDF(localPath);
              if (errorHeader && errorHeader.includes('Page')) {
                errorFileDelete = true;
                setErrorFileDelete(true);
              } else {
                const Exists = await RNFS.exists(student.localPath);
                if (Exists) {
                  await RNFS.unlink(student.localPath);
                }
                student.localPath = localPath;
                if (source.length) {
                  student.file1 = source[0];
                  student.file2 = source[1];
                }
                const existingHistory = await AsyncStorage.getItem(
                  'pdfHistory',
                );
                const pdfHistory = JSON.parse(existingHistory);
                pdfHistory[index].students[idx] = student;
                await AsyncStorage.setItem(
                  'pdfHistory',
                  JSON.stringify(pdfHistory),
                );
              }
            })
            .catch(err => {
              setIsLoading(false);
              ToastAndroid.show("Can't Save PDF!", ToastAndroid.LONG);
              console.log('Error: ', err.message);
            });
        };
      } else {
        setIsLoading(false);
        ToastAndroid.show('No Response!', ToastAndroid.LONG);
        console.log('No Response');
      }
    } catch (error) {
      setIsLoading(false);
      ToastAndroid.show('Error Getting PDF', ToastAndroid.LONG);
      console.log('Error fetching PDF:', error);
    }
  };

  return (
    <View style={{flex: 1}}>
      {isLoading ? (
        <View style={styles.loader}>
          <ActivityIndicator size="large" color="#007bff" />
        </View>
      ) : (
        <ScrollView style={styles.container}>
          <StudentEvaluationInfo
            omrData={formData}
            localFilePath={localFilePath}
            index={index}
            student={student}
            idx={idx}
            navigation={navigation}
            openPDF={openPDF}
            handleSubmit={handleSubmit}
          />
        </ScrollView>
      )}
    </View>
  );
};

export default StudentEvaluation;
