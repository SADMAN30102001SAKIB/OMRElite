import React from 'react';
import {View, TouchableOpacity, Text} from 'react-native';
import styles from '../componentStyles/CustomCheckBoxStyle';

const CustomCheckBox = ({options, selectedValue, onValueChange}) => {
  return (
    <View style={styles.radioGroup}>
      {options.map((option, idx) => (
        <TouchableOpacity
          key={idx}
          style={styles.radioButton}
          onPress={() => onValueChange(option.value)}>
          <View
            style={[
              styles.outerCircle,
              !selectedValue.includes('-') &&
                selectedValue.includes(option.value) &&
                styles.selectedOuterCircle,
            ]}>
            <Text style={styles.label}>{option.label}</Text>
          </View>
        </TouchableOpacity>
      ))}
    </View>
  );
};

export default CustomCheckBox;
