import React, {useState} from 'react';
import {
  ScrollView,
  View,
  Text,
  TouchableOpacity,
  TextInput,
} from 'react-native';
import styles from '../componentStyles/ExamListStyle';

const ExamHistoryList = ({historyItems, deleteHistoryItem, navigation}) => {
  const [searchBy, setSearchBy] = useState('');
  let prev = '';
  const reversedItems = [...historyItems].reverse();

  const pathToDate = fileName => {
    const lastIndex = fileName.lastIndexOf('/');

    const pathBeforeLastSlash = fileName.substring(0, lastIndex);

    const secondLastUnderscoreIndex = pathBeforeLastSlash.lastIndexOf('_');

    const numberPart = pathBeforeLastSlash.substring(
      secondLastUnderscoreIndex + 1,
      fileName.length + 1,
    );

    const day = new Date(Number(numberPart)).getDate();
    const month = new Date(Number(numberPart)).getMonth() + 1;
    const year = new Date(Number(numberPart)).getFullYear();
    let formattedDate;

    if (
      prev ===
      (formattedDate = `${day.toString().padStart(2, '0')}/${month
        .toString()
        .padStart(2, '0')}/${year}`)
    ) {
      return '';
    }

    // eslint-disable-next-line no-unused-vars
    prev = formattedDate = `${day.toString().padStart(2, '0')}/${month
      .toString()
      .padStart(2, '0')}/${year}`;

    return prev;
  };

  const filteredHistoryItems = historyItems.filter(item => {
    if (
      item.formData.pName.toLowerCase().includes(searchBy.toLowerCase()) ||
      searchBy === ''
    ) {
      return true;
    } else {
      return false;
    }
  });

  return (
    <View style={styles.container}>
      <TextInput
        placeholder="Search By Exam Name"
        onChangeText={val => {
          setSearchBy(val);
        }}
        style={styles.input}
      />
      <Text
        style={{...styles.historyText, marginVertical: '5%', color: '#ccc'}}>
        History (Total Exams: {filteredHistoryItems.length}):
      </Text>
      <ScrollView>
        {reversedItems.map((item, index) => {
          const originalIndex = historyItems.length - 1 - index;
          return (
            (item.formData.pName
              .toLowerCase()
              .includes(searchBy.toLowerCase()) ||
              searchBy === '') && (
              <View key={originalIndex}>
                {pathToDate(item.localFilePath) && (
                  <Text
                    style={
                      index
                        ? {
                            fontSize: 16,
                            fontWeight: 'bold',
                            marginTop: '5%',
                          }
                        : {fontSize: 16, fontWeight: 'bold'}
                    }>
                    {prev}
                  </Text>
                )}
                <View style={styles.historyItem}>
                  <TouchableOpacity
                    onPress={() => {
                      navigation.navigate('OmrEvaluation', {
                        formData: item.formData,
                        localFilePath: item.localFilePath,
                        index: originalIndex,
                        students: item.students,
                      });
                    }}
                    style={{
                      ...styles.historyContent,
                      backgroundColor:
                        originalIndex % 2 ? '#00ff5f' : '#007bff',
                    }}>
                    <Text
                      style={{
                        ...styles.historyText,
                        color: originalIndex % 2 ? 'black' : 'white',
                      }}
                      numberOfLines={1}
                      ellipsizeMode="tail">
                      {item.formData.pName}
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => deleteHistoryItem(originalIndex)}
                    style={styles.deleteButton}>
                    <Text style={styles.deleteButtonText}>🗑</Text>
                  </TouchableOpacity>
                </View>
              </View>
            )
          );
        })}
      </ScrollView>
    </View>
  );
};

export default ExamHistoryList;
