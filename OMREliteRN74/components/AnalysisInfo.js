import React, {useState} from 'react';
import {View, Text, ScrollView, Dimensions, FlatList} from 'react-native';
import CustomCheckBox from './CustomCheckBox';
import styles from '../componentStyles/OmrEvaluationInfoStyle';

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
    <View
      key={index}
      style={{
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: '3%',
      }}>
      <View style={styles.fieldBox}>
        <Text
          style={
            omrData[`set${idx + 1}Q${index + 1}`].includes('-')
              ? {...styles.text, color: '#ff5500', fontSize: 11}
              : {...styles.text, fontSize: 11}
          }>
          {index + 1 < 10 ? `Q-0${index + 1}` : `Q-${index + 1}`}
        </Text>
        <Text style={styles.text}> |</Text>
      </View>
      <View style={styles.fieldBox}>
        <Text style={{...styles.label, fontSize: 11}}>correct: </Text>
        <Text style={{...styles.text, color: '#55ff00'}}>
          {correctCount[idx][index]}
        </Text>
      </View>
      <Text style={styles.text}>-</Text>
      <View style={styles.fieldBox}>
        <Text style={{...styles.label, fontSize: 11}}>
          {'  '}
          wrong:
        </Text>
        <Text style={{...styles.text, color: '#ff5500'}}>
          {' '}
          {wrongCount[idx][index]}
        </Text>
      </View>
      <Text style={styles.text}>-</Text>
      <View style={styles.fieldBox}>
        <Text style={{...styles.label, fontSize: 11}}>
          {'  '}
          blank:
        </Text>
        <Text style={styles.text}> {item}</Text>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={{...styles.text, marginTop: '5%'}}>
        Student's Performance:
      </Text>
      {omrData.setCount > 1 && (
        <Text
          style={{
            ...styles.label,
            marginLeft: '1%',
            marginBottom: '3%',
          }}>
          Scroll Horizontally ➤
        </Text>
      )}
      <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
        <View
          style={{
            ...styles.topBox,
            width: screenWidth - 40,
            marginRight: maxScore.length > 1 ? 10 : 0,
            padding: 0,
            paddingLeft: '3%',
            paddingTop: '1%',
          }}>
          <View style={styles.fieldBox}>
            <Text style={styles.text}>Total Students: </Text>
            <Text style={styles.text}>{students.length}</Text>
          </View>
          <View style={styles.fieldBox}>
            <Text style={{...styles.label, fontSize: 10}}>
              Exemplary (Above 80%):{' '}
            </Text>
            <Text style={styles.text}>
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
          <View style={styles.fieldBox}>
            <Text style={{...styles.label, fontSize: 10}}>
              Satisfactory (60 - 79)%:{' '}
            </Text>
            <Text style={styles.text}>
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
          <View style={styles.fieldBox}>
            <Text style={{...styles.label, fontSize: 10}}>
              Developing (40 - 59)%:{' '}
            </Text>
            <Text style={styles.text}>
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
          <View style={styles.fieldBox}>
            <Text style={{...styles.label, fontSize: 10}}>
              Unsatisfactory (Below 40%):{' '}
            </Text>
            <Text style={styles.text}>
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
          <View style={{...styles.fieldBox, marginTop: '5%'}}>
            <Text style={styles.label}>Highest Score: </Text>
            <Text style={{...styles.text, color: '#55ff00'}}>
              {Math.max(...maxScore)}
            </Text>
          </View>
          <View style={{...styles.fieldBox, marginBottom: '5%'}}>
            <Text style={styles.label}>Lowest Score: </Text>
            <Text style={{...styles.text, color: '#ff5500'}}>
              {Math.min(...minScore)}
            </Text>
          </View>
        </View>
        {maxScore.length > 1 &&
          maxScore.map((value, i) => (
            <View
              key={i}
              style={{
                ...styles.topBox,
                width: screenWidth - 40,
                marginRight: i < maxScore.length - 1 ? 10 : 0,
                padding: 0,
                paddingLeft: '3%',
                paddingTop: '1%',
              }}>
              <View style={styles.fieldBox}>
                <Text style={styles.text}>
                  SET {setList[i]} Total Students:{' '}
                </Text>
                <Text style={styles.text}>{totalStudents[i]}</Text>
              </View>
              <View style={styles.fieldBox}>
                <Text style={{...styles.label, fontSize: 10}}>
                  Exemplary (Above 80%):{' '}
                </Text>
                <Text style={styles.text}>
                  {above80[i] +
                    ' (' +
                    (
                      (above80[i] / (totalStudents[i] ? totalStudents[i] : 1)) *
                      100
                    ).toFixed(1) +
                    '%)'}
                </Text>
              </View>
              <View style={styles.fieldBox}>
                <Text style={{...styles.label, fontSize: 10}}>
                  Satisfactory (60 - 79)%:{' '}
                </Text>
                <Text style={styles.text}>
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
              <View style={styles.fieldBox}>
                <Text style={{...styles.label, fontSize: 10}}>
                  Developing (40 - 59)%:{' '}
                </Text>
                <Text style={styles.text}>
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
              <View style={styles.fieldBox}>
                <Text style={{...styles.label, fontSize: 10}}>
                  Unsatisfactory (Below 40%):{' '}
                </Text>
                <Text style={styles.text}>
                  {below40[i] +
                    ' (' +
                    (
                      (below40[i] / (totalStudents[i] ? totalStudents[i] : 1)) *
                      100
                    ).toFixed(1) +
                    '%)'}
                </Text>
              </View>
              <View style={{...styles.fieldBox, marginTop: '5%'}}>
                <Text style={styles.label}>Highest Score: </Text>
                <Text style={{...styles.text, color: '#55ff00'}}>
                  {totalStudents[i] ? value : 0}
                </Text>
              </View>
              <View style={{...styles.fieldBox, marginBottom: '5%'}}>
                <Text style={styles.label}>Lowest Score: </Text>
                <Text style={{...styles.text, color: '#ff5500'}}>
                  {totalStudents[i] ? minScore[i] : 0}
                </Text>
              </View>
            </View>
          ))}
      </ScrollView>

      <Text
        style={{
          ...styles.text,
          marginTop: '15%',
          marginBottom: omrData.setCount > 1 ? '0%' : '5%',
          fontSize: 14,
        }}>
        Question Analysis Of All Students:
      </Text>

      {blankCount.length > 1 && (
        <View style={styles.setContainer}>
          <Text style={styles.label}>SET: </Text>
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
            ...styles.box,
            padding: '5%',
            width: screenWidth - 40,
          }}
        />
      </ScrollView>
    </View>
  );
};

export default AnalysisInfo;
