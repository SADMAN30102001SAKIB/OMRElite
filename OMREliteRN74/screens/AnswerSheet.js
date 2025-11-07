import React, {useState} from 'react';
import {View} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import AnswerSheetForm from '../components/AnswerSheetForm';

const AnswerSheet = ({route, navigation}) => {
  const {omrData, localFilePath, index, students, reports} = route.params;
  const [newOmrData, setNewOmrData] = useState(omrData);

  const handleInputChange = (name, value) => {
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
    try {
      const existingHistory = await AsyncStorage.getItem('pdfHistory');
      const pdfHistory = JSON.parse(existingHistory);
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
    <View
      style={{
        flex: 1,
      }}>
      <AnswerSheetForm
        newOmrData={newOmrData}
        handleInputChange={handleInputChange}
        handleSave={handleSave}
        students={students}
      />
    </View>
  );
};

export default AnswerSheet;
