import React, {useState} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Dimensions,
} from 'react-native';
import {launchCamera, launchImageLibrary} from 'react-native-image-picker';
import {requestCameraPermission} from '../utils/permissions';

const OmrEvaluationInfo = ({
  omrData,
  localFilePath,
  index,
  students,
  reports,
  navigation,
  openPDF,
  handleSubmit,
}) => {
  const screenWidth = Dimensions.get('window').width;
  const wqCaseArr = [
    'If filled, get (0)mark. If left blank, get (0)mark',
    'If filled, get (' +
      omrData.mpq +
      ')mark. If left blank, get (' +
      omrData.mpq +
      ')mark',
    'If filled, get (0)mark. If left blank, get (' + omrData.mpq + ')mark',
    'If filled, get (' +
      omrData.negativeMark +
      ')mark. If left blank, get (0)mark',
    'If filled, get (' +
      omrData.negativeMark +
      ')mark. If left blank, get (' +
      omrData.mpq +
      ')mark',
  ];
  const [showBox, setShowBox] = useState(false);
  const source = [];
  const setList = ['A', 'B', 'C', 'D'];
  const list = [0, 0, 0, 0];
  let count = new Array(omrData.setCount).fill(0);

  for (let i = 1; i <= omrData.setCount; i++) {
    for (let j = 1; j <= omrData.questionsCount; j++) {
      if (Number(omrData['set' + i + 'Q' + j]) < 0) {
        count[i - 1]++;
      }
      if (
        omrData['set' + i + 'Q' + j].length > 1 &&
        !omrData['set' + i + 'Q' + j].includes('-')
      ) {
        list[i - 1]++;
      }
    }
  }

  const pickImage = (takeSecondPicture = false) => {
    const options = {
      mediaType: 'photo',
      quality: 1,
    };

    const handleGalleryResponse = response => {
      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.error) {
        console.log('ImagePicker Error: ', response.error);
      } else if (response.customButton) {
        console.log('User tapped custom button: ', response.customButton);
      } else if (response.assets && response.assets.length > 0) {
        source.push(response.assets[0].uri);
        if (omrData.questionsCount > 35 && !takeSecondPicture) {
          console.log('Picking a second image...');
          pickImage(true);
        }

        if (
          (omrData.questionsCount > 35 && source.length === 2) ||
          (omrData.questionsCount <= 35 && source.length === 1)
        ) {
          handleSubmit(source);
        }
      } else {
        console.log('Gallery response invalid: ', response);
      }
    };

    launchImageLibrary(options, handleGalleryResponse);
  };

  const takePicture = async (takeSecondPicture = false) => {
    // Request camera permission first
    const hasPermission = await requestCameraPermission();

    if (!hasPermission) {
      console.log('Camera permission denied');
      return;
    }

    const options = {
      mediaType: 'photo',
      quality: 1,
      saveToPhotos: false,
    };

    const handleCameraResponse = response => {
      if (response.didCancel) {
        console.log('User cancelled camera');
      } else if (response.error) {
        console.log('Camera Error: ', response.error);
      } else if (response.customButton) {
        console.log('User tapped custom button: ', response.customButton);
      } else if (response.assets && response.assets.length > 0) {
        source.push(response.assets[0].uri);
        if (omrData.questionsCount > 35 && !takeSecondPicture) {
          console.log('Taking a second picture...');
          takePicture(true);
        }

        if (
          (omrData.questionsCount > 35 && source.length === 2) ||
          (omrData.questionsCount <= 35 && source.length === 1)
        ) {
          handleSubmit(source);
        }
      } else {
        console.log('Camera response invalid: ', response);
      }
    };

    launchCamera(options, handleCameraResponse);
  };

  // eslint-disable-next-line no-unused-vars
  const debug = async () => {
    for (let i = 1; i <= omrData.setCount; i++) {
      for (let j = 1; j <= omrData.questionsCount; j++) {
        console.log('set' + i + 'Q' + j, omrData['set' + i + 'Q' + j]);
      }
    }
    console.log('questionsCount:', omrData.questionsCount);
    console.log('setCount:', omrData.setCount);
    console.log('wqCase:', omrData.wqCase);
    console.log('isRoll:', omrData.isRoll);
    console.log('rollDigit:', omrData.rollDigit);
    console.log('mpq:', omrData.mpq);
    console.log('isNegative:', omrData.isNegative);
    console.log('negativeMark:', omrData.negativeMark);
    console.log('\nStudents:\n', students);
    console.log('\nReports:\n', reports);
  };

  return (
    <View className="flex-1 bg-[#111] p-[5%]">
      <View className="bg-[#1a1a1a] rounded-xl mb-[3%]">
        <View className="rounded-t-xl p-[3%] bg-[#050505]">
          <Text className="text-white text-base font-bold mb-[1%]">
            Institution Name:{' '}
          </Text>
          <Text
            className={`text-white text-base ${
              omrData.isIUnderline ? 'underline' : ''
            }`}>
            {omrData.iName}
          </Text>
        </View>

        <View className="mb-[5%] rounded-b-xl p-[3%] bg-[#050505]">
          <Text className="text-white text-base font-bold mb-[1%]">
            Exam Name:{' '}
          </Text>
          <Text
            className={`text-white text-base ${
              omrData.isPUnderline ? 'underline' : ''
            }`}>
            {omrData.pName}
          </Text>
        </View>

        <View className="flex-row justify-between py-[2%] px-[3%] border-b border-gray-700">
          <Text className="text-white text-base font-bold mb-[1%]">
            Name Field:{' '}
          </Text>
          <Text
            className={`text-base ${
              omrData.isName ? 'text-success' : 'text-[#ff5500]'
            }`}>
            {omrData.isName ? 'YES' : 'NO'}
          </Text>
        </View>

        {omrData.isRoll && (
          <View className="flex-row justify-between py-[2%] px-[3%] border-b border-gray-700">
            <Text className="text-white text-base font-bold mb-[1%]">
              ID Digits:{' '}
            </Text>
            <Text className="text-white text-base">{omrData.rollDigit}</Text>
          </View>
        )}
        {omrData.isRoll ? (
          <View className="flex-row justify-between py-[2%] px-[3%] border-b border-gray-700">
            <Text className="text-white text-base font-bold mb-[1%]">
              ID Field:{' '}
            </Text>
            <Text className="text-success text-base">YES</Text>
          </View>
        ) : (
          <View className="flex-row justify-between py-[2%] px-[3%] border-b border-gray-700">
            <Text className="text-white text-base font-bold mb-[1%]">
              ID Field:{' '}
            </Text>
            <Text className="text-[#ff5500] text-base">NO</Text>
          </View>
        )}

        <View className="flex-row justify-between py-[2%] px-[3%] border-b border-gray-700">
          <Text className="text-white text-base font-bold mb-[1%]">
            Number of Sets:{' '}
          </Text>
          <Text className="text-white text-base">
            {omrData.setCount > 1 ? omrData.setCount : 'None'}
          </Text>
        </View>

        <View className="flex-row justify-between py-[2%] px-[3%] border-b border-gray-700">
          <Text className="text-white text-base font-bold mb-[1%]">
            Number of Questions:{' '}
          </Text>
          <Text className="text-white text-base">{omrData.questionsCount}</Text>
        </View>
        <View className="flex-row justify-evenly mt-[3%]">
          <View className="flex-1 mx-[2%]">
            <TouchableOpacity
              className="rounded-[50px] px-[5%] py-[4%] bg-primary justify-center items-center"
              onPress={() =>
                navigation.navigate('OmrGeneration', {
                  omrData,
                  localPath: localFilePath,
                  idx: index,
                  students,
                  reports,
                })
              }>
              <Text className="text-black text-base font-bold">Edit</Text>
            </TouchableOpacity>
          </View>
          <View className="flex-1 mx-[2%]">
            <TouchableOpacity
              onPress={() => openPDF(localFilePath)}
              className="rounded-[50px] px-[5%] py-[4%] bg-white justify-center items-center">
              <Text className="text-black text-base font-bold">Open OMR</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {showBox || students.length ? (
        <View>
          <Text className="text-white mt-[5%] ml-[1.5%] text-[15px]">
            Evaluate with
            {omrData.questionsCount > 35
              ? ' 2 pictures (in order)'
              : ' 1 picture'}
            :
          </Text>
          <View className="bg-[#1a1a1a] rounded-xl mb-[3%] flex-row justify-around pt-0 pb-[5%]">
            <View className="flex-1 mx-[2%]">
              <TouchableOpacity
                className="rounded-[50px] px-[5%] py-[4%] bg-[#ee6f2f] justify-center items-center mt-[5%]"
                onPress={() => takePicture()}>
                <Text className="text-white text-base font-bold">Camera</Text>
              </TouchableOpacity>
            </View>
            <View className="flex-1 mx-[2%]">
              <TouchableOpacity
                className="rounded-[50px] px-[5%] py-[4%] bg-[#2f6fee] justify-center items-center mt-[5%]"
                onPress={() => pickImage()}>
                <Text className="text-white text-base font-bold">Gallery</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      ) : (
        <View className="flex-1 mx-[2%]">
          <TouchableOpacity
            className="rounded-[50px] px-[10%] py-[5%] bg-[#ee6f2f] justify-center items-center border-2 border-white border-dotted"
            onPress={() => setShowBox(true)}>
            <Text className="text-white text-base font-bold">Evaluate</Text>
          </TouchableOpacity>
        </View>
      )}

      <Text className="text-white mt-[15%] ml-[1.5%] text-[13px]">
        Scroll Horizontally For More Options ➤
      </Text>
      <ScrollView horizontal className="max-h-[250px]">
        <View
          className="flex-row"
          style={{width: screenWidth - 40, marginRight: 10}}>
          {count.map((item, i) => {
            return (
              <View key={i} className="mb-[10%]">
                {omrData.setCount > 1 && (
                  <Text className="text-white text-base">
                    SET {setList[i]}:
                  </Text>
                )}
                <View className="flex-row justify-between">
                  <View className="flex-row justify-between py-[2%] px-[3%]">
                    <Text className="text-white text-base font-bold mb-[1%]">
                      Ans Exist:{' '}
                    </Text>
                    <Text className="text-white text-base">
                      {omrData.questionsCount - item}
                    </Text>
                  </View>
                  <Text className="text-white text-base">|</Text>
                  <View className="flex-row justify-between py-[2%] px-[3%]">
                    <Text className="text-white text-base font-bold mb-[1%]">
                      No-Ans:{' '}
                    </Text>
                    <Text className="text-[#ff5500] text-base">{item}</Text>
                  </View>
                </View>
                <View className="flex-row justify-between py-[2%] px-[3%]">
                  <Text className="text-white text-base font-bold mb-[1%]">
                    {' '}
                    Single-Ans:{' '}
                  </Text>
                  <Text className="text-success text-base">
                    {omrData.questionsCount - item - list[i]}
                  </Text>
                </View>
                <View className="flex-row justify-between py-[2%] px-[3%]">
                  <Text className="text-white text-base font-bold mb-[1%]">
                    {' '}
                    Multiple-Ans:{' '}
                  </Text>
                  <Text className="text-yellow-400 text-base">{list[i]}</Text>
                </View>
              </View>
            );
          })}
        </View>

        <View className="flex-1 mx-[2%]">
          <TouchableOpacity
            className="rounded-[50px] px-[10%] py-[5%] bg-secondary justify-center items-center"
            onPress={() =>
              navigation.navigate('AnswerSheet', {
                omrData,
                localFilePath,
              })
            }>
            <Text className="text-white text-base font-bold">Answer Key</Text>
          </TouchableOpacity>
        </View>

        <View style={{width: screenWidth - 40}}>
          <View className="mb-[10%]">
            <View className="flex-row justify-between py-[2%] px-[3%]">
              <Text className="text-white text-base font-bold mb-[1%]">
                Mark For Each Question:{' '}
              </Text>
              <Text className="text-success text-base">{omrData.mpq}</Text>
            </View>
            <View className="flex-row justify-between py-[2%] px-[3%]">
              <Text className="text-white text-base font-bold mb-[1%]">
                Wrong Marking:{' '}
              </Text>
              <Text
                className={`text-base ${
                  omrData.wrongCase > 1 ? 'text-success' : 'text-[#ff5500]'
                }`}>
                {wqCaseArr[omrData.wrongCase]}
              </Text>
            </View>

            {omrData.negativeMark !== 0 ? (
              <View className="flex-row justify-between py-[2%] px-[3%]">
                <Text className="text-white text-base font-bold mb-[1%]">
                  Negative Mark Per Mistake:{' '}
                </Text>
                <Text className="text-[#ff5500] text-base">
                  {omrData.negativeMark}
                </Text>
              </View>
            ) : null}

            <View className="flex-1 mx-[2%]">
              <TouchableOpacity
                className="rounded-[50px] px-[10%] py-[5%] bg-secondary justify-center items-center"
                onPress={() =>
                  navigation.navigate('ExamMarking', {
                    omrData,
                    localFilePath,
                    index,
                    students,
                    reports,
                  })
                }>
                <Text className="text-white text-base font-bold">Edit</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </ScrollView>

      <View className="flex-row justify-around mt-[10%]">
        <View className="flex-1 mx-[2%]">
          <TouchableOpacity
            className="rounded-[15px] px-[10%] py-[5%] bg-secondary justify-center items-center border border-white border-dashed"
            onPress={() => {
              navigation.navigate('ReportHistory', {
                formData: omrData,
                localFilePath,
                index,
                students,
              });
            }}>
            <Text className="text-white text-base font-bold">Reports</Text>
          </TouchableOpacity>
        </View>
        <View className="flex-1 mx-[2%]">
          <TouchableOpacity
            className="rounded-[15px] px-[10%] py-[5%] bg-secondary justify-center items-center border border-white border-dashed"
            onPress={() => {
              navigation.navigate('Analysis', {
                formData: omrData,
                students,
              });
            }}>
            <Text className="text-white text-base font-bold">Analysis</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View className="flex-1 mx-[2%]">
        <TouchableOpacity
          className="rounded-[15px] px-[10%] py-[5%] bg-[#ee6f2f] justify-center items-center border border-white border-dashed ml-[2%] mt-[5%]"
          onPress={() => {
            navigation.navigate('StudentHistory', {
              formData: omrData,
              localFilePath,
              index,
              students,
            });
          }}>
          <Text className="text-white text-base font-bold">
            Student Evaluation History
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default OmrEvaluationInfo;
