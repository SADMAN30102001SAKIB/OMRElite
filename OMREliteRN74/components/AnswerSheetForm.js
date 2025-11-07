import React, {useState} from 'react';
import {View, Text, TouchableOpacity, Alert, FlatList} from 'react-native';
import CustomCheckBox from './CustomCheckBox';
import styles from '../componentStyles/FormStyle';

const QuestionItem = React.memo(
  ({index, set, handleInputChange, newOmrData}) => {
    const questionNumber = index + 1;
    const questionKey = `set${set}Q${questionNumber}`;
    const value = newOmrData[questionKey];

    return (
      <View
        style={{
          ...styles.fieldContainer,
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}>
        <Text
          style={
            !value.includes('-')
              ? value.length > 1
                ? {
                    ...styles.label,
                    padding: '1%',
                    marginBottom: '1.5%',
                    color: '#ffff00',
                  }
                : {
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
          }>
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
    <View style={styles.container}>
      {newOmrData.setCount > 1 && (
        <View style={styles.setContainer}>
          <Text style={styles.label}>SET: </Text>
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
        style={
          newOmrData.setCount === 1
            ? {...styles.scroll, marginTop: '25%'}
            : styles.scroll
        }
      />

      <View style={{...styles.button, marginTop: '10%'}}>
        <TouchableOpacity
          style={{
            ...styles.submitButton,
            backgroundColor: '#00ff5f',
          }}
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
          <Text style={{...styles.submitButtonText, color: 'black'}}>Save</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default AnswerSheetForm;
