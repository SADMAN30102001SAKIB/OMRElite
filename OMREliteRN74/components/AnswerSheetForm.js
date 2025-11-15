import React, {useState} from 'react';
import {View, Text, TouchableOpacity, Alert, FlatList} from 'react-native';
import CustomCheckBox from './CustomCheckBox';

const QuestionItem = React.memo(
  ({index, set, handleInputChange, newOmrData}) => {
    const questionNumber = index + 1;
    const questionKey = `set${set}Q${questionNumber}`;
    const value = newOmrData[questionKey];

    return (
      <View className="mb-[4.5%] flex-row items-center justify-between">
        <Text
          className={`text-base p-[1%] mb-[1.5%] ${
            !value.includes('-')
              ? value.length > 1
                ? 'text-[#ffff00]'
                : 'text-success'
              : 'text-[#ff5500]'
          }`}>
          {questionNumber < 10 ? `Q0${questionNumber}:` : `Q${questionNumber}:`}
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
            if (!value.includes('-') && value === newValue) {
              newValue = (-newOmrData.wqCase).toString();
            } else if (!value.includes('-') && value.includes(newValue)) {
              newValue = value.replace(newValue, '');
            } else if (!value.includes('-')) {
              newValue = newValue + value;
            }
            handleInputChange(questionKey, newValue);
          }}
        />
      </View>
    );
  },
);

const AnswerSheetForm = ({
  newOmrData,
  handleInputChange,
  handleSave,
  students,
}) => {
  const [set, setSet] = useState(1);

  const questionsToShow = new Array(newOmrData.questionsCount)
    .fill(null)
    .map((_, index) => index);

  return (
    <View className="flex-1 bg-[#111] p-[5%]">
      {newOmrData.setCount > 1 && (
        <View className="my-[6%] flex-row items-center justify-around">
          <Text className="text-white text-base">SET: </Text>
          <CustomCheckBox
            options={['A', 'B', 'C', 'D']
              .slice(0, newOmrData.setCount)
              .map((item, index) => ({
                label: item,
                value: (index + 1).toString(),
              }))}
            selectedValue={set.toString()}
            onValueChange={newValue => {
              setSet(parseInt(newValue, 10));
            }}
          />
        </View>
      )}

      <FlatList
        data={questionsToShow}
        renderItem={({item: index}) => (
          <QuestionItem
            key={index}
            index={index}
            set={set}
            handleInputChange={handleInputChange}
            newOmrData={newOmrData}
          />
        )}
        keyExtractor={item => item.toString()}
        className={`p-[2%] bg-[#181818] rounded-xl border-2 border-white border-solid ${
          newOmrData.setCount === 1 ? 'mt-[25%]' : ''
        }`}
      />

      <View className="w-full flex items-center mt-[10%]">
        <TouchableOpacity
          className="rounded-[50px] px-[10%] py-[5%] bg-primary justify-center items-center mt-[1%]"
          onPress={() => {
            students.length
              ? Alert.alert(
                  'Are you sure?',
                  'Saving Will Re-Calculate All Evaluated Student\'s Score & Also You Should Update All Student\'s "Result PDF" by Re-Generating, If You Change Anything here!',
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
                )
              : handleSave();
          }}>
          <Text className="text-black text-base font-bold">Save</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default AnswerSheetForm;
