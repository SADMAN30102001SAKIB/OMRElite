import React from 'react';
import {ScrollView, View} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import AnalysisInfo from '../components/AnalysisInfo';

const Analysis = ({route, navigation}) => {
  const {formData, students} = route.params;

  return (
    <SafeAreaView className="flex-1 bg-[#111]">
      <ScrollView className="flex-grow">
        <View className="bg-[#111] h-full">
          <AnalysisInfo omrData={formData} students={students} />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Analysis;
