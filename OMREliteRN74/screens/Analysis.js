import React from 'react';
import {ScrollView, View} from 'react-native';
import AnalysisInfo from '../components/AnalysisInfo';
import styles from '../screenStyles/OmrEvaluationStyle';

const Analysis = ({route, navigation}) => {
  const {formData, students} = route.params;

  return (
    <ScrollView
      contentContainerStyle={{
        flexGrow: 1,
      }}>
      <View style={styles.container}>
        <AnalysisInfo omrData={formData} students={students} />
      </View>
    </ScrollView>
  );
};

export default Analysis;
