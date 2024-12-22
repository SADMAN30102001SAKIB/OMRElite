import React, { useState } from "react";
import { View, Text, TouchableOpacity, Alert } from "react-native";
import { launchCamera, launchImageLibrary } from "react-native-image-picker";
import RNFS from "react-native-fs";
import styles from "../componentStyles/OmrEvaluationInfoStyle";

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
  const list = ["A", "B", "C", "D"];
  const source = [];
  let touched = 0,
    correct = 0,
    wrong = 0,
    multiple = 0,
    negativeMark = omrData.isNegative ? omrData.negativeMark : 0;

  const compareStrings = (mainString, subString) => {
    for (let i = 0; i < subString.length; i++) {
      if (mainString.includes("-") || !mainString.includes(subString[i])) {
        return false;
      }
    }
    return true;
  };

  for (let i = 1; i <= omrData.questionsCount; i++) {
    if (Number(student["Q" + i])) {
      touched++;
    }
    if (student["Q" + i].length > 1) {
      multiple++;
    }
    if (
      Number(student["Q" + i]) &&
      !compareStrings(
        omrData["set" + student.setno + "Q" + i],
        student["Q" + i],
      )
    ) {
      wrong++;
    }
    if (
      compareStrings(omrData["set" + student.setno + "Q" + i], student["Q" + i])
    ) {
      correct++;
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

  const debug = () => {
    for (let j = 1; j <= omrData.questionsCount; j++) {
      console.log("Q" + j, student["Q" + j]);
    }
    console.log("ID:", student.idno);
    console.log("Name:", student.name);
    console.log("SET:", student.setno);
    console.log("Score:", student.marks);
    console.log("file1:", student.file1);
    console.log("file2:", student.file2);
  };

  return (
    <View style={styles.container}>
      <View style={styles.topBox}>
        {omrData.isRoll ? (
          <View
            style={
              omrData.isName
                ? {
                    borderTopLeftRadius: 10,
                    borderTopRightRadius: 10,
                    padding: "3%",
                    backgroundColor: "#050505",
                  }
                : {
                    borderRadius: 10,
                    padding: "3%",
                    backgroundColor: "#050505",
                  }
            }>
            <Text style={styles.label}>Student ID: </Text>
            <Text style={styles.text}>{student.idno}</Text>
          </View>
        ) : null}

        {omrData.isName || !omrData.isRoll ? (
          <View
            style={
              omrData.isRoll
                ? {
                    marginBottom: "5%",
                    borderBottomLeftRadius: 10,
                    borderBottomRightRadius: 10,
                    padding: "3%",
                    backgroundColor: "#050505",
                  }
                : {
                    marginBottom: "5%",
                    borderRadius: 10,
                    padding: "3%",
                    backgroundColor: "#050505",
                  }
            }>
            <Text style={styles.label}>Student Name: </Text>
            <Text style={styles.text}>{student.name}</Text>
          </View>
        ) : null}

        {omrData.setCount > 1 ? (
          <View style={styles.fieldBox}>
            <Text style={styles.label}>SET: </Text>
            <Text style={styles.text}>{list[student.setno - 1]}</Text>
          </View>
        ) : null}

        <View style={styles.fieldBox}>
          <Text style={styles.label}>Score: </Text>
          <Text style={styles.text}>{student.marks}</Text>
        </View>

        <View style={styles.buttonGroup}>
          <View style={{ ...styles.button, marginRight: "28%" }}>
            <TouchableOpacity
              style={{
                ...styles.submitButton,
                backgroundColor: "#00ff5f",
              }}
              onPress={() =>
                navigation.navigate("StudentInformation", {
                  formData: omrData,
                  localFilePath,
                  index,
                  student,
                  idx,
                  allowBack: true,
                  msg: "",
                })
              }>
              <Text style={{ ...styles.submitButtonText, color: "black" }}>
                Edit
              </Text>
            </TouchableOpacity>
          </View>
          <View style={{ ...styles.button, marginRight: "11%" }}>
            <TouchableOpacity
              style={{ ...styles.submitButton, backgroundColor: "white" }}
              onPress={openPDF}>
              <Text style={{ ...styles.submitButtonText, color: "black" }}>
                Open OMR
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {showBox ? (
        <View>
          <Text
            style={{
              ...styles.text,
              marginTop: "5%",
              marginLeft: "1.5%",
            }}>
            Take
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
        <View>
          <Text
            style={{
              ...styles.text,
              marginTop: "5%",
              marginLeft: "1.5%",
              fontSize: 11,
            }}>
            Picture To Use For Re-Generating PDF Result:
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
                  borderRadius: 10,
                  borderWidth: 2,
                  borderColor: "white",
                  borderStyle: "dotted",
                }}
                onPress={async () => {
                  const directoryExists1 = await RNFS.exists(student.file1);
                  const directoryExists2 = await RNFS.exists(
                    student.file2 ? student.file2 : "",
                  );
                  if (
                    (omrData.questionsCount > 35 &&
                      directoryExists1 &&
                      directoryExists2) ||
                    (omrData.questionsCount <= 35 && directoryExists1)
                  ) {
                    handleSubmit(source);
                  } else {
                    Alert.alert(
                      "No Previous Saved Picture Found!",
                      "Please Re-Generate With New Pictures.",
                    );
                    setShowBox(true);
                  }
                }}>
                <Text
                  style={{
                    ...styles.submitButtonText,
                    color: "white",
                  }}>
                  Previous
                </Text>
              </TouchableOpacity>
            </View>
            <View style={styles.button}>
              <TouchableOpacity
                style={{
                  ...styles.submitButton,
                  borderRadius: 10,
                  backgroundColor: "#ee6f2f",
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
                  New
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      )}

      <Text
        style={{
          ...styles.text,
          marginTop: "10%",
          marginLeft: "1.5%",
        }}>
        Analysis:
      </Text>
      <View style={styles.box}>
        <View style={{ ...styles.fieldBox, marginBottom: "5%" }}>
          <Text style={styles.label}>Touched Questions: </Text>
          <Text style={styles.text}>{touched}</Text>
        </View>
        <View style={{ ...styles.fieldBox, marginBottom: "5%" }}>
          <Text style={styles.label}>Blank Answers: </Text>
          <Text style={styles.text}>{omrData.questionsCount - touched}</Text>
        </View>
        <View style={{ ...styles.fieldBox, marginBottom: "5%" }}>
          <Text style={styles.label}>Correct Answers: </Text>
          <Text
            style={
              correct
                ? { ...styles.text, color: "#55ff00" }
                : { ...styles.text }
            }>
            {correct}
          </Text>
        </View>
        <View style={{ ...styles.fieldBox, marginBottom: "5%" }}>
          <Text style={styles.label}>Marks For Correct Answer: </Text>

          {omrData.mpq * correct ? (
            <Text style={{ ...styles.text, color: "#55ff00" }}>
              +{omrData.mpq * correct}
            </Text>
          ) : (
            <Text style={styles.text}>{omrData.mpq * correct}</Text>
          )}
        </View>
        <View style={{ ...styles.fieldBox, marginBottom: "5%" }}>
          <Text style={styles.label}>Additional Marks: </Text>

          {student.marks - (omrData.mpq * correct + wrong * negativeMark) ? (
            <Text style={{ ...styles.text, color: "#55ff00" }}>
              +{student.marks - (omrData.mpq * correct + wrong * negativeMark)}
            </Text>
          ) : (
            <Text style={styles.text}>0</Text>
          )}
        </View>
        <View style={{ ...styles.fieldBox, marginBottom: "5%" }}>
          <Text style={styles.label}>Wrong Answers: </Text>

          <Text
            style={
              wrong ? { ...styles.text, color: "#ff5500" } : { ...styles.text }
            }>
            {wrong}
          </Text>
        </View>
        <View style={{ ...styles.fieldBox, marginBottom: "5%" }}>
          <Text style={styles.label}>Multiple Answers Marked: </Text>

          <Text
            style={
              multiple
                ? { ...styles.text, color: "#ff5500" }
                : { ...styles.text }
            }>
            {multiple}
          </Text>
        </View>

        {omrData.isNegative}
        <View style={styles.fieldBox}>
          <Text style={styles.label}>Total Negative Marking: </Text>

          <Text
            style={
              wrong * negativeMark
                ? { ...styles.text, color: "#ff5500" }
                : { ...styles.text }
            }>
            {wrong * negativeMark}
          </Text>
        </View>
      </View>

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
    </View>
  );
};

export default StudentEvaluationInfo;
