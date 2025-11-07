import React, {useState} from 'react';
import {View, Alert} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ExamMarkingForm from '../components/ExamMarkingForm';

const ExamMarking = ({route, navigation}) => {
  const {omrData, localFilePath, index, students, reports} = route.params;
  const [newOmrData, setNewOmrData] = useState(omrData);

  const handleInputChange = (name, value) => {
    if (
      (name === 'negativeMark' && Number(value) > 0) ||
      (name === 'mpq' && Number(value) < 0)
    ) {
      value = -Number(value);
    }
    setNewOmrData(prevState => ({
      ...prevState,
      [name]: value,
    }));
  };

  const calculateMarks = studentData => {
    studentData.marks = 0;
    const compareStrings = (mainString, subString) => {
      for (let i = 0; i < subString.length; i++) {
        if (!mainString.includes(subString[i])) {
          return false;
        }
      }
      return true;
    };

    for (let i = 1; i <= newOmrData.questionsCount; i++) {
      if (Number(newOmrData['set' + studentData.setno + 'Q' + i]) > 0) {
        if (Number(studentData['Q' + i])) {
          if (
            !compareStrings(
              newOmrData['set' + studentData.setno + 'Q' + i],
              studentData['Q' + i],
            )
          ) {
            if (newOmrData.isNegative) {
              studentData.marks += newOmrData.negativeMark;
            }
          } else {
            studentData.marks += newOmrData.mpq;
          }
        }
      } else {
        if (Number(studentData['Q' + i])) {
          if (Number(newOmrData['set' + studentData.setno + 'Q' + i]) === -2) {
            studentData.marks += newOmrData.mpq;
          }
          if (
            Number(newOmrData['set' + studentData.setno + 'Q' + i]) === -4 ||
            Number(newOmrData['set' + studentData.setno + 'Q' + i]) === -5
          ) {
            studentData.marks += newOmrData.negativeMark;
          }
        } else {
          if (
            Number(newOmrData['set' + studentData.setno + 'Q' + i]) === -2 ||
            Number(newOmrData['set' + studentData.setno + 'Q' + i]) === -3 ||
            Number(newOmrData['set' + studentData.setno + 'Q' + i]) === -5
          ) {
            studentData.marks += newOmrData.mpq;
          }
        }
      }
    }
    return studentData.marks;
  };

  const handleSave = async () => {
    if (
      !newOmrData.mpq ||
      (newOmrData.isNegative && !newOmrData.negativeMark) ||
      isNaN(Number(newOmrData.mpq)) ||
      (newOmrData.isNegative && isNaN(Number(newOmrData.negativeMark)))
    ) {
      Alert.alert('Input Error', 'Please Input Carefully!');
      return;
    } else {
      newOmrData.mpq = Number(newOmrData.mpq);
      newOmrData.negativeMark = Number(newOmrData.negativeMark);
    }

    try {
      const existingHistory = await AsyncStorage.getItem('pdfHistory');
      const pdfHistory = JSON.parse(existingHistory);
      for (let i = 1; i <= newOmrData.setCount; i++) {
        for (let j = 1; j <= newOmrData.questionsCount; j++) {
          newOmrData['set' + i + 'Q' + j] =
            newOmrData['set' + i + 'Q' + j] < 0
              ? (-newOmrData.wqCase).toString()
              : newOmrData['set' + i + 'Q' + j];
        }
      }
      pdfHistory[index].formData = {
        ...pdfHistory[index].formData,
        ...newOmrData,
      };
      for (let i = 0; i < students.length; i++) {
        pdfHistory[index].students[i].marks = calculateMarks(students[i]);
      }
      await AsyncStorage.setItem('pdfHistory', JSON.stringify(pdfHistory));
      navigation.navigate('OmrEvaluation', {
        formData: newOmrData,
        localFilePath,
        index,
        students,
        reports,
      });
    } catch (error) {
      console.log('Error saving to local storage:', error);
    }
  };

  return (
    <View style={{flex: 1}}>
      <ExamMarkingForm
        mpq={newOmrData.mpq}
        isNegative={newOmrData.isNegative}
        negativeMark={newOmrData.negativeMark}
        wqCase={newOmrData.wqCase}
        handleInputChange={handleInputChange}
        handleSave={handleSave}
        students={students}
      />
    </View>
  );
};

export default ExamMarking;
