import React, { useState, useEffect } from "react";
import { BackHandler, Alert, AppState, ScrollView } from "react-native";
import RNFS from "react-native-fs";
import AsyncStorage from "@react-native-async-storage/async-storage";
import StudentInformationForm from "../components/StudentInformationForm";

const StudentInformation = ({ route, navigation }) => {
  let { formData, localFilePath, index, student, idx, allowBack, msg } =
    route.params;
  let [studentData, setstudentData] = useState(student);
  const [appState, setAppState] = useState(AppState.currentState);

  useEffect(() => {
    if (!allowBack) {
      Alert.alert("", msg.replace(/\|\|/g, "\n"));
    }
  }, []);

  useEffect(() => {
    const subscription = AppState.addEventListener(
      "change",
      async nextAppState => {
        if (
          appState.match(/inactive|background/) &&
          nextAppState === "active"
        ) {
          if (!allowBack) {
            Alert.alert("", msg.replace(/\|\|/g, "\n"));
          }
        }
        setAppState(nextAppState);
      },
    );

    return () => {
      subscription.remove();
    };
  }, [appState]);

  useEffect(() => {
    const backAction = () => {
      if (!allowBack) {
        Alert.alert("Go Back Without Saving?", msg.replace(/\|\|/g, "\n"), [
          {
            text: "Stay",
            onPress: () => {},
            style: "cancel",
          },
          {
            text: "Go Back",
            onPress: async () => {
              (await RNFS.exists(studentData.localPath)) &&
                (await RNFS.unlink(studentData.localPath));
              navigation.goBack();
            },
          },
        ]);
        return true;
      } else {
        return false;
      }
    };

    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      () => {
        const shouldPreventBack = backAction();
        return shouldPreventBack;
      },
    );

    return () => backHandler.remove();
  }, [studentData, allowBack, navigation]);

  const handleInputChange = (name, value) => {
    setstudentData(prevState => ({
      ...prevState,
      [name]: value,
    }));
  };

  const calculateMarks = () => {
    studentData.marks = 0;
    const compareStrings = (mainString, subString) => {
      for (let i = 0; i < subString.length; i++) {
        if (!mainString.includes(subString[i])) {
          return false;
        }
      }
      return true;
    };

    for (let i = 1; i <= formData.questionsCount; i++) {
      if (Number(formData["set" + studentData.setno + "Q" + i]) > 0) {
        if (Number(studentData["Q" + i])) {
          if (
            !compareStrings(
              formData["set" + studentData.setno + "Q" + i],
              studentData["Q" + i],
            )
          ) {
            if (formData.isNegative) {
              studentData.marks += formData.negativeMark;
            }
          } else {
            studentData.marks += formData.mpq;
          }
        }
      } else {
        if (Number(studentData["Q" + i])) {
          if (Number(formData["set" + studentData.setno + "Q" + i]) == -2) {
            studentData.marks += formData.mpq;
          }
          if (
            Number(formData["set" + studentData.setno + "Q" + i]) == -4 ||
            Number(formData["set" + studentData.setno + "Q" + i]) == -5
          ) {
            studentData.marks += formData.negativeMark;
          }
        } else {
          if (
            Number(formData["set" + studentData.setno + "Q" + i]) == -2 ||
            Number(formData["set" + studentData.setno + "Q" + i]) == -3 ||
            Number(formData["set" + studentData.setno + "Q" + i]) == -5
          ) {
            studentData.marks += formData.mpq;
          }
        }
      }
    }
  };

  const saveToLocalStorage = async () => {
    let foundIdx;
    const existingHistory = await AsyncStorage.getItem("pdfHistory");
    const pdfHistory = JSON.parse(existingHistory);

    if (
      (formData.isRoll && Number(studentData.idno) == Number(student.idno)) ||
      (!formData.isRoll && studentData.name.trim() == student.name.trim())
    ) {
      calculateMarks();
      idx != null
        ? (pdfHistory[index].students[idx] = studentData)
        : pdfHistory[index].students.push(studentData);
      await AsyncStorage.setItem("pdfHistory", JSON.stringify(pdfHistory));
      if (allowBack) {
        Alert.alert(
          "",
          "If you've change any data, it's a good idea to update this student's \"Result PDF\" by Re-Generating!",
        );
        navigation.navigate("StudentEvaluation", {
          formData,
          localFilePath,
          index,
          student: studentData,
          idx,
        });
      } else {
        navigation.navigate("OmrEvaluation", {
          formData,
          localFilePath,
          index,
          students: pdfHistory[index].students,
          reports: pdfHistory[index].reports,
        });
      }
    } else {
      if (!formData.isRoll) {
        foundIdx = pdfHistory[index].students.findIndex(
          obj => obj.name.trim() === studentData.name.trim(),
        );
      } else {
        foundIdx = pdfHistory[index].students.findIndex(
          obj => Number(obj.idno) === Number(studentData.idno),
        );
      }

      if (foundIdx !== -1) {
        Alert.alert(
          "Student Already Evaluated!",
          "Do you want to overwrite?",
          [
            {
              text: "NO",
              onPress: async () => null,
              style: "cancel",
            },
            {
              text: "YES",
              onPress: async () => {
                let path = pdfHistory[index].students[foundIdx].localPath;
                (await RNFS.exists(path)) && (await RNFS.unlink(path));
                calculateMarks();
                pdfHistory[index].students[foundIdx] = studentData;
                idx != null && pdfHistory[index].students.splice(idx, 1);
                await AsyncStorage.setItem(
                  "pdfHistory",
                  JSON.stringify(pdfHistory),
                );
                if (allowBack) {
                  Alert.alert(
                    "",
                    "If you've change any data, it's a good idea to update this student's \"Result PDF\" by Re-Generating!",
                  );
                  navigation.navigate("StudentEvaluation", {
                    formData,
                    localFilePath,
                    index,
                    student: studentData,
                    idx: idx
                      ? idx < foundIdx
                        ? foundIdx - 1
                        : foundIdx
                      : foundIdx,
                  });
                } else {
                  navigation.navigate("OmrEvaluation", {
                    formData,
                    localFilePath,
                    index,
                    students: pdfHistory[index].students,
                    reports: pdfHistory[index].reports,
                  });
                }
              },
            },
          ],
          { cancelable: false },
        );
      } else {
        calculateMarks();
        idx != null
          ? (pdfHistory[index].students[idx] = studentData)
          : pdfHistory[index].students.push(studentData);
        await AsyncStorage.setItem("pdfHistory", JSON.stringify(pdfHistory));
        if (allowBack) {
          Alert.alert(
            "",
            "If you've change any data, it's a good idea to update this student's \"Result PDF\" by Re-Generating!",
          );
          navigation.navigate("StudentEvaluation", {
            formData,
            localFilePath,
            index,
            student: studentData,
            idx: idx ? idx : pdfHistory[index].students.length - 1,
          });
        } else {
          navigation.navigate("OmrEvaluation", {
            formData,
            localFilePath,
            index,
            students: pdfHistory[index].students,
            reports: pdfHistory[index].reports,
          });
        }
      }
    }
  };

  const handleSave = async () => {
    if (
      (!formData.isRoll && !studentData.name.trim()) ||
      (formData.isRoll &&
        (isNaN(studentData.idno) ||
          studentData.idno.length != formData.rollDigit ||
          Number(studentData.idno) < 0)) ||
      studentData.idno.includes("+") ||
      !studentData.setno
    ) {
      Alert.alert("", "Please Input Carefully!");
      return;
    }

    try {
      saveToLocalStorage();
    } catch (error) {
      console.log("Error saving to local storage:", error);
    }
  };

  return (
    <ScrollView
      contentContainerStyle={{
        flexGrow: 1,
        justifyContent: "space-between",
      }}>
      <StudentInformationForm
        formData={formData}
        studentData={studentData}
        handleInputChange={handleInputChange}
        handleSave={handleSave}
      />
    </ScrollView>
  );
};

export default StudentInformation;
