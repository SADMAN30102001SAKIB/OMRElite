import React, {useState} from 'react';
import {
  ScrollView,
  View,
  Text,
  TouchableOpacity,
  TextInput,
} from 'react-native';

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
    <View className="flex-1 bg-[#0a0a0f] px-5 py-6">
      {/* Header */}
      <View className="mb-6">
        <Text className="text-white text-2xl font-bold mb-1">Exam History</Text>
        <View className="w-12 h-1 bg-primary rounded-full mb-2" />
        <Text className="text-white/40 text-sm">
          Total Exams: {filteredHistoryItems.length}
        </Text>
      </View>

      {/* Search Bar */}
      <View className="mb-5">
        <TextInput
          placeholder="Search by exam name..."
          placeholderTextColor="#666"
          onChangeText={val => setSearchBy(val)}
          className="bg-white/5 text-white rounded-xl border border-white/20 px-4 py-3"
        />
      </View>

      {/* History List */}
      <ScrollView showsVerticalScrollIndicator={false}>
        {filteredHistoryItems.length === 0 ? (
          <View className="items-center justify-center py-20">
            <Text className="text-white/40 text-lg mb-2">📝</Text>
            <Text className="text-white/40 text-base">No exams found</Text>
          </View>
        ) : (
          reversedItems.map((item, index) => {
            const originalIndex = historyItems.length - 1 - index;
            return (
              (item.formData.pName
                .toLowerCase()
                .includes(searchBy.toLowerCase()) ||
                searchBy === '') && (
                <View key={originalIndex}>
                  {pathToDate(item.localFilePath) && (
                    <Text
                      className={`text-primary text-sm font-bold mb-3 ${
                        index ? 'mt-6' : ''
                      }`}>
                      📅 {prev}
                    </Text>
                  )}
                  <View className="flex-row items-stretch mb-3">
                    <TouchableOpacity
                      onPress={() => {
                        navigation.navigate('OmrEvaluation', {
                          formData: item.formData,
                          localFilePath: item.localFilePath,
                          index: originalIndex,
                          students: item.students,
                        });
                      }}
                      activeOpacity={0.7}
                      className="flex-1 bg-white/5 border-2 border-primary/40 rounded-xl px-4 py-3 mr-2">
                      <Text
                        className="text-white text-base font-medium"
                        numberOfLines={1}
                        ellipsizeMode="tail">
                        {item.formData.pName}
                      </Text>
                      <Text className="text-white/40 text-xs mt-1">
                        {item.formData.iName}
                      </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      onPress={() => deleteHistoryItem(originalIndex)}
                      activeOpacity={0.7}
                      className="bg-red-500/20 border-2 border-red-500 px-4 rounded-xl items-center justify-center">
                      <Text className="text-red-500 text-lg">🗑️</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              )
            );
          })
        )}
      </ScrollView>
    </View>
  );
};

export default ExamHistoryList;
