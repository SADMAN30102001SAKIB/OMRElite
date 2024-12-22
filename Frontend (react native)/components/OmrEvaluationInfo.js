import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Dimensions,
} from "react-native";
import { launchCamera, launchImageLibrary } from "react-native-image-picker";
import styles from "../componentStyles/OmrEvaluationInfoStyle";

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
  const screenWidth = Dimensions.get("window").width;
  const wqCaseArr = [
    "If filled, get (0)mark. If left blank, get (0)mark",
    "If filled, get (" +
      omrData.mpq +
      ")mark. If left blank, get (" +
      omrData.mpq +
      ")mark",
    "If filled, get (0)mark. If left blank, get (" + omrData.mpq + ")mark",
    "If filled, get (" +
      omrData.negativeMark +
      ")mark. If left blank, get (0)mark",
    "If filled, get (" +
      omrData.negativeMark +
      ")mark. If left blank, get (" +
      omrData.mpq +
      ")mark",
  ];
  const [showBox, setShowBox] = useState(false);
  const source = [];
  const setList = ["A", "B", "C", "D"];
  const list = [0, 0, 0, 0];
  let count = new Array(omrData.setCount).fill(0);

  for (let i = 1; i <= omrData.setCount; i++) {
    for (let j = 1; j <= omrData.questionsCount; j++) {
      if (Number(omrData["set" + i + "Q" + j]) < 0) {
        count[i - 1]++;
      }
      if (
        omrData["set" + i + "Q" + j].length > 1 &&
        !omrData["set" + i + "Q" + j].includes("-")
      ) {
        list[i - 1]++;
      }
    }
  }

  const pickImage = (takeSecondPicture = false) => {
    const options = {
      mediaType: "photo",
      quality: 1,
    };

    const handleGalleryResponse = response => {
      if (response.didCancel) {
        console.log("User cancelled image picker");
      } else if (response.error) {
        console.log("ImagePicker Error: ", response.error);
      } else if (response.customButton) {
        console.log("User tapped custom button: ", response.customButton);
      } else {
        source.push(response.assets[0].uri);
        if (omrData.questionsCount > 35 && !takeSecondPicture) {
          console.log("Picking a second image...");
          pickImage(true);
        }

        if (
          (omrData.questionsCount > 35 && source.length == 2) ||
          (omrData.questionsCount <= 35 && source.length == 1)
        ) {
          handleSubmit(source);
        }
      }
    };

    launchImageLibrary(options, handleGalleryResponse);
  };

  const takePicture = (takeSecondPicture = false) => {
    const options = {
      mediaType: "photo",
      quality: 1,
      saveToPhotos: true,
    };

    const handleCameraResponse = response => {
      if (response.didCancel) {
        console.log("User cancelled camera");
      } else if (response.error) {
        console.log("Camera Error: ", response.error);
      } else if (response.customButton) {
        console.log("User tapped custom button: ", response.customButton);
      } else {
        source.push(response.assets[0].uri);
        if (omrData.questionsCount > 35 && !takeSecondPicture) {
          console.log("Taking a second picture...");
          takePicture(true);
        }

        if (
          (omrData.questionsCount > 35 && source.length == 2) ||
          (omrData.questionsCount <= 35 && source.length == 1)
        ) {
          handleSubmit(source);
        }
      }
    };

    launchCamera(options, handleCameraResponse);
  };

  const debug = async () => {
    for (let i = 1; i <= omrData.setCount; i++) {
      for (let j = 1; j <= omrData.questionsCount; j++) {
        console.log("set" + i + "Q" + j, omrData["set" + i + "Q" + j]);
      }
    }
    console.log("questionsCount:", omrData.questionsCount);
    console.log("setCount:", omrData.setCount);
    console.log("wqCase:", omrData.wqCase);
    console.log("isRoll:", omrData.isRoll);
    console.log("rollDigit:", omrData.rollDigit);
    console.log("mpq:", omrData.mpq);
    console.log("isNegative:", omrData.isNegative);
    console.log("negativeMark:", omrData.negativeMark);
    console.log("\nStudents:\n", students);
    console.log("\nReports:\n", reports);
  };

  return (
    <View style={styles.container}>
      <View style={styles.topBox}>
        <View
          style={{
            borderTopLeftRadius: 10,
            borderTopRightRadius: 10,
            padding: "3%",
            backgroundColor: "#050505",
          }}>
          <Text style={styles.label}>Institution Name: </Text>
          <Text
            style={{
              ...styles.text,
              textDecorationLine: omrData.isIUnderline ? "underline" : "none",
            }}>
            {omrData.iName}
          </Text>
        </View>

        <View
          style={{
            marginBottom: "5%",
            borderBottomLeftRadius: 10,
            borderBottomRightRadius: 10,
            padding: "3%",
            backgroundColor: "#050505",
          }}>
          <Text style={styles.label}>Exam Name: </Text>
          <Text
            style={{
              ...styles.text,
              textDecorationLine: omrData.isPUnderline ? "underline" : "none",
            }}>
            {omrData.pName}
          </Text>
        </View>

        <View style={styles.fieldBox}>
          <Text style={styles.label}>Name Field: </Text>
          <Text
            style={
              omrData.isName
                ? { ...styles.text, color: "#55ff00" }
                : { ...styles.text, color: "#ff5500" }
            }>
            {omrData.isName ? "YES" : "NO"}
          </Text>
        </View>

        {omrData.isRoll ? (
          <View style={styles.fieldBox}>
            <Text style={styles.label}>ID Digits: </Text>
            <Text style={styles.text}>{omrData.rollDigit}</Text>
          </View>
        ) : (
          <View style={styles.fieldBox}>
            <Text style={styles.label}>ID Field: </Text>
            <Text style={{ ...styles.text, color: "#ff5500" }}>NO</Text>
          </View>
        )}

        <View style={styles.fieldBox}>
          <Text style={styles.label}>Number of Sets: </Text>
          <Text style={styles.text}>
            {omrData.setCount > 1 ? omrData.setCount : "None"}
          </Text>
        </View>

        <View style={styles.fieldBox}>
          <Text style={styles.label}>Number of Questions: </Text>
          <Text style={styles.text}>{omrData.questionsCount}</Text>
        </View>
        <View style={{ ...styles.buttonGroup, justifyContent: "space-evenly" }}>
          <View style={{ ...styles.button, marginLeft: "5%" }}>
            <TouchableOpacity
              style={{
                ...styles.submitButton,
                backgroundColor: "#00ff5f",
              }}
              onPress={() =>
                navigation.navigate("OmrGeneration", {
                  omrData,
                  localPath: localFilePath,
                  idx: index,
                  students,
                  reports,
                })
              }>
              <Text
                style={{
                  ...styles.submitButtonText,
                  color: "black",
                }}>
                Edit
              </Text>
            </TouchableOpacity>
          </View>
          <View style={{ ...styles.button, marginRight: "15%" }}>
            <TouchableOpacity
              onPress={() => openPDF(localFilePath)}
              style={{ ...styles.submitButton, backgroundColor: "white" }}>
              <Text style={{ ...styles.submitButtonText, color: "black" }}>
                Open OMR
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {showBox || students.length ? (
        <View>
          <Text
            style={{
              ...styles.text,
              marginTop: "5%",
              marginLeft: "1.5%",
              fontSize: 15,
            }}>
            Evaluate with
            {omrData.questionsCount > 35
              ? " 2 pictures (in order)"
              : " 1 picture"}
            :
          </Text>
          <View
            style={{
              ...styles.buttonGroup,
              ...styles.topBox,
              paddingTop: "0%",
              paddingBottom: "5%",
            }}>
            <View style={styles.button}>
              <TouchableOpacity
                style={{
                  ...styles.submitButton,
                  backgroundColor: "#ee6f2f",
                }}
                onPress={() => takePicture()}>
                <Text style={{ ...styles.submitButtonText, color: "white" }}>
                  Camera
                </Text>
              </TouchableOpacity>
            </View>
            <View style={styles.button}>
              <TouchableOpacity
                style={{
                  ...styles.submitButton,
                  backgroundColor: "#2f6fee",
                }}
                onPress={() => pickImage()}>
                <Text style={{ ...styles.submitButtonText, color: "white" }}>
                  Gallery
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      ) : (
        <View style={styles.button}>
          <TouchableOpacity
            style={{
              ...styles.submitButton,
              backgroundColor: "#ee6f2f",
              borderRadius: 10,
              borderWidth: 2,
              borderColor: "white",
              borderStyle: "dotted",
            }}
            onPress={() => setShowBox(true)}>
            <Text
              style={{
                ...styles.submitButtonText,
                color: "white",
              }}>
              Evaluate
            </Text>
          </TouchableOpacity>
        </View>
      )}

      <Text
        style={{
          ...styles.text,
          marginTop: "15%",
          marginLeft: "1.5%",
          fontSize: 13,
        }}>
        Scroll Horizontally For More Options ➤
      </Text>
      <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
        <View style={{ width: screenWidth - 40, marginRight: 10 }}>
          <Text style={{ ...styles.text, marginTop: "1%" }}>Answer Sheet:</Text>
          <View style={styles.box}>
            <View>
              {count.map((item, i) => (
                <View key={i} style={{ marginBottom: "10%" }}>
                  {omrData.setCount > 1 && (
                    <Text style={styles.text}>SET {setList[i]}:</Text>
                  )}
                  <View
                    style={{
                      flexDirection: "row",
                      justifyContent: "space-between",
                    }}>
                    <View style={styles.fieldBox}>
                      <Text style={styles.label}>Ans Exist: </Text>
                      <Text style={styles.text}>
                        {omrData.questionsCount - item}
                      </Text>
                    </View>
                    <Text style={styles.text}>|</Text>
                    <View style={styles.fieldBox}>
                      <Text style={styles.label}>No-Ans: </Text>
                      <Text style={{ ...styles.text, color: "#ff5500" }}>
                        {item}
                      </Text>
                    </View>
                  </View>
                  <View style={styles.fieldBox}>
                    <Text style={styles.label}> Single-Ans: </Text>
                    <Text style={{ ...styles.text, color: "#55ff00" }}>
                      {omrData.questionsCount - item - list[i]}
                    </Text>
                  </View>
                  <View style={styles.fieldBox}>
                    <Text style={styles.label}> Multiple-Ans: </Text>
                    <Text style={{ ...styles.text, color: "#ffff00" }}>
                      {list[i]}
                    </Text>
                  </View>
                </View>
              ))}
            </View>

            <View style={styles.button}>
              <TouchableOpacity
                style={styles.submitButton}
                onPress={() =>
                  navigation.navigate("AnswerSheet", {
                    omrData,
                    localFilePath,
                    index,
                    students,
                    reports,
                  })
                }>
                <Text style={styles.submitButtonText}>Edit</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
        <View style={{ width: screenWidth - 40 }}>
          <Text style={{ ...styles.text, marginTop: "1%" }}>Exam Marking:</Text>
          <View style={styles.box}>
            <View style={styles.fieldBox}>
              <Text style={styles.label}>Marks Per Question: </Text>
              <Text style={{ ...styles.text, color: "#55ff00" }}>
                +{omrData.mpq}
              </Text>
            </View>

            <View style={{ marginBottom: "5%" }}>
              <Text style={styles.label}>No-Ans Condition: </Text>
              <Text style={styles.text}>{wqCaseArr[omrData.wqCase - 1]}</Text>
            </View>

            <View style={styles.fieldBox}>
              <Text style={styles.label}>Negative Marking: </Text>
              <Text style={styles.text}>
                {omrData.isNegative ? "YES" : "NO"}
              </Text>
            </View>

            {omrData.isNegative ? (
              <View style={styles.fieldBox}>
                <Text style={styles.label}>Negative Mark Per Mistake: </Text>
                <Text style={{ ...styles.text, color: "#ff5500" }}>
                  {omrData.negativeMark}
                </Text>
              </View>
            ) : null}

            <View style={styles.button}>
              <TouchableOpacity
                style={styles.submitButton}
                onPress={() =>
                  navigation.navigate("ExamMarking", {
                    omrData,
                    localFilePath,
                    index,
                    students,
                    reports,
                  })
                }>
                <Text style={styles.submitButtonText}>Edit</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </ScrollView>

      {/* <View style={styles.button}>
        <TouchableOpacity
          style={{
            ...styles.submitButton,
            backgroundColor: "white",
            borderWidth: 1,
            borderRadius: 15,
            borderStyle: "dashed",
            borderColor: "black",
          }}
          onPress={() => debug()}>
          <Text style={{ ...styles.submitButtonText, color: "black" }}>
            Debug
          </Text>
        </TouchableOpacity>
      </View> */}

      <View style={{ ...styles.buttonGroup, marginTop: "10%" }}>
        <View style={styles.button}>
          <TouchableOpacity
            style={{
              ...styles.submitButton,
              borderWidth: 1,
              borderRadius: 15,
              borderStyle: "dashed",
              borderColor: "white",
            }}
            onPress={() => {
              navigation.navigate("ReportHistory", {
                formData: omrData,
                localFilePath,
                index,
                students,
              });
            }}>
            <Text style={{ ...styles.submitButtonText }}>Reports</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.button}>
          <TouchableOpacity
            style={{
              ...styles.submitButton,
              borderWidth: 1,
              borderRadius: 15,
              borderStyle: "dashed",
              borderColor: "white",
            }}
            onPress={() => {
              navigation.navigate("Analysis", {
                formData: omrData,
                students,
              });
            }}>
            <Text style={{ ...styles.submitButtonText }}>Analysis</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.button}>
        <TouchableOpacity
          style={{
            ...styles.submitButton,
            borderWidth: 1,
            borderRadius: 15,
            borderStyle: "dashed",
            borderColor: "white",
            backgroundColor: "#ee6f2f",
            marginLeft: "2%",
            marginTop: "5%",
          }}
          onPress={() => {
            navigation.navigate("StudentHistory", {
              formData: omrData,
              localFilePath,
              index,
              students,
            });
          }}>
          <Text style={{ ...styles.submitButtonText }}>
            Student Evaluation History
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default OmrEvaluationInfo;
