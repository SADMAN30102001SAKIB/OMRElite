import React from 'react';
import {
  View,
  TouchableOpacity,
  Text,
  ToastAndroid,
  StatusBar,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {
  checkStoragePermissions,
  requestStoragePermissions,
} from '../utils/permissions';

const Home = ({navigation}) => {
  const handleCreatePress = async () => {
    try {
      const hasPermissions = await checkStoragePermissions();

      if (!hasPermissions) {
        const granted = await requestStoragePermissions();
        if (!granted) {
          ToastAndroid.show(
            'Storage permission is required to create OMR sheets',
            ToastAndroid.LONG,
          );
          return;
        }
      }

      navigation.navigate('OmrGeneration', {
        omrData: null,
        localPath: null,
        idx: null,
        students: [],
        reports: [],
      });
    } catch (err) {
      console.warn('Permission error:', err);
      ToastAndroid.show('Error checking permissions', ToastAndroid.SHORT);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-[#0a0a0f]">
      <StatusBar barStyle="light-content" backgroundColor="#0a0a0f" />

      {/* Top Header Bar - Absolute positioning */}
      <View className="absolute top-0 left-0 right-0 z-10 flex-row items-center justify-between py-4 px-8">
        <View className="w-10 h-10 rounded-full bg-white/10 items-center justify-center">
          <Text className="text-white text-lg">☰</Text>
        </View>
        <View className="flex-row items-center gap-x-3">
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={() =>
              ToastAndroid.show('Coming soon!', ToastAndroid.SHORT)
            }
            className="w-10 h-10 rounded-full bg-white/10 items-center justify-center">
            <Text className="text-white text-lg">⚙</Text>
          </TouchableOpacity>
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={() =>
              ToastAndroid.show('Coming soon!', ToastAndroid.SHORT)
            }
            className="w-10 h-10 rounded-full bg-primary/20 border border-primary/30 items-center justify-center">
            <Text className="text-primary text-sm font-bold">A</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Main Content - Centered */}
      <View className="flex-1 justify-center px-8 -mt-64">
        {/* Logo/Brand Section */}
        <View className="mb-8">
          <Text className="text-white text-5xl font-black tracking-tight mb-2">
            OMRElite
          </Text>
          <View className="w-16 h-1 bg-primary rounded-full mb-4" />
          <Text className="text-white/40 text-sm font-medium">
            Professional OMR Management
          </Text>
        </View>

        {/* Action Buttons */}
        <View className="gap-y-4">
          <TouchableOpacity
            onPress={handleCreatePress}
            activeOpacity={0.7}
            className="bg-primary rounded-2xl py-5 px-6">
            <View className="flex-row items-center justify-between">
              <View>
                <Text className="text-black text-lg font-bold mb-1">
                  Create New Exam
                </Text>
                <Text className="text-black/60 text-sm font-medium">
                  Design custom OMR sheets
                </Text>
              </View>
              <Text className="text-black text-2xl">→</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => navigation.navigate('ExamHistory')}
            activeOpacity={0.7}
            className="bg-white/10 border border-white/20 rounded-2xl py-5 px-6">
            <View className="flex-row items-center justify-between">
              <View>
                <Text className="text-white text-lg font-bold mb-1">
                  Exam History
                </Text>
                <Text className="text-white/60 text-sm font-medium">
                  View all exams & results
                </Text>
              </View>
              <Text className="text-white text-2xl">→</Text>
            </View>
          </TouchableOpacity>
        </View>
      </View>

      {/* Footer Info - Absolute positioning */}
      <View className="absolute bottom-8 left-8 right-8">
        <View className="flex-row items-center justify-between mb-4 px-4 py-3 bg-white/5 rounded-xl border border-white/10">
          <View className="items-center flex-1">
            <Text className="text-primary text-xl font-bold">∞</Text>
            <Text className="text-white/40 text-xs mt-1">Unlimited</Text>
          </View>
          <View className="w-px h-8 bg-white/10" />
          <View className="items-center flex-1">
            <Text className="text-success text-xl font-bold">⚡</Text>
            <Text className="text-white/40 text-xs mt-1">Fast</Text>
          </View>
          <View className="w-px h-8 bg-white/10" />
          <View className="items-center flex-1">
            <Text className="text-secondary text-xl font-bold">✓</Text>
            <Text className="text-white/40 text-xs mt-1">Accurate</Text>
          </View>
        </View>
        <Text className="text-white/20 text-xs text-center font-medium">
          Version 1.0.0
        </Text>
      </View>
    </SafeAreaView>
  );
};

export default Home;
