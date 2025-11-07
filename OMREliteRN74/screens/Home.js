import React from 'react';
import {View, TouchableOpacity, Text, ToastAndroid} from 'react-native';
import styles from '../screenStyles/HomeStyle';
import {
  checkStoragePermissions,
  requestStoragePermissions,
} from '../utils/permissions';

const Home = ({navigation}) => {
  const handleCreatePress = async () => {
    try {
      // Check if permissions are already granted (they should be from App.js)
      const hasPermissions = await checkStoragePermissions();

      if (!hasPermissions) {
        // Request permissions if not granted
        const granted = await requestStoragePermissions();
        if (!granted) {
          ToastAndroid.show(
            'Storage permission is required to create OMR sheets',
            ToastAndroid.LONG,
          );
          return;
        }
      }

      // Navigate to OMR Generation if permissions are granted
      navigation.navigate('OmrGeneration', {
        omrData: null,
        localPath: null,
        idx: null,
        students: [],
        reports: [],
      });
    } catch (err) {
      console.warn('Permission error:', err);
      ToastAndroid.show('Error checking permissions', ToastAndroid.SHORT);
    }
  };

  return (
    <View style={styles.homeContainer}>
      <Text style={styles.text}>OMRElite</Text>
      <View style={styles.button}>
        <TouchableOpacity
          style={{...styles.submitButton, backgroundColor: '#00ff5f'}}
          onPress={handleCreatePress}>
          <Text style={{...styles.submitButtonText, color: 'black'}}>
            Create
          </Text>
        </TouchableOpacity>
      </View>
      <View style={styles.button}>
        <TouchableOpacity
          style={{...styles.submitButton}}
          onPress={() => {
            navigation.navigate('ExamHistory');
          }}>
          <Text style={{...styles.submitButtonText}}>Exams</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default Home;
