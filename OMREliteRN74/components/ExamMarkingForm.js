import React from 'react';
import {
  View,
  TextInput,
  Text,
  Switch,
  TouchableOpacity,
  Alert,
} from 'react-native';
import {Picker} from '@react-native-picker/picker';

const ExamMarkingForm = ({
  mpq,
  isNegative,
  negativeMark,
  wqCase,
  handleInputChange,
  handleSave,
  students,
}) => {
  return (
    <View className="flex-1 bg-[#111] p-[5%] justify-between">
      <View className="bg-[#181818] p-[5%] rounded-xl border-2 border-white border-solid my-[5%]">
        <View>
          <Text
            className={`text-base ${mpq ? 'text-white' : 'text-[#ff5500]'}`}>
            Marks Per Question:
          </Text>
          <TextInput
            placeholder="ex: 1"
            placeholderTextColor="#999"
            keyboardType="numeric"
            onChangeText={text => handleInputChange('mpq', text)}
            className="text-white border-gray-500 rounded-xl border-2 mb-[2%] pl-[5%]"
            value={!isNaN(Number(mpq)) ? mpq.toString() : ''}
          />
        </View>

        <View className="mt-[15%]">
          <Text className="text-white text-base">Select No-Ans Mark:</Text>
          <Picker
            selectedValue={wqCase}
            onValueChange={(itemValue, itemIndex) =>
              handleInputChange('wqCase', itemValue)
            }
            style={{color: '#fff'}}>
            <Picker.Item label="filled -> (0) | blank -> (0)" value="1" />
            <Picker.Item
              label={`filled -> (${
                isNaN(Number(mpq)) ? 'N/A' : '+' + mpq
              }) | blank -> (${isNaN(Number(mpq)) ? 'N/A' : '+' + mpq})`}
              value="2"
            />
            <Picker.Item
              label={`filled -> (0) | blank -> (${
                isNaN(Number(mpq)) ? 'N/A' : '+' + mpq
              })`}
              value="3"
            />
            {isNegative && (
              <Picker.Item
                label={`filled -> (${
                  isNaN(Number(negativeMark)) ? 'N/A' : negativeMark
                }) | blank -> (0)`}
                value="4"
              />
            )}
            {isNegative && (
              <Picker.Item
                label={`filled -> (${
                  isNaN(Number(negativeMark)) ? 'N/A' : negativeMark
                }) | blank -> (${isNaN(Number(mpq)) ? 'N/A' : '+' + mpq})`}
                value="5"
              />
            )}
          </Picker>
        </View>

        <View className="flex-row mt-[10%]">
          <Text className="text-white text-base">Allow Negative Mark?</Text>
          <Switch
            value={isNegative}
            onValueChange={value => {
              handleInputChange('isNegative', value);
              handleInputChange('wqCase', 1);
            }}
            className="w-[14%] ml-[5%]"
          />
        </View>

        {isNegative ? (
          <View className="mb-[4.5%] mt-[15%]">
            <Text
              className={`text-base ${
                !isNaN(Number(negativeMark)) ? 'text-white' : 'text-[#ff5500]'
              }`}>
              Negative Mark Per Mistake:
            </Text>
            <TextInput
              placeholder="ex: 0.25"
              placeholderTextColor="#999"
              keyboardType="numeric"
              onChangeText={text => handleInputChange('negativeMark', text)}
              className="text-white border-gray-500 rounded-xl border-2 mb-[2%] pl-[5%]"
              value={
                !isNaN(Number(negativeMark)) ? negativeMark.toString() : ''
              }
            />
          </View>
        ) : null}
      </View>

      <View className="w-full flex items-center">
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

export default ExamMarkingForm;
