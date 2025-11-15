import React from 'react';
import {View, Text, Switch, TouchableOpacity, TextInput} from 'react-native';
import {Picker} from '@react-native-picker/picker';
import CustomCheckBox from './CustomCheckBox';

const ReportGenerationForm = ({
  omrData,
  formData,
  handleInputChange,
  handleSubmit,
  handleSubmitCSV,
}) => {
  return (
    <View className="flex-1 bg-[#111] p-[3%] pt-[20%]">
      <View className="p-[5%] border-white border-2 rounded-xl">
        <View className="mb-[4.5%] flex-row">
          <Text className="text-white text-base">
            Show Student's Performance?
          </Text>
          <Switch
            value={formData.isLeftAddionalData}
            onValueChange={value => {
              handleInputChange('isLeftAddionalData', value);
            }}
            className="w-[14%] ml-[5%]"
            trackColor={{false: '#767577', true: '#aaffaa'}}
            thumbColor={formData.isLeftAddionalData ? '#00aa5f' : '#f4f3f4'}
          />
        </View>
        <Text className="text-white text-base mt-[5%] mb-[2%]">
          Report Table Info 🔽:
        </Text>
        <View className="mb-[4.5%] flex-row">
          <Text className="text-white text-base">Show Serial Column?</Text>
          <Switch
            value={formData.isSerial}
            onValueChange={value => handleInputChange('isSerial', value)}
            className="w-[14%] ml-[5%]"
            trackColor={{false: '#767577', true: '#aaffaa'}}
            thumbColor={formData.isSerial ? '#00aa5f' : '#f4f3f4'}
          />
        </View>
        {omrData.isRoll && (
          <View className="mb-[4.5%] flex-row">
            <Text className="text-white text-base">Show ID Column?</Text>
            <Switch
              value={formData.isID}
              onValueChange={value => {
                handleInputChange('sortBy', 'set');
                handleInputChange('isID', value);
              }}
              className="w-[14%] ml-[5%]"
              trackColor={{false: '#767577', true: '#aaffaa'}}
              thumbColor={formData.isID ? '#00aa5f' : '#f4f3f4'}
            />
          </View>
        )}
        {(omrData.isName || !omrData.isRoll) && (
          <View className="mb-[4.5%] flex-row">
            <Text className="text-white text-base">Show Name Column?</Text>
            <Switch
              value={formData.isName}
              onValueChange={value => {
                handleInputChange('sortBy', 'set');
                handleInputChange('isName', value);
              }}
              className="w-[14%] ml-[5%]"
              trackColor={{false: '#767577', true: '#aaffaa'}}
              thumbColor={formData.isName ? '#00aa5f' : '#f4f3f4'}
            />
          </View>
        )}
        {omrData.setCount > 1 && (
          <View className="mb-[4.5%] flex-row">
            <Text className="text-white text-base">Show Set Column?</Text>
            <Switch
              value={formData.isSet}
              onValueChange={value => {
                handleInputChange('sortBy', 'set');
                handleInputChange('isSet', value);
              }}
              className="w-[14%] ml-[5%]"
              trackColor={{false: '#767577', true: '#aaffaa'}}
              thumbColor={formData.isSet ? '#00aa5f' : '#f4f3f4'}
            />
          </View>
        )}
        <View className="my-[5%]">
          <Text className="text-white text-base">Sort By:</Text>
          <Picker
            selectedValue={formData.sortBy}
            onValueChange={(itemValue, itemIndex) =>
              handleInputChange('sortBy', itemValue)
            }
            style={{color: '#fff'}}>
            <Picker.Item
              label={formData.isSet ? 'Question Set' : 'Default'}
              value="set"
            />
            <Picker.Item label="Obtained Score" value="marks" />
            {formData.isID && (
              <Picker.Item label="ID Number" value="roll_number" />
            )}
            {formData.isName && (
              <Picker.Item label="Student Name" value="name" />
            )}
          </Picker>
        </View>

        {omrData.setCount > 1 && (
          <View className="my-[6%] flex-row items-center justify-around">
            <Text className="text-white text-base">SET: </Text>
            <CustomCheckBox
              options={['A', 'B', 'C', 'D']
                .slice(0, omrData.setCount)
                .map((item, index) => ({
                  label: item,
                  value: item,
                }))}
              selectedValue={formData.totalSet}
              onValueChange={newValue => {
                if (
                  formData.totalSet !== newValue &&
                  formData.totalSet.includes(newValue)
                ) {
                  newValue = formData.totalSet.replace(newValue, '');
                } else if (formData.totalSet !== newValue) {
                  newValue = newValue + formData.totalSet;
                }
                handleInputChange('totalSet', newValue);
              }}
            />
          </View>
        )}
        <View className="w-full flex items-center mt-[5%]">
          <TouchableOpacity
            className="rounded-[50px] px-[10%] py-[5%] bg-secondary justify-center items-center mt-[1%]"
            onPress={handleSubmit}>
            <Text className="text-white text-base font-bold">
              Generate Report PDF
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      <View className="p-[5%] my-[10%] border-white border-2 rounded-xl">
        <View>
          <Text
            className={`text-base ${
              /^[a-zA-Z0-9]+(\.[a-zA-Z0-9]+)*@gmail\.com$/.test(
                formData.rEmail.trim(),
              )
                ? 'text-white'
                : 'text-[#ff5500]'
            }`}>
            Recipient Email:
          </Text>
          <TextInput
            placeholder="ex: sadman30102001sakib@gamil.com"
            placeholderTextColor="#999"
            keyboardType="email-address"
            onChangeText={text => handleInputChange('rEmail', text)}
            className="text-white border-gray-500 rounded-xl border-2 mb-[2%] pl-[5%]"
          />
        </View>
        <View className="w-full flex items-center mt-[5%]">
          <TouchableOpacity
            className="rounded-[50px] px-[10%] py-[5%] bg-secondary justify-center items-center mt-[1%]"
            onPress={handleSubmitCSV}>
            <Text className="text-white text-base font-bold">Email CSV</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default ReportGenerationForm;
