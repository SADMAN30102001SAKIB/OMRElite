import React, {useState, useEffect} from 'react';
import {ActivityIndicator, View, Alert, ToastAndroid} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import RNFS from 'react-native-fs';
import AsyncStorage from '@react-native-async-storage/async-storage';
import StudentHistoryList from '../components/StudentHistoryList';
import {
  checkStoragePermissions,
  requestStoragePermissions,
} from '../utils/permissions';

const StudentHistory = ({route, navigation}) => {
  const {formData, localFilePath, index, students} = route.params;
  const [studentItems, setStudentItems] = useState(students);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    fetchStudent();
    const unsubscribe = navigation.addListener('focus', () => {
      fetchStudent();
    });
    return unsubscribe;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [navigation]);

  const fetchStudent = async () => {
    setIsLoading(true);
    try {
      const historyJson = await AsyncStorage.getItem('pdfHistory');
      const history = JSON.parse(historyJson);
      setStudentItems(history[index].students);
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
      await AsyncStorage.setItem('pdfHistory', JSON.stringify([]));
      await Delete(
        `${RNFS.DownloadDirectoryPath}/OMRElite (!!!DO NOT DELETE!!!)`,
      );
      ToastAndroid.show(
        'History deleted because of corrupted data!',
        ToastAndroid.LONG,
      );
      navigation.navigate('Home');
      console.log('Error fetching student from local storage:', error);
    }
  };

  const Delete = async directoryPath => {
    try {
      // Check permissions before file operations
      const hasPermissions = await checkStoragePermissions();
      if (!hasPermissions) {
        const granted = await requestStoragePermissions();
        if (!granted) {
          Alert.alert(
            'Permission Required',
            'Storage permission is required to delete files.',
          );
          return;
        }
      }

      const directoryExists = await RNFS.exists(directoryPath);
      if (directoryExists) {
        await RNFS.unlink(directoryPath);
      } else {
        console.log('Directory does not exist:', directoryPath);
      }
    } catch (error) {
      console.log('Error deleting directory:', error);
    }
  };

  const deleteStudentItem = async idx => {
    Alert.alert(
      'Delete History Item?',
      'Are you sure you want to delete this history item? This action cannot be undone.',
      [
        {
          text: 'NO',
          onPress: () => {},
          style: 'cancel',
        },
        {
          text: 'YES',
          onPress: async () => {
            setIsLoading(true);
            try {
              let updatedStudents = [...studentItems];
              await Delete(updatedStudents[idx].localPath);
              updatedStudents.splice(idx, 1);
              const historyJson = await AsyncStorage.getItem('pdfHistory');
              const history = JSON.parse(historyJson);
              history[index].students = updatedStudents;
              setStudentItems(updatedStudents);
              await AsyncStorage.setItem('pdfHistory', JSON.stringify(history));

              setIsLoading(false);
              ToastAndroid.show(
                'Item deleted successfully!',
                ToastAndroid.SHORT,
              );
            } catch (error) {
              setIsLoading(false);
              ToastAndroid.show('Failed to delete item!', ToastAndroid.LONG);
              console.log('Error deleting student item:', error);
            }
          },
        },
      ],
      {cancelable: false},
    );
  };

  return (
    <SafeAreaView className="flex-1 bg-[#111]">
      {isLoading ? (
        <View className="bg-[#111] flex-1 justify-center items-center">
          <ActivityIndicator size="large" color="#007bff" />
        </View>
      ) : (
        <StudentHistoryList
          formData={formData}
          localFilePath={localFilePath}
          index={index}
          studentItems={studentItems}
          deleteStudentItem={deleteStudentItem}
          navigation={navigation}
        />
      )}
    </SafeAreaView>
  );
};

export default StudentHistory;
