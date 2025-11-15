import React from 'react';
import {View, TouchableOpacity, Text} from 'react-native';

const CustomCheckBox = ({options, selectedValue, onValueChange}) => {
  return (
    <View className="flex-row">
      {options.map((option, idx) => (
        <TouchableOpacity
          key={idx}
          className="mr-[3%]"
          onPress={() => onValueChange(option.value)}>
          <View
            className={
              !selectedValue.includes('-') &&
              selectedValue.includes(option.value)
                ? 'border-2 border-primary bg-primary rounded-lg px-[10%] py-[5%]'
                : 'border-2 border-white rounded-lg px-[10%] py-[5%]'
            }>
            <Text className="text-white text-center text-base font-bold">
              {option.label}
            </Text>
          </View>
        </TouchableOpacity>
      ))}
    </View>
  );
};

export default CustomCheckBox;
