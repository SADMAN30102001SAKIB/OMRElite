import React, {useState} from 'react';
import {
  ScrollView,
  View,
  Text,
  TouchableOpacity,
  TextInput,
} from 'react-native';
import styles from '../componentStyles/ExamListStyle';
import CustomCheckBox from './CustomCheckBox';

const StudentHistoryList = ({
  formData,
  localFilePath,
  index,
  studentItems,
  deleteStudentItem,
  navigation,
}) => {
  const [set, setSet] = useState(0);
  const [searchBy, setSearchBy] = useState('');

  const filteredStudentItems = studentItems.filter(item => {
    if (
      (set == 0 || item.setno == set) &&
      ((item.idno != -1
        ? item.idno.toLowerCase().includes(searchBy.toLowerCase())
        : item.name.toLowerCase().includes(searchBy.toLowerCase())) ||
        searchBy == '')
    ) {
      return true;
    } else {
      return false;
    }
  });

  return (
    <View style={styles.container}>
      <TextInput
        placeholder={`Search By Student ${formData.isRoll ? 'ID' : 'Name'}`}
        onChangeText={val => {
          setSearchBy(val);
        }}
        style={styles.input}
      />
      {formData.setCount > 1 && (
        <View style={styles.setContainer}>
          <Text style={styles.label}>SET: </Text>
          <CustomCheckBox
            options={['All', 'A', 'B', 'C', 'D']
              .slice(0, formData.setCount + 1)
              .map((item, index) => ({
                label: item,
                value: index.toString(),
              }))}
            selectedValue={set.toString()}
            onValueChange={newValue => {
              setSet(parseInt(newValue, 10));
            }}
          />
        </View>
      )}
      <Text
        style={{...styles.historyText, marginVertical: '5%', color: '#ccc'}}>
        History (Total Students: {filteredStudentItems.length}):
      </Text>
      <ScrollView>
        {studentItems.map(
          (item, idx) =>
            (set == 0 || item.setno == set) &&
            ((item.idno != -1
              ? item.idno.toLowerCase().includes(searchBy.toLowerCase())
              : item.name.toLowerCase().includes(searchBy.toLowerCase())) ||
              searchBy == '') && (
              <View key={idx} style={styles.historyItem}>
                <TouchableOpacity
                  onPress={() => {
                    navigation.navigate('StudentEvaluation', {
                      formData,
                      localFilePath,
                      index,
                      student: item,
                      idx,
                    });
                  }}
                  style={{
                    ...styles.historyContent,
                    backgroundColor: idx % 2 ? '#00ff5f' : '#007bff',
                  }}>
                  <Text
                    style={{
                      ...styles.historyText,
                      color: idx % 2 ? 'black' : 'white',
                    }}
                    numberOfLines={1}
                    ellipsizeMode="tail">
                    {item.idno != -1
                      ? 'ID: ' + item.idno
                      : 'Name: ' + item.name}{' '}
                    | Score: {item.marks}
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => deleteStudentItem(idx)}
                  style={styles.deleteButton}>
                  <Text style={styles.deleteButtonText}>🗑</Text>
                </TouchableOpacity>
              </View>
            ),
        )}
      </ScrollView>
    </View>
  );
};

export default StudentHistoryList;
