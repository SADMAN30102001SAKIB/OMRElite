import React, {useState, useEffect} from 'react';
import {
  ActivityIndicator,
  View,
  Alert,
  ScrollView,
  ToastAndroid,
  Text,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import FileViewer from 'react-native-file-viewer';
import RNFS from 'react-native-fs';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import OmrGenerationForm from '../components/OmrGenerationForm';
import {
  checkStoragePermissions,
  requestStoragePermissions,
} from '../utils/permissions';

const OmrGeneration = ({route, navigation}) => {
  const {omrData, localPath, idx, students, reports} = route.params;
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    iName: '',
    iColor: 'black',
    iFont: 'Helvetica-Bold',
    isIUnderline: true,
    iSize: 16,
    pName: '',
    pColor: 'black',
    pFont: 'Helvetica-BoldOblique',
    isPUnderline: false,
    pSize: 9,
    isName: true,
    isRoll: true,
    rollDigit: 0,
    setCount: 1,
    questionsCount: 0,
    mpq: 1,
    isNegative: false,
    negativeMark: -0.25,
    wqCase: 1,
  });

  useEffect(() => {
    if (students.length) {
      Alert.alert(
        'Attention',
        'Access To Some Settings is Restricted. Student History Needs to Be Fully Cleared For Full Access!',
      );
    }
    if (omrData) {
      setFormData(omrData);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const unsubscribeFocus = navigation.addListener('focus', () => {
      setIsLoading(false);
    });
    return () => unsubscribeFocus();
  }, [navigation]);

  const handleInputChange = (name, value) => {
    setFormData(prevState => ({
      ...prevState,
      [name]: value,
    }));
  };

  const saveToLocalStorage = async examHistory => {
    try {
      const existingHistory = await AsyncStorage.getItem('pdfHistory');
      const pdfHistory = existingHistory ? JSON.parse(existingHistory) : [];
      idx !== null
        ? (pdfHistory[idx] = examHistory)
        : pdfHistory.push(examHistory);
      await AsyncStorage.setItem('pdfHistory', JSON.stringify(pdfHistory));

      // Check permission before file operations
      const hasPermissions = await checkStoragePermissions();
      if (hasPermissions && (await RNFS.exists(examHistory.localFilePath))) {
        FileViewer.open(examHistory.localFilePath).catch(error => {
          ToastAndroid.show(
            "Can't Open PDF!\n" +
              'Go Manually Open It in Your Device From This Path:\n' +
              examHistory.localFilePath.substring(
                examHistory.localFilePath.indexOf('Download'),
              ),
            ToastAndroid.LONG,
          );
          console.log('Error opening PDF:', error);
        });
      }

      // Reset navigation stack: Home -> ExamHistory -> OmrEvaluation
      navigation.reset({
        index: 2,
        routes: [
          {name: 'Home'},
          {name: 'ExamHistory'},
          {
            name: 'OmrEvaluation',
            params: {
              formData: examHistory.formData,
              localFilePath: examHistory.localFilePath,
              index: idx !== null ? idx : pdfHistory.length - 1,
              students: examHistory.students,
              reports: examHistory.reports,
            },
          },
        ],
      });
    } catch (error) {
      setIsLoading(false);
      ToastAndroid.show('Error Saving Data!', ToastAndroid.LONG);
      console.log('Error saving to local storage:', error);
    }
  };

  const handleSubmit = async () => {
    // Verify storage permissions before proceeding
    const hasPermissions = await checkStoragePermissions();
    if (!hasPermissions) {
      const granted = await requestStoragePermissions();
      if (!granted) {
        Alert.alert(
          'Permission Required',
          'Storage permission is required to save OMR sheets. Please grant permission and try again.',
        );
        return;
      }
    }

    if (
      !formData.iName.trim() ||
      !formData.pName.trim() ||
      !formData.questionsCount ||
      (formData.isRoll && !formData.rollDigit)
    ) {
      Alert.alert('', 'Please Input All Fields!');
      return;
    }
    if (!(formData.questionsCount >= 1 && formData.questionsCount <= 100)) {
      Alert.alert('', 'Questions Out Of Range!');
      return;
    }
    if (
      formData.isRoll &&
      !(formData.rollDigit >= 1 && formData.rollDigit <= 11)
    ) {
      Alert.alert('', 'ID Number Out Of Range!');
      return;
    }
    if (isNaN(Number(formData.iSize)) || Number(formData.iSize) <= 0) {
      Alert.alert(
        '',
        'Text Size Of Institute Name Must Be A Positive(+) Number!',
      );
      return;
    }
    if (isNaN(Number(formData.pSize)) || Number(formData.pSize) <= 0) {
      Alert.alert('', 'Text Size Of Exam Name Must Be A Positive(+) Number!');
      return;
    }

    const formdata = {};
    formdata.iName = formData.iName;
    formdata.isIUnderline = formData.isIUnderline;
    formdata.iSize = Number(formData.iSize);
    formdata.iColor = formData.iColor;
    formdata.iFont = formData.iFont;
    formdata.pName = formData.pName;
    formdata.isPUnderline = formData.isPUnderline;
    formdata.pSize = Number(formData.pSize);
    formdata.pColor = formData.pColor;
    formdata.pFont = formData.pFont;
    formdata.isName = formData.isName;
    formdata.isRoll = formData.isRoll;
    formdata.rollDigit = formData.rollDigit;
    formdata.setCount = formData.setCount;
    formdata.questionsCount = formData.questionsCount;

    setIsLoading(true);
    try {
      const response = await axios.post(
        'https://omr-gen-server.vercel.app/generate-pdf',
        formdata,
        {
          responseType: 'blob',
        },
      );
      if (response.data) {
        let localFilePath;
        if (!localPath) {
          const customDirectoryPath = `${
            RNFS.DownloadDirectoryPath
          }/OMRElite (!!!DO NOT DELETE!!!)/${
            formData.pName
          }_${new Date().getTime()}`;
          const directoryExists = await RNFS.exists(customDirectoryPath);
          if (!directoryExists) {
            await RNFS.mkdir(customDirectoryPath);
          }
          localFilePath = `${customDirectoryPath}/OMR_${new Date().getTime()}.pdf`;
        } else {
          const lastIndex = localPath.lastIndexOf('/');
          const originalDirectoryPath = localPath.substring(0, lastIndex);
          const directoryExists = await RNFS.exists(originalDirectoryPath);
          if (!directoryExists) {
            await RNFS.mkdir(originalDirectoryPath);
          } else {
            try {
              const fileExists = await RNFS.exists(localPath);
              if (fileExists) {
                await RNFS.unlink(localPath);
              }
            } catch (error) {
              ToastAndroid.show(
                'An Unexpected Error Occured!',
                ToastAndroid.LONG,
              );
              console.log('Error deleting file:', error);
            }
          }
          localFilePath = `${originalDirectoryPath}/OMR_${new Date().getTime()}.pdf`;
        }
        const reader = new FileReader();
        reader.readAsDataURL(response.data);
        reader.onloadend = () => {
          const base64data = reader.result;
          const base64WithoutPrefix = base64data.split(',')[1];
          RNFS.writeFile(localFilePath, base64WithoutPrefix, 'base64')
            .then(async () => {
              const examHistory = {
                formData: formData,
                localFilePath: localFilePath,
                students,
                reports,
              };
              for (let i = 1; i <= formData.setCount; i++) {
                for (let j = 1; j <= formData.questionsCount; j++) {
                  if (!omrData) {
                    examHistory.formData['set' + i + 'Q' + j] = '-1';
                  } else {
                    examHistory.formData['set' + i + 'Q' + j] = omrData[
                      'set' + i + 'Q' + j
                    ]
                      ? omrData['set' + i + 'Q' + j].toString()
                      : (-formData.wqCase).toString();
                  }
                }
              }
              saveToLocalStorage(examHistory);
            })
            .catch(err => {
              setIsLoading(false);
              const errorMsg = err.message?.toLowerCase() || '';
              if (
                errorMsg.includes('permission') ||
                errorMsg.includes('eacces')
              ) {
                Alert.alert(
                  'Permission Error',
                  'Unable to save PDF. Please check storage permissions in your device settings.',
                );
              } else {
                ToastAndroid.show('Error Saving PDF!', ToastAndroid.LONG);
              }
              console.log('Error Saving PDF:', err.message);
            });
        };
      } else {
        setIsLoading(false);
        ToastAndroid.show('No Response!', ToastAndroid.LONG);
        console.log('No Response');
      }
    } catch (error) {
      setIsLoading(false);
      ToastAndroid.show('Error Getting PDF!', ToastAndroid.LONG);
      console.log('Error fetching PDF:', error);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-[#0a0a0f]">
      {isLoading ? (
        <View className="flex-1 justify-center items-center bg-[#0a0a0f]">
          {/* Modern Loading Animation */}
          <View className="items-center">
            {/* Animated Circle */}
            <View className="w-24 h-24 rounded-full border-4 border-primary/20 border-t-primary items-center justify-center mb-6">
              <ActivityIndicator size="large" color="#00ff5f" />
            </View>

            {/* Loading Text */}
            <Text className="text-white text-xl font-bold mb-2">
              Generating OMR Sheet
            </Text>
            <Text className="text-white/40 text-sm">
              Please wait while we create your exam...
            </Text>

            {/* Progress Dots */}
            <View className="flex-row gap-x-2 mt-6">
              <View className="w-2 h-2 rounded-full bg-primary" />
              <View className="w-2 h-2 rounded-full bg-primary/60" />
              <View className="w-2 h-2 rounded-full bg-primary/30" />
            </View>
          </View>
        </View>
      ) : (
        <ScrollView className="flex-1">
          <OmrGenerationForm
            formData={formData}
            students={students}
            handleInputChange={handleInputChange}
            handleSubmit={handleSubmit}
          />
        </ScrollView>
      )}
    </SafeAreaView>
  );
};

export default OmrGeneration;
