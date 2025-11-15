import React, {useState} from 'react';
import {
  ScrollView,
  View,
  Text,
  TouchableOpacity,
  TextInput,
} from 'react-native';
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
      (set === 0 || item.setno === set) &&
      ((item.idno !== -1
        ? item.idno.toLowerCase().includes(searchBy.toLowerCase())
        : item.name.toLowerCase().includes(searchBy.toLowerCase())) ||
        searchBy === '')
    ) {
      return true;
    } else {
      return false;
    }
  });

  return (
    <View className="flex-1 bg-[#111] p-[5%]">
      <TextInput
        placeholder={`Search By Student ${formData.isRoll ? 'ID' : 'Name'}`}
        placeholderTextColor="#999"
        onChangeText={val => {
          setSearchBy(val);
        }}
        className="text-white border-gray-500 rounded-xl border-2 mb-[3%] p-[3%] text-base"
      />
      {formData.setCount > 1 && (
        <View className="flex-row items-center mt-[5%] mb-[3%]">
          <Text className="text-white text-base font-bold mb-[1%]">SET: </Text>
          <CustomCheckBox
            options={['All', 'A', 'B', 'C', 'D']
              .slice(0, formData.setCount + 1)
              .map((item, idx) => ({
                label: item,
                value: idx.toString(),
              }))}
            selectedValue={set.toString()}
            onValueChange={newValue => {
              setSet(parseInt(newValue, 10));
            }}
          />
        </View>
      )}
      <Text className="text-[#ccc] text-base my-[5%]">
        History (Total Students: {filteredStudentItems.length}):
      </Text>
      <ScrollView>
        {studentItems.map(
          (item, idx) =>
            (set === 0 || item.setno === set) &&
            ((item.idno !== -1
              ? item.idno.toLowerCase().includes(searchBy.toLowerCase())
              : item.name.toLowerCase().includes(searchBy.toLowerCase())) ||
              searchBy === '') && (
              <View
                key={idx}
                className="flex-row justify-between items-center my-[2%]">
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
                  className={`flex-1 p-[3%] rounded-lg mr-[2%] ${
                    idx % 2 ? 'bg-primary' : 'bg-secondary'
                  }`}>
                  <Text
                    className={
                      idx % 2 ? 'text-black text-base' : 'text-white text-base'
                    }
                    numberOfLines={1}
                    ellipsizeMode="tail">
                    {item.idno !== -1
                      ? 'ID: ' + item.idno
                      : 'Name: ' + item.name}{' '}
                    | Score: {item.marks}
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => deleteStudentItem(idx)}
                  className="bg-[#ff5500] px-[4%] py-[2%] rounded-lg">
                  <Text className="text-white text-lg">🗑</Text>
                </TouchableOpacity>
              </View>
            ),
        )}
      </ScrollView>
    </View>
  );
};

export default StudentHistoryList;
