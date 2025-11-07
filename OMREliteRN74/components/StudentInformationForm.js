import React, {useState, useCallback} from 'react';
import {View, Text, TouchableOpacity, TextInput, Alert} from 'react-native';
import CustomCheckBox from './CustomCheckBox';
import styles from '../componentStyles/FormStyle';

const QuestionItem = React.memo(
  ({index, handleInputChange, studentData, formData}) => {
    const questionNumber = index + 1;
    const questionKey = `Q${questionNumber}`;
    const value = studentData[questionKey];
    const ansValue = formData['set' + studentData.setno + questionKey];
    const compareStrings = (mainString, subString) => {
      for (let i = 0; i < subString.length; i++) {
        if (
          !mainString ||
          mainString.includes('-') ||
          !mainString.includes(subString[i])
        ) {
          return false;
        }
      }
      return true;
    };

    return (
      <View
        style={{
          ...styles.fieldContainer,
          marginBottom: '1%',
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}>
        <Text
          style={
            value !== '0'
              ? compareStrings(ansValue, value)
                ? {
                    ...styles.label,
                    padding: '1%',
                    marginBottom: '1.5%',
                    color: '#55ff00',
                  }
                : {
                    ...styles.label,
                    padding: '1%',
                    marginBottom: '1.5%',
                    color: '#ff5500',
                  }
              : ansValue && ansValue.includes('-')
              ? {
                  ...styles.label,
                  padding: '1%',
                  marginBottom: '1.5%',
                  color: '#55ff00',
                }
              : {
                  ...styles.label,
                  padding: '1%',
                  marginBottom: '1.5%',
                }
          }>
          {questionNumber < 10 ? `A0${questionNumber}:` : `A${questionNumber}:`}
        </Text>
        <CustomCheckBox
          options={[
            {label: 'A', value: '1'},
            {label: 'B', value: '2'},
            {label: 'C', value: '3'},
            {label: 'D', value: '4'},
          ]}
          selectedValue={value}
          onValueChange={newValue => {
            if (value !== '0' && value === newValue) {
              newValue = '0';
            } else if (value !== '0' && value.includes(newValue)) {
              newValue = value.replace(newValue, '');
            } else if (value !== '0') {
              newValue = newValue + value;
            }
            handleInputChange(questionKey, newValue);
          }}
        />
      </View>
    );
  },
);

const StudentInformationForm = ({
  formData,
  studentData,
  handleInputChange,
  handleSave,
}) => {
  const [set, setSet] = useState(studentData.setno);
  const [currentPage, setCurrentPage] = useState(0);

  const questionsPerPage = 10;
  const totalPages = Math.ceil(formData.questionsCount / questionsPerPage);

  const list = ['A', 'B', 'C', 'D'].slice(0, formData.setCount);

  const handleNext = useCallback(() => {
    setCurrentPage(current =>
      current < totalPages - 1 ? current + 1 : current,
    );
  }, [totalPages]);

  const handlePrev = useCallback(() => {
    setCurrentPage(current => (current > 0 ? current - 1 : current));
  }, []);

  const handleHardNext = useCallback(() => {
    setCurrentPage(totalPages - 1);
  }, [totalPages]);

  const handleHardPrev = useCallback(() => {
    setCurrentPage(0);
  }, []);

  const handleSetChange = useCallback(newValue => {
    handleInputChange('setno', newValue);
    setSet(parseInt(newValue, 10));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const startIndex = currentPage * questionsPerPage;
  const endIndex = startIndex + questionsPerPage;
  const questionsToShow = new Array(formData.questionsCount)
    .fill(null)
    .slice(startIndex, endIndex);

  return (
    <View style={styles.container}>
      <View style={{...styles.topContainer, marginVertical: '5%'}}>
        {formData.isRoll ? (
          <View>
            <Text
              style={
                studentData.idno &&
                studentData.idno.length === formData.rollDigit
                  ? {...styles.label}
                  : {...styles.label, color: '#ff5500'}
              }>
              Student ID of {formData.rollDigit} Digit:
            </Text>
            <TextInput
              placeholder={studentData.idno ? 'Edit' : 'Enter Student ID'}
              keyboardType="numeric"
              onChangeText={text => handleInputChange('idno', text)}
              style={styles.input}
              value={studentData.idno}
            />
          </View>
        ) : null}

        {(formData.isName || !formData.isRoll) && (
          <View
            style={{
              marginBottom: '6%',
            }}>
            <Text
              style={
                studentData.name || formData.isRoll
                  ? {...styles.label}
                  : {...styles.label, color: '#ff5500'}
              }>
              Student Name:
            </Text>
            <TextInput
              placeholder="Edit"
              onChangeText={text => handleInputChange('name', text)}
              style={styles.input}
              value={studentData.name ? studentData.name : ''}
            />
          </View>
        )}

        <View
          style={{
            ...styles.fieldContainer,
          }}>
          {list.length > 1 && (
            <View
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-around',
              }}>
              <Text style={{...styles.label, marginBottom: '1%'}}>
                Marked Set By Examinee 🔽:
              </Text>
              <CustomCheckBox
                options={list.map((item, index) => ({
                  label: item,
                  value: (index + 1).toString(),
                }))}
                selectedValue={set.toString()}
                onValueChange={handleSetChange}
              />
            </View>
          )}
        </View>
      </View>

      <View style={{...styles.button, marginBottom: '5%'}}>
        <TouchableOpacity
          style={{
            ...styles.submitButton,
            backgroundColor: '#00ff5f',
          }}
          onPress={() => {
            Alert.alert(
              'Are you sure?',
              'Check Everythig Before You Save!',
              [
                {
                  text: 'NO',
                  onPress: () => {},
                  style: 'cancel',
                },
                {
                  text: 'YES',
                  onPress: () => {
                    handleSave();
                  },
                },
              ],
              {cancelable: false},
            );
          }}>
          <Text style={{...styles.submitButtonText, color: 'black'}}>Save</Text>
        </TouchableOpacity>
      </View>

      <Text style={{marginBottom: '1%', color: 'white'}}>
        Marked Ans By Examinee ⏬:
      </Text>
      <View
        style={{
          ...styles.scroll,
          marginTop: formData.questionsCount > 10 ? '0%' : '5%',
        }}>
        {questionsToShow.map((_, index) => (
          <QuestionItem
            key={index}
            index={startIndex + index}
            handleInputChange={handleInputChange}
            studentData={studentData}
            formData={formData}
          />
        ))}
      </View>

      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-around',
        }}>
        {currentPage > 0 && (
          <View>
            <TouchableOpacity
              onPress={handleHardPrev}
              style={{paddingTop: '20%'}}>
              <Text
                style={{
                  ...styles.submitButtonText,
                  fontSize: 35,
                  transform: [{rotate: '180deg'}],
                }}>
                {'⇶'}
              </Text>
            </TouchableOpacity>
          </View>
        )}
        {currentPage > 0 && (
          <View>
            <TouchableOpacity onPress={handlePrev} style={{paddingTop: '20%'}}>
              <Text
                style={{
                  ...styles.submitButtonText,
                  fontSize: 35,
                  transform: [{rotate: '180deg'}],
                }}>
                {'➣'}
              </Text>
            </TouchableOpacity>
          </View>
        )}
        {currentPage < totalPages - 1 && (
          <View>
            <TouchableOpacity onPress={handleNext}>
              <Text
                style={{
                  ...styles.submitButtonText,
                  fontSize: 35,
                }}>
                {'➣'}
              </Text>
            </TouchableOpacity>
          </View>
        )}
        {currentPage < totalPages - 1 && (
          <View>
            <TouchableOpacity onPress={handleHardNext}>
              <Text
                style={{
                  ...styles.submitButtonText,
                  fontSize: 35,
                }}>
                {'⇶'}
              </Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </View>
  );
};

export default StudentInformationForm;
