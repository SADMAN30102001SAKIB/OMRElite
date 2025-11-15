import React, {useState, useCallback} from 'react';
import {View, Text, TouchableOpacity, TextInput, Alert} from 'react-native';
import CustomCheckBox from './CustomCheckBox';

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
      <View className="mb-[1%] flex-row items-center justify-between">
        <Text
          className={`p-[1%] mb-[1.5%] text-base ${
            value !== '0'
              ? compareStrings(ansValue, value)
                ? 'text-success'
                : 'text-[#ff5500]'
              : ansValue && ansValue.includes('-')
              ? 'text-success'
              : 'text-white'
          }`}>
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
    <View className="flex-1 bg-[#111] justify-between p-[5%]">
      <View className="bg-[#181818] p-[5%] rounded-xl border-2 border-white my-[5%]">
        {formData.isRoll ? (
          <View>
            <Text
              className={`text-base ${
                studentData.idno &&
                studentData.idno.length === formData.rollDigit
                  ? 'text-white'
                  : 'text-[#ff5500]'
              }`}>
              Student ID of {formData.rollDigit} Digit:
            </Text>
            <TextInput
              placeholder={studentData.idno ? 'Edit' : 'Enter Student ID'}
              placeholderTextColor="#999"
              keyboardType="numeric"
              onChangeText={text => handleInputChange('idno', text)}
              className="text-white border-gray-500 rounded-xl border-2 mb-[2%] pl-[5%]"
              value={studentData.idno}
            />
          </View>
        ) : null}

        {(formData.isName || !formData.isRoll) && (
          <View className="mb-[6%]">
            <Text
              className={`text-base ${
                studentData.name || formData.isRoll
                  ? 'text-white'
                  : 'text-[#ff5500]'
              }`}>
              Student Name:
            </Text>
            <TextInput
              placeholder="Edit"
              placeholderTextColor="#999"
              onChangeText={text => handleInputChange('name', text)}
              className="text-white border-gray-500 rounded-xl border-2 mb-[2%] pl-[5%]"
              value={studentData.name ? studentData.name : ''}
            />
          </View>
        )}

        <View>
          {list.length > 1 && (
            <View className="flex items-center justify-around">
              <Text className="text-white text-base mb-[1%]">
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

      <View className="w-full flex items-center mb-[5%]">
        <TouchableOpacity
          className="rounded-[50px] px-[10%] py-[5%] bg-primary justify-center items-center"
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
          <Text className="text-black text-base font-bold">Save</Text>
        </TouchableOpacity>
      </View>

      <Text className="mb-[1%] text-white">Marked Ans By Examinee ⏬:</Text>
      <View
        className={`${
          formData.questionsCount > 10 ? 'mt-0' : 'mt-[5%]'
        } max-h-[400px]`}>
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

      <View className="flex-row justify-around">
        {currentPage > 0 && (
          <View>
            <TouchableOpacity onPress={handleHardPrev} className="pt-[20%]">
              <Text className="text-white text-base font-bold text-[35px] rotate-180">
                {'⇶'}
              </Text>
            </TouchableOpacity>
          </View>
        )}
        {currentPage > 0 && (
          <View>
            <TouchableOpacity onPress={handlePrev} className="pt-[20%]">
              <Text className="text-white text-base font-bold text-[35px] rotate-180">
                {'➣'}
              </Text>
            </TouchableOpacity>
          </View>
        )}
        {currentPage < totalPages - 1 && (
          <View>
            <TouchableOpacity onPress={handleNext}>
              <Text className="text-white text-base font-bold text-[35px]">
                {'➣'}
              </Text>
            </TouchableOpacity>
          </View>
        )}
        {currentPage < totalPages - 1 && (
          <View>
            <TouchableOpacity onPress={handleHardNext}>
              <Text className="text-white text-base font-bold text-[35px]">
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
