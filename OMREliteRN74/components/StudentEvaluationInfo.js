import React, {useState} from 'react';
import {View, Text, TouchableOpacity} from 'react-native';
import {launchCamera, launchImageLibrary} from 'react-native-image-picker';
import {requestCameraPermission} from '../utils/permissions';

const StudentEvaluationInfo = ({
  omrData,
  localFilePath,
  index,
  student,
  idx,
  navigation,
  openPDF,
  handleSubmit,
}) => {
  const [showBox, setShowBox] = useState(false);
  const list = ['A', 'B', 'C', 'D'];
  const source = [];
  let touched = 0,
    correct = 0,
    wrong = 0,
    multiple = 0,
    negativeMark = omrData.isNegative ? omrData.negativeMark : 0;

  const compareStrings = (mainString, subString) => {
    for (let i = 0; i < subString.length; i++) {
      if (mainString.includes('-') || !mainString.includes(subString[i])) {
        return false;
      }
    }
    return true;
  };

  for (let i = 1; i <= omrData.questionsCount; i++) {
    if (Number(student['Q' + i])) {
      touched++;
    }
    if (student['Q' + i].length > 1) {
      multiple++;
    }
    if (
      Number(student['Q' + i]) &&
      !compareStrings(
        omrData['set' + student.setno + 'Q' + i],
        student['Q' + i],
      )
    ) {
      wrong++;
    }
    if (
      compareStrings(omrData['set' + student.setno + 'Q' + i], student['Q' + i])
    ) {
      correct++;
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
  const debug = () => {
    for (let j = 1; j <= omrData.questionsCount; j++) {
      console.log('Q' + j, student['Q' + j]);
    }
    console.log('ID:', student.idno);
    console.log('Name:', student.name);
    console.log('SET:', student.setno);
    console.log('Score:', student.marks);
    console.log('file1:', student.file1);
    console.log('file2:', student.file2);
  };

  return (
    <View className="flex-1 bg-[#111] p-[5%]">
      <View className="bg-[#1a1a1a] rounded-xl mb-[3%]">
        {omrData.isRoll ? (
          <View
            className={`p-[3%] bg-[#050505] ${
              omrData.isName ? 'rounded-t-xl' : 'rounded-xl'
            }`}>
            <Text className="text-white text-base font-bold mb-[1%]">
              Student ID:{' '}
            </Text>
            <Text className="text-white text-base">{student.idno}</Text>
          </View>
        ) : null}

        {omrData.isName || !omrData.isRoll ? (
          <View
            className={`p-[3%] bg-[#050505] ${
              omrData.isRoll ? 'mb-[5%] rounded-b-xl' : 'mb-[5%] rounded-xl'
            }`}>
            <Text className="text-white text-base font-bold mb-[1%]">
              Student Name:{' '}
            </Text>
            <Text className="text-white text-base">{student.name}</Text>
          </View>
        ) : null}

        {omrData.setCount > 1 ? (
          <View className="flex-row justify-between py-[2%] px-[3%] border-b border-gray-700">
            <Text className="text-white text-base font-bold mb-[1%]">
              SET:{' '}
            </Text>
            <Text className="text-white text-base">
              {list[student.setno - 1]}
            </Text>
          </View>
        ) : null}

        <View className="flex-row justify-between py-[2%] px-[3%] border-b border-gray-700">
          <Text className="text-white text-base font-bold mb-[1%]">
            Score:{' '}
          </Text>
          <Text className="text-white text-base">{student.marks}</Text>
        </View>

        <View className="flex-row justify-around mt-[3%]">
          <View className="flex-1 mx-[2%]">
            <TouchableOpacity
              className="rounded-[50px] px-[5%] py-[4%] bg-primary justify-center items-center"
              onPress={() =>
                navigation.navigate('StudentInformation', {
                  formData: omrData,
                  localFilePath,
                  index,
                  student,
                  idx,
                  allowBack: true,
                  msg: '',
                })
              }>
              <Text className="text-black text-base font-bold">Edit</Text>
            </TouchableOpacity>
          </View>
          <View className="flex-1 mx-[2%]">
            <TouchableOpacity
              className="rounded-[50px] px-[5%] py-[4%] bg-white justify-center items-center"
              onPress={openPDF}>
              <Text className="text-black text-base font-bold">Open OMR</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {showBox ? (
        <View>
          <Text className="text-white mt-[5%] ml-[1.5%] text-base">
            Take
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
        <View>
          <View className="flex-1 mx-[2%]">
            <TouchableOpacity
              className="rounded-xl px-[10%] py-[5%] bg-[#ee6f2f] justify-center items-center border-2 border-white border-dotted"
              onPress={() => setShowBox(true)}>
              <Text className="text-white text-base font-bold">
                Take/Select New Pictures
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      <Text className="text-white mt-[10%] ml-[1.5%] text-base">Analysis:</Text>
      <View className="bg-[#1a1a1a] rounded-xl p-[5%] border-2 border-white">
        <View className="flex-row justify-between py-[2%] px-[3%] mb-[5%]">
          <Text className="text-white text-base font-bold mb-[1%]">
            Touched Questions:{' '}
          </Text>
          <Text className="text-white text-base">{touched}</Text>
        </View>
        <View className="flex-row justify-between py-[2%] px-[3%] mb-[5%]">
          <Text className="text-white text-base font-bold mb-[1%]">
            Blank Answers:{' '}
          </Text>
          <Text className="text-white text-base">
            {omrData.questionsCount - touched}
          </Text>
        </View>
        <View className="flex-row justify-between py-[2%] px-[3%] mb-[5%]">
          <Text className="text-white text-base font-bold mb-[1%]">
            Correct Answers:{' '}
          </Text>
          <Text
            className={`text-base ${correct ? 'text-success' : 'text-white'}`}>
            {correct}
          </Text>
        </View>
        <View className="flex-row justify-between py-[2%] px-[3%] mb-[5%]">
          <Text className="text-white text-base font-bold mb-[1%]">
            Marks For Correct Answer:{' '}
          </Text>

          {omrData.mpq * correct ? (
            <Text className="text-success text-base">
              +{omrData.mpq * correct}
            </Text>
          ) : (
            <Text className="text-white text-base">
              {omrData.mpq * correct}
            </Text>
          )}
        </View>
        <View className="flex-row justify-between py-[2%] px-[3%] mb-[5%]">
          <Text className="text-white text-base font-bold mb-[1%]">
            Additional Marks:{' '}
          </Text>

          {student.marks - (omrData.mpq * correct + wrong * negativeMark) ? (
            <Text className="text-success text-base">
              +{student.marks - (omrData.mpq * correct + wrong * negativeMark)}
            </Text>
          ) : (
            <Text className="text-white text-base">0</Text>
          )}
        </View>
        <View className="flex-row justify-between py-[2%] px-[3%] mb-[5%]">
          <Text className="text-white text-base font-bold mb-[1%]">
            Wrong Answers:{' '}
          </Text>

          <Text
            className={`text-base ${wrong ? 'text-[#ff5500]' : 'text-white'}`}>
            {wrong}
          </Text>
        </View>
        <View className="flex-row justify-between py-[2%] px-[3%] mb-[5%]">
          <Text className="text-white text-base font-bold mb-[1%]">
            Multiple Answers Marked:{' '}
          </Text>

          <Text
            className={`text-base ${
              multiple ? 'text-[#ff5500]' : 'text-white'
            }`}>
            {multiple}
          </Text>
        </View>

        {omrData.isNegative}
        <View className="flex-row justify-between py-[2%] px-[3%]">
          <Text className="text-white text-base font-bold mb-[1%]">
            Total Negative Marking:{' '}
          </Text>

          <Text
            className={`text-base ${
              wrong * negativeMark ? 'text-[#ff5500]' : 'text-white'
            }`}>
            {wrong * negativeMark}
          </Text>
        </View>
      </View>
    </View>
  );
};

export default StudentEvaluationInfo;
