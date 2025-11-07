import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import Home from '../screens/Home';
import OmrGeneration from '../screens/OmrGeneration';
import ExamHistory from '../screens/ExamHistory';
import OmrEvaluation from '../screens/OmrEvaluation';
import ExamMarking from '../screens/ExamMarking';
import AnswerSheet from '../screens/AnswerSheet';
import StudentHistory from '../screens/StudentHistory';
import StudentEvaluation from '../screens/StudentEvaluation';
import StudentInformation from '../screens/StudentInformation';
import Analysis from '../screens/Analysis';
import ReportGeneration from '../screens/ReportGeneration';
import ReportHistory from '../screens/ReportHistory';

const Stack = createNativeStackNavigator();

function AppNavigator() {
  return (
    <Stack.Navigator screenOptions={{headerShown: false}}>
      <Stack.Screen name="Home" component={Home} />
      <Stack.Screen name="OmrGeneration" component={OmrGeneration} />
      <Stack.Screen name="ExamHistory" component={ExamHistory} />
      <Stack.Screen name="OmrEvaluation" component={OmrEvaluation} />
      <Stack.Screen name="ExamMarking" component={ExamMarking} />
      <Stack.Screen name="AnswerSheet" component={AnswerSheet} />
      <Stack.Screen name="StudentHistory" component={StudentHistory} />
      <Stack.Screen name="StudentEvaluation" component={StudentEvaluation} />
      <Stack.Screen name="StudentInformation" component={StudentInformation} />
      <Stack.Screen name="Analysis" component={Analysis} />
      <Stack.Screen name="ReportGeneration" component={ReportGeneration} />
      <Stack.Screen name="ReportHistory" component={ReportHistory} />
    </Stack.Navigator>
  );
}

export default AppNavigator;
