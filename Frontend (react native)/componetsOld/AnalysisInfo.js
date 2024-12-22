import React, { useState, useCallback } from "react";
import {
  View,
  Text,
  ScrollView,
  Dimensions,
  TouchableOpacity,
} from "react-native";
import { RadioButton } from "react-native-paper";
import styles from "../componentStyles/OmrEvaluationInfoStyle";

const AnalysisInfo = ({ omrData, students }) => {
  const screenWidth = Dimensions.get("window").width;
  const [idx, setIdx] = useState(0);
  const [currentPage, setCurrentPage] = useState(0);
  const questionsPerPage = 10;
  const totalPages = Math.ceil(omrData.questionsCount / questionsPerPage);
  const startIndex = currentPage * questionsPerPage;
  const endIndex = Math.min(
    startIndex + questionsPerPage,
    omrData.questionsCount,
  );
  const setList = ["A", "B", "C", "D"];
  const totalMarks = omrData.questionsCount * omrData.mpq;
  const above80 = new Array(omrData.setCount).fill(0);
  const sixtyTo79 = new Array(omrData.setCount).fill(0);
  const fortyTo59 = new Array(omrData.setCount).fill(0);
  const below40 = new Array(omrData.setCount).fill(0);
  totalStudents = new Array(omrData.setCount).fill(0);
  const maxScore = new Array(omrData.setCount).fill(
    students.length ? Number.MIN_SAFE_INTEGER : 0,
  );
  const minScore = new Array(omrData.setCount).fill(
    students.length ? Number.MAX_SAFE_INTEGER : 0,
  );
  let correctCount = Array.from({ length: omrData.setCount }, () =>
    new Array(omrData.questionsCount).fill(0),
  );
  let wrongCount = Array.from({ length: omrData.setCount }, () =>
    new Array(omrData.questionsCount).fill(0),
  );
  let blankCount = Array.from({ length: omrData.setCount }, () =>
    new Array(omrData.questionsCount).fill(0),
  );

  for (let i = 1; i <= omrData.setCount; i++) {
    for (let j = 0; j < students.length; j++) {
      if (students[j].setno == i && students[j].marks > maxScore[i - 1]) {
        maxScore[i - 1] = students[j].marks;
      }
      if (students[j].setno == i && students[j].marks < minScore[i - 1]) {
        minScore[i - 1] = students[j].marks;
      }
      if (students[j].setno == i) {
        totalStudents[i - 1]++;
      }
      if (students[j].setno == i && students[j].marks >= totalMarks * 0.8) {
        above80[i - 1]++;
      } else if (
        students[j].setno == i &&
        students[j].marks >= totalMarks * 0.6
      ) {
        sixtyTo79[i - 1]++;
      } else if (
        students[j].setno == i &&
        students[j].marks >= totalMarks * 0.4
      ) {
        fortyTo59[i - 1]++;
      } else if (students[j].setno == i) {
        below40[i - 1]++;
      }
    }
  }

  for (let i = 1; i <= omrData.setCount; i++) {
    const compareStrings = (mainString, subString) => {
      for (let j = 0; j < subString.length; j++) {
        if (mainString.includes("-") || !mainString.includes(subString[j])) {
          return false;
        }
      }
      return true;
    };

    for (let j = 1; j <= omrData.questionsCount; j++) {
      for (let k = 0; k < students.length; k++) {
        if (students[k].setno == i && students[k]["Q" + j] == "0") {
          blankCount[i - 1][j - 1]++;
        } else {
          if (
            students[k].setno == i &&
            compareStrings(omrData["set" + i + "Q" + j], students[k]["Q" + j])
          ) {
            correctCount[i - 1][j - 1]++;
          }
          if (
            students[k].setno == i &&
            !compareStrings(omrData["set" + i + "Q" + j], students[k]["Q" + j])
          ) {
            wrongCount[i - 1][j - 1]++;
          }
        }
      }
    }
  }

  const handleNext = useCallback(() => {
    setCurrentPage(current =>
      current < totalPages - 1 ? current + 1 : current,
    );
  }, [totalPages]);

  const handlePrev = useCallback(() => {
    setCurrentPage(current => (current > 0 ? current - 1 : current));
  }, []);

  const handleHardNext = useCallback(() => {
    setCurrentPage(totalPages - 1);
  }, [totalPages]);

  const handleHardPrev = useCallback(() => {
    setCurrentPage(0);
  }, []);

  return (
    <View style={styles.container}>
      <Text style={{ ...styles.text, marginVertical: "5%" }}>
        Student's Performance:
      </Text>
      {omrData.setCount > 1 && (
        <Text
          style={{
            ...styles.label,
            marginLeft: "1%",
            marginBottom: "3%",
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
            paddingLeft: "3%",
            paddingTop: "1%",
          }}>
          <View style={styles.fieldBox}>
            <Text style={styles.text}>Total Students: </Text>
            <Text style={styles.text}>{students.length}</Text>
          </View>
          <View style={styles.fieldBox}>
            <Text style={styles.label}>Exemplary (Above 80%): </Text>
            <Text style={styles.text}>
              {above80.reduce(
                (accumulator, currentValue) => accumulator + currentValue,
                0,
              )}
            </Text>
          </View>
          <View style={styles.fieldBox}>
            <Text style={styles.label}>Satisfactory (60 - 79)%: </Text>
            <Text style={styles.text}>
              {sixtyTo79.reduce(
                (accumulator, currentValue) => accumulator + currentValue,
                0,
              )}
            </Text>
          </View>
          <View style={styles.fieldBox}>
            <Text style={styles.label}>Developing (40 - 59)%: </Text>
            <Text style={styles.text}>
              {fortyTo59.reduce(
                (accumulator, currentValue) => accumulator + currentValue,
                0,
              )}
            </Text>
          </View>
          <View style={styles.fieldBox}>
            <Text style={styles.label}>Unsatisfactory (Below 40%): </Text>
            <Text style={styles.text}>
              {below40.reduce(
                (accumulator, currentValue) => accumulator + currentValue,
                0,
              )}
            </Text>
          </View>
          <View style={{ ...styles.fieldBox, marginTop: "5%" }}>
            <Text style={styles.label}>Highest Score: </Text>
            <Text style={{ ...styles.text, color: "#55ff00" }}>
              {Math.max(...maxScore)}
            </Text>
          </View>
          <View style={{ ...styles.fieldBox, marginBottom: "5%" }}>
            <Text style={styles.label}>Lowest Score: </Text>
            <Text style={{ ...styles.text, color: "#ff5500" }}>
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
                paddingLeft: "3%",
                paddingTop: "1%",
              }}>
              <View style={styles.fieldBox}>
                <Text style={styles.text}>
                  SET {setList[i]} Total Students:{" "}
                </Text>
                <Text style={styles.text}>{totalStudents[i]}</Text>
              </View>
              <View style={styles.fieldBox}>
                <Text style={styles.label}>Exemplary (Above 80%): </Text>
                <Text style={styles.text}>{above80[i]}</Text>
              </View>
              <View style={styles.fieldBox}>
                <Text style={styles.label}>Satisfactory (60 - 79)%: </Text>
                <Text style={styles.text}>{sixtyTo79[i]}</Text>
              </View>
              <View style={styles.fieldBox}>
                <Text style={styles.label}>Developing (40 - 59)%: </Text>
                <Text style={styles.text}>{fortyTo59[i]}</Text>
              </View>
              <View style={styles.fieldBox}>
                <Text style={styles.label}>Unsatisfactory (Below 40%): </Text>
                <Text style={styles.text}>{below40[i]}</Text>
              </View>
              <View style={{ ...styles.fieldBox, marginTop: "5%" }}>
                <Text style={styles.label}>Highest Score: </Text>
                <Text style={{ ...styles.text, color: "#55ff00" }}>
                  {totalStudents[i] ? value : 0}
                </Text>
              </View>
              <View style={{ ...styles.fieldBox, marginBottom: "5%" }}>
                <Text style={styles.label}>Lowest Score: </Text>
                <Text style={{ ...styles.text, color: "#ff5500" }}>
                  {totalStudents[i] ? minScore[i] : 0}
                </Text>
              </View>
            </View>
          ))}
      </ScrollView>

      <Text
        style={{
          ...styles.text,
          marginTop: "15%",
          marginBottom: omrData.setCount > 1 ? "0%" : "5%",
        }}>
        Question Analysis For All Students:
      </Text>

      {blankCount.length > 1 && (
        <View
          style={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-around",
            marginTop: "5%",
            marginBottom: "2%",
          }}>
          <Text style={styles.label}>SET: </Text>
          <RadioButton.Group
            onValueChange={newValue => {
              setCurrentPage(0);
              setIdx(parseInt(newValue));
            }}
            value={String(idx)}>
            <View
              style={{
                display: "flex",
                flexDirection: "row",
              }}>
              {blankCount.map((item, i) => (
                <View
                  key={i}
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "center",
                    width: blankCount.length > 3 ? "20%" : "30%",
                  }}>
                  <RadioButton value={i.toString()} color="#00aa5f" />
                  <Text>{setList[i]}</Text>
                </View>
              ))}
            </View>
          </RadioButton.Group>
        </View>
      )}

      <View
        style={{
          ...styles.box,
          padding: "5%",
        }}>
        <View>
          {blankCount[idx].slice(startIndex, endIndex).map((itm, j) => (
            <View key={startIndex + j} style={{ marginBottom: "3%" }}>
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                }}>
                <View style={styles.fieldBox}>
                  <Text
                    style={
                      omrData[
                        "set" + (idx + 1) + "Q" + (startIndex + j + 1)
                      ].includes("-")
                        ? { ...styles.text, color: "#ff5500", fontSize: 11 }
                        : { ...styles.text, fontSize: 11 }
                    }>
                    {startIndex + j + 1 < 10
                      ? "Q-0" + (startIndex + j + 1)
                      : "Q-" + (startIndex + j + 1)}
                  </Text>
                  <Text style={styles.text}> |</Text>
                </View>
                <View style={styles.fieldBox}>
                  <Text style={{ ...styles.label, fontSize: 11 }}>
                    correct:{" "}
                  </Text>
                  <Text style={{ ...styles.text, color: "#55ff00" }}>
                    {correctCount[idx][startIndex + j]}
                  </Text>
                </View>
                <Text style={styles.text}>-</Text>
                <View style={styles.fieldBox}>
                  <Text style={{ ...styles.label, fontSize: 11 }}>
                    {"  "}
                    wrong:
                  </Text>
                  <Text style={{ ...styles.text, color: "#ff5500" }}>
                    {" "}
                    {wrongCount[idx][startIndex + j]}
                  </Text>
                </View>
                <Text style={styles.text}>-</Text>

                <View style={styles.fieldBox}>
                  <Text style={{ ...styles.label, fontSize: 11 }}>
                    {"  "}
                    blank:
                  </Text>
                  <Text style={styles.text}> {itm}</Text>
                </View>
              </View>
            </View>
          ))}
        </View>
      </View>

      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-around",
          marginTop: "5%",
        }}>
        {currentPage > 0 && (
          <View>
            <TouchableOpacity
              onPress={handleHardPrev}
              style={{ paddingTop: "20%" }}>
              <Text
                style={{
                  color: "white",
                  fontWeight: "bold",
                  fontSize: 35,
                  transform: [{ rotate: "180deg" }],
                }}>
                {"⇶"}
              </Text>
            </TouchableOpacity>
          </View>
        )}
        {currentPage > 0 && (
          <View>
            <TouchableOpacity
              onPress={handlePrev}
              style={{ paddingTop: "20%" }}>
              <Text
                style={{
                  color: "white",
                  fontWeight: "bold",
                  fontSize: 35,
                  transform: [{ rotate: "180deg" }],
                }}>
                {"➣"}
              </Text>
            </TouchableOpacity>
          </View>
        )}
        {currentPage < totalPages - 1 && (
          <View>
            <TouchableOpacity onPress={handleNext}>
              <Text
                style={{
                  color: "white",
                  fontWeight: "bold",
                  fontSize: 35,
                }}>
                {"➣"}
              </Text>
            </TouchableOpacity>
          </View>
        )}
        {currentPage < totalPages - 1 && (
          <View>
            <TouchableOpacity onPress={handleHardNext}>
              <Text
                style={{
                  color: "white",
                  fontWeight: "bold",
                  fontSize: 35,
                }}>
                {"⇶"}
              </Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </View>
  );
};

export default AnalysisInfo;
