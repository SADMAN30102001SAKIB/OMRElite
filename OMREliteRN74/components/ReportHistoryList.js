import React from 'react';
import {
  ScrollView,
  View,
  Text,
  TouchableOpacity,
  Alert,
  ToastAndroid,
} from 'react-native';
import FileViewer from 'react-native-file-viewer';
import RNFS from 'react-native-fs';
import {
  checkStoragePermissions,
  requestStoragePermissions,
} from '../utils/permissions';

const ReportHistoryList = ({
  formData,
  localFilePath,
  index,
  students,
  reportItems,
  deleteReportItem,
  handleSubmit,
  navigation,
}) => {
  return (
    <View className="flex-1 bg-[#111] p-[5%]">
      <View className="mt-[10%]">
        <TouchableOpacity
          className="border border-dashed border-white rounded-2xl bg-primary p-[4%]"
          onPress={() => {
            navigation.navigate('ReportGeneration', {
              omrData: formData,
              localPath: localFilePath,
              index,
              students,
            });
          }}>
          <Text className="text-black text-center text-base font-bold">
            Generate Report
          </Text>
        </TouchableOpacity>
      </View>
      <Text className="text-[#ccc] text-base mt-[10%] mb-[5%]">
        History (Total Reports: {reportItems.length}):
      </Text>
      <ScrollView>
        {reportItems.map((item, idx) => (
          <View
            key={idx}
            className="flex-row justify-between items-center my-[2%]">
            <TouchableOpacity
              onPress={async () => {
                const hasPermissions = await checkStoragePermissions();
                if (!hasPermissions) {
                  const granted = await requestStoragePermissions();
                  if (!granted) {
                    Alert.alert(
                      'Permission Required',
                      'Storage permission is required to access files.',
                    );
                    return;
                  }
                }

                if (await RNFS.exists(item.path)) {
                  FileViewer.open(item.path).catch(error => {
                    ToastAndroid.show(
                      "Can't Open PDF!\n" +
                        'Go Manually Open It in Your Device From This Path: ' +
                        item.path.substring(item.path.indexOf('Download')),
                      ToastAndroid.LONG,
                    );
                    console.log('Error opening PDF:', error);
                  });
                } else {
                  Alert.alert(
                    'File Does Not Exist!',
                    'Do you want to Re-Generate the file? If Not, Then Please Delete This Item!',
                    [
                      {
                        text: 'Delete',
                        onPress: () => {
                          deleteReportItem(idx);
                        },
                      },
                      {
                        text: 'Re-Generate',
                        onPress: () => {
                          handleSubmit(idx);
                        },
                      },
                    ],
                    {cancelable: true},
                  );
                }
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
                {'REPORT - ' + (idx + 1) + ' ' + item.name}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => deleteReportItem(idx)}
              className="bg-[#ff5500] px-[4%] py-[2%] rounded-lg">
              <Text className="text-white text-lg">🗑</Text>
            </TouchableOpacity>
          </View>
        ))}
      </ScrollView>
    </View>
  );
};

export default ReportHistoryList;
