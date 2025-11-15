import React, {useState} from 'react';
import {View, Text, ScrollView, Dimensions, FlatList} from 'react-native';
import CustomCheckBox from './CustomCheckBox';

const AnalysisInfo = ({omrData, students}) => {
  const screenWidth = Dimensions.get('window').width;
  const [idx, setIdx] = useState(0);
  const setList = ['A', 'B', 'C', 'D'];
  const totalMarks = omrData.questionsCount * omrData.mpq;
  const above80 = new Array(omrData.setCount).fill(0);
  const sixtyTo79 = new Array(omrData.setCount).fill(0);
  const fortyTo59 = new Array(omrData.setCount).fill(0);
  const below40 = new Array(omrData.setCount).fill(0);
  const totalStudents = new Array(omrData.setCount).fill(0);
  const maxScore = new Array(omrData.setCount).fill(
    students.length ? Number.MIN_SAFE_INTEGER : 0,
  );
  const minScore = new Array(omrData.setCount).fill(
    students.length ? Number.MAX_SAFE_INTEGER : 0,
  );
  let correctCount = Array.from({length: omrData.setCount}, () =>
    new Array(omrData.questionsCount).fill(0),
  );
  let wrongCount = Array.from({length: omrData.setCount}, () =>
    new Array(omrData.questionsCount).fill(0),
  );
  let blankCount = Array.from({length: omrData.setCount}, () =>
    new Array(omrData.questionsCount).fill(0),
  );

  for (let i = 1; i <= omrData.setCount; i++) {
    for (let j = 0; j < students.length; j++) {
      if (students[j].setno === i && students[j].marks > maxScore[i - 1]) {
        maxScore[i - 1] = students[j].marks;
      }
      if (students[j].setno === i && students[j].marks < minScore[i - 1]) {
        minScore[i - 1] = students[j].marks;
      }
      if (students[j].setno === i) {
        totalStudents[i - 1]++;
      }
      if (students[j].setno === i && students[j].marks >= totalMarks * 0.8) {
        above80[i - 1]++;
      } else if (
        students[j].setno === i &&
        students[j].marks >= totalMarks * 0.6
      ) {
        sixtyTo79[i - 1]++;
      } else if (
        students[j].setno === i &&
        students[j].marks >= totalMarks * 0.4
      ) {
        fortyTo59[i - 1]++;
      } else if (students[j].setno === i) {
        below40[i - 1]++;
      }
    }
  }

  for (let i = 1; i <= omrData.setCount; i++) {
    const compareStrings = (mainString, subString) => {
      for (let j = 0; j < subString.length; j++) {
        if (mainString.includes('-') || !mainString.includes(subString[j])) {
          return false;
        }
      }
      return true;
    };

    for (let j = 1; j <= omrData.questionsCount; j++) {
      for (let k = 0; k < students.length; k++) {
        if (students[k].setno === i && students[k]['Q' + j] === '0') {
          blankCount[i - 1][j - 1]++;
        } else {
          if (
            students[k].setno === i &&
            compareStrings(omrData['set' + i + 'Q' + j], students[k]['Q' + j])
          ) {
            correctCount[i - 1][j - 1]++;
          }
          if (
            students[k].setno === i &&
            !compareStrings(omrData['set' + i + 'Q' + j], students[k]['Q' + j])
          ) {
            wrongCount[i - 1][j - 1]++;
          }
        }
      }
    }
  }

  const renderItem = ({item, index}) => (
    <View key={index} className="flex-row justify-between mb-[3%]">
      <View className="flex-row justify-between py-[2%] px-[3%]">
        <Text
          className={
            omrData[`set${idx + 1}Q${index + 1}`].includes('-')
              ? 'text-[#ff5500] text-base text-[11px]'
              : 'text-white text-base text-[11px]'
          }>
          {index + 1 < 10 ? `Q-0${index + 1}` : `Q-${index + 1}`}
        </Text>
        <Text className="text-white text-base"> |</Text>
      </View>
      <View className="flex-row justify-between py-[2%] px-[3%]">
        <Text className="text-white text-base font-bold mb-[1%] text-[11px]">
          correct:{' '}
        </Text>
        <Text className="text-success text-base">
          {correctCount[idx][index]}
        </Text>
      </View>
      <Text className="text-white text-base">-</Text>
      <View className="flex-row justify-between py-[2%] px-[3%]">
        <Text className="text-white text-base font-bold mb-[1%] text-[11px]">
          {'  '}
          wrong:
        </Text>
        <Text className="text-[#ff5500] text-base">
          {' '}
          {wrongCount[idx][index]}
        </Text>
      </View>
      <Text className="text-white text-base">-</Text>
      <View className="flex-row justify-between py-[2%] px-[3%]">
        <Text className="text-white text-base font-bold mb-[1%] text-[11px]">
          {'  '}
          blank:
        </Text>
        <Text className="text-white text-base"> {item}</Text>
      </View>
    </View>
  );

  return (
    <View className="flex-1 bg-[#111] p-[5%]">
      <Text className="text-white text-base mt-[5%]">
        Student's Performance:
      </Text>
      {omrData.setCount > 1 && (
        <Text className="text-white text-base font-bold ml-[1%] mb-[3%]">
          Scroll Horizontally ➤
        </Text>
      )}
      <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
        <View
          style={{
            width: screenWidth - 40,
          }}
          className={`bg-[#1a1a1a] rounded-xl p-0 pl-[3%] pt-[1%] ${
            maxScore.length > 1 ? 'mr-[10px]' : ''
          }`}>
          <View className="flex-row justify-between py-[2%] px-[3%]">
            <Text className="text-white text-base">Total Students: </Text>
            <Text className="text-white text-base">{students.length}</Text>
          </View>
          <View className="flex-row justify-between py-[2%] px-[3%]">
            <Text className="text-white text-base font-bold text-[10px]">
              Exemplary (Above 80%):{' '}
            </Text>
            <Text className="text-white text-base">
              {above80.reduce(
                (accumulator, currentValue) => accumulator + currentValue,
                0,
              ) +
                ' (' +
                (
                  (above80.reduce(
                    (accumulator, currentValue) => accumulator + currentValue,
                    0,
                  ) /
                    (students.length ? students.length : 1)) *
                  100
                ).toFixed(1) +
                '%)'}
            </Text>
          </View>
          <View className="flex-row justify-between py-[2%] px-[3%]">
            <Text className="text-white text-base font-bold text-[10px]">
              Satisfactory (60 - 79)%:{' '}
            </Text>
            <Text className="text-white text-base">
              {sixtyTo79.reduce(
                (accumulator, currentValue) => accumulator + currentValue,
                0,
              ) +
                ' (' +
                (
                  (sixtyTo79.reduce(
                    (accumulator, currentValue) => accumulator + currentValue,
                    0,
                  ) /
                    (students.length ? students.length : 1)) *
                  100
                ).toFixed(1) +
                '%)'}
            </Text>
          </View>
          <View className="flex-row justify-between py-[2%] px-[3%]">
            <Text className="text-white text-base font-bold text-[10px]">
              Developing (40 - 59)%:{' '}
            </Text>
            <Text className="text-white text-base">
              {fortyTo59.reduce(
                (accumulator, currentValue) => accumulator + currentValue,
                0,
              ) +
                ' (' +
                (
                  (fortyTo59.reduce(
                    (accumulator, currentValue) => accumulator + currentValue,
                    0,
                  ) /
                    (students.length ? students.length : 1)) *
                  100
                ).toFixed(1) +
                '%)'}
            </Text>
          </View>
          <View className="flex-row justify-between py-[2%] px-[3%]">
            <Text className="text-white text-base font-bold text-[10px]">
              Unsatisfactory (Below 40%):{' '}
            </Text>
            <Text className="text-white text-base">
              {below40.reduce(
                (accumulator, currentValue) => accumulator + currentValue,
                0,
              ) +
                ' (' +
                (
                  (below40.reduce(
                    (accumulator, currentValue) => accumulator + currentValue,
                    0,
                  ) /
                    (students.length ? students.length : 1)) *
                  100
                ).toFixed(1) +
                '%)'}
            </Text>
          </View>
          <View className="flex-row justify-between py-[2%] px-[3%] mt-[5%]">
            <Text className="text-white text-base font-bold mb-[1%]">
              Highest Score:{' '}
            </Text>
            <Text className="text-success text-base">
              {Math.max(...maxScore)}
            </Text>
          </View>
          <View className="flex-row justify-between py-[2%] px-[3%] mb-[5%]">
            <Text className="text-white text-base font-bold mb-[1%]">
              Lowest Score:{' '}
            </Text>
            <Text className="text-[#ff5500] text-base">
              {Math.min(...minScore)}
            </Text>
          </View>
        </View>
        {maxScore.length > 1 &&
          maxScore.map((value, i) => (
            <View
              key={i}
              style={{
                width: screenWidth - 40,
                marginRight: i < maxScore.length - 1 ? 10 : 0,
              }}
              className="rounded-lg bg-[#1a1a1a] p-0 pl-[3%] pt-[1%]">
              <View className="flex-row justify-between py-[2%] px-[3%]">
                <Text className="text-white text-base">
                  SET {setList[i]} Total Students:{' '}
                </Text>
                <Text className="text-white text-base">{totalStudents[i]}</Text>
              </View>
              <View className="flex-row justify-between py-[2%] px-[3%]">
                <Text className="text-white text-base font-bold text-[10px]">
                  Exemplary (Above 80%):{' '}
                </Text>
                <Text className="text-white text-base">
                  {above80[i] +
                    ' (' +
                    (
                      (above80[i] / (totalStudents[i] ? totalStudents[i] : 1)) *
                      100
                    ).toFixed(1) +
                    '%)'}
                </Text>
              </View>
              <View className="flex-row justify-between py-[2%] px-[3%]">
                <Text className="text-white text-base font-bold text-[10px]">
                  Satisfactory (60 - 79)%:{' '}
                </Text>
                <Text className="text-white text-base">
                  {sixtyTo79[i] +
                    ' (' +
                    (
                      (sixtyTo79[i] /
                        (totalStudents[i] ? totalStudents[i] : 1)) *
                      100
                    ).toFixed(1) +
                    '%)'}
                </Text>
              </View>
              <View className="flex-row justify-between py-[2%] px-[3%]">
                <Text className="text-white text-base font-bold text-[10px]">
                  Developing (40 - 59)%:{' '}
                </Text>
                <Text className="text-white text-base">
                  {fortyTo59[i] +
                    ' (' +
                    (
                      (fortyTo59[i] /
                        (totalStudents[i] ? totalStudents[i] : 1)) *
                      100
                    ).toFixed(1) +
                    '%)'}
                </Text>
              </View>
              <View className="flex-row justify-between py-[2%] px-[3%]">
                <Text className="text-white text-base font-bold text-[10px]">
                  Unsatisfactory (Below 40%):{' '}
                </Text>
                <Text className="text-white text-base">
                  {below40[i] +
                    ' (' +
                    (
                      (below40[i] / (totalStudents[i] ? totalStudents[i] : 1)) *
                      100
                    ).toFixed(1) +
                    '%)'}
                </Text>
              </View>
              <View className="flex-row justify-between py-[2%] px-[3%] mt-[5%]">
                <Text className="text-white text-base font-bold mb-[1%]">
                  Highest Score:{' '}
                </Text>
                <Text className="text-success text-base">
                  {totalStudents[i] ? value : 0}
                </Text>
              </View>
              <View className="flex-row justify-between py-[2%] px-[3%] mb-[5%]">
                <Text className="text-white text-base font-bold mb-[1%]">
                  Lowest Score:{' '}
                </Text>
                <Text className="text-[#ff5500] text-base">
                  {totalStudents[i] ? minScore[i] : 0}
                </Text>
              </View>
            </View>
          ))}
      </ScrollView>

      <Text
        className={`text-white text-base mt-[15%] text-[14px] ${
          omrData.setCount > 1 ? 'mb-0' : 'mb-[5%]'
        }`}>
        Question Analysis Of All Students:
      </Text>

      {blankCount.length > 1 && (
        <View className="flex-row items-center mt-[5%] mb-[3%]">
          <Text className="text-white text-base font-bold mb-[1%]">SET: </Text>
          <CustomCheckBox
            options={['A', 'B', 'C', 'D']
              .slice(0, omrData.setCount)
              .map((item, index) => ({
                label: item,
                value: index.toString(),
              }))}
            selectedValue={idx.toString()}
            onValueChange={newValue => {
              setIdx(parseInt(newValue, 10));
            }}
          />
        </View>
      )}

      <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
        <FlatList
          data={blankCount[idx]}
          renderItem={renderItem}
          keyExtractor={(item, index) => index.toString()}
          style={{
            width: screenWidth - 40,
          }}
          className="rounded-lg bg-[#1a1a1a] p-[5%]"
        />
      </ScrollView>
    </View>
  );
};

export default AnalysisInfo;
