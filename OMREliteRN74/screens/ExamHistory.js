import React, {useState, useEffect} from 'react';
import {ActivityIndicator, View, Alert, ToastAndroid} from 'react-native';
import RNFS from 'react-native-fs';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ExamHistoryList from '../components/ExamHistoryList';
import {
  checkStoragePermissions,
  requestStoragePermissions,
} from '../utils/permissions';

const ExamHistory = ({navigation}) => {
  const [historyItems, setHistoryItems] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    fetchHistory();
    const unsubscribe = navigation.addListener('focus', () => {
      fetchHistory();
    });
    return unsubscribe;
  }, [navigation]);

  const fetchHistory = async () => {
    setIsLoading(true);
    try {
      const historyJson = await AsyncStorage.getItem('pdfHistory');
      const history = historyJson ? JSON.parse(historyJson) : [];
      setHistoryItems(history);
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
      setHistoryItems([]);
      await AsyncStorage.setItem('pdfHistory', JSON.stringify([]));
      await deleteDirectory(
        `${RNFS.DownloadDirectoryPath}/OMRElite (!!!DO NOT DELETE!!!)`,
      );
      ToastAndroid.show(
        'History Deleted Because Of Corrupted Data!',
        ToastAndroid.LONG,
      );
      navigation.navigate('Home');
      console.log('Error fetching history from local storage:', error);
    }
  };

  const deleteDirectory = async directoryPath => {
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
      }
    } catch (error) {
      ToastAndroid.show('Error Deleting!', ToastAndroid.LONG);
      console.log('Error deleting directory:', error);
    }
  };

  const deleteHistoryItem = async index => {
    Alert.alert(
      'Are You Sure?',
      'Do You Want To Delete The Entire Item (this will be a permanent deletion)?\nOr, Do You Only Want To Delete The PDFs Of This Exam (you can bring back those PDFs by Re-Generating)!',
      [
        {
          text: 'Full-Delete',
          onPress: async () => {
            setIsLoading(true);
            try {
              let updatedHistory = [...historyItems];
              const lastIndex =
                updatedHistory[index].localFilePath.lastIndexOf('/');
              const originalDirectoryPath = updatedHistory[
                index
              ].localFilePath.substring(0, lastIndex);
              await deleteDirectory(originalDirectoryPath);
              updatedHistory.splice(index, 1);
              setHistoryItems(updatedHistory);
              await AsyncStorage.setItem(
                'pdfHistory',
                JSON.stringify(updatedHistory),
              );
              setIsLoading(false);
              ToastAndroid.show(
                'History Deleted Successfully!',
                ToastAndroid.SHORT,
              );
            } catch (error) {
              setIsLoading(false);
              ToastAndroid.show('Failed To Delete!', ToastAndroid.LONG);
              console.log('Error deleting history item:', error);
            }
          },
        },
        {
          text: 'PDFs-Only',
          onPress: async () => {
            setIsLoading(true);
            try {
              let updatedHistory = [...historyItems];
              const lastIndex =
                updatedHistory[index].localFilePath.lastIndexOf('/');
              const originalDirectoryPath = updatedHistory[
                index
              ].localFilePath.substring(0, lastIndex);
              await deleteDirectory(originalDirectoryPath);
              setIsLoading(false);
              ToastAndroid.show(
                'PDFs Deleted Successfully!',
                ToastAndroid.SHORT,
              );
            } catch (error) {
              setIsLoading(false);
              ToastAndroid.show('Failed To Delete PDFs!', ToastAndroid.LONG);
              console.log('Error deleting PDFs:', error);
            }
          },
        },
      ],
      {cancelable: true},
    );
  };

  return isLoading ? (
    <View
      style={{
        backgroundColor: '#111',
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
      }}>
      <ActivityIndicator size="large" color="#007bff" />
    </View>
  ) : (
    <ExamHistoryList
      historyItems={historyItems}
      deleteHistoryItem={deleteHistoryItem}
      navigation={navigation}
    />
  );
};

export default ExamHistory;
