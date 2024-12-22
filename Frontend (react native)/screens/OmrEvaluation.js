import React, { useState, useEffect } from "react";
import {
  ScrollView,
  ActivityIndicator,
  View,
  Alert,
  ToastAndroid,
  AppState,
} from "react-native";
import FileViewer from "react-native-file-viewer";
import RNFS from "react-native-fs";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import OmrEvaluationInfo from "../components/OmrEvaluationInfo";
import styles from "../screenStyles/OmrEvaluationStyle";

const OmrEvaluation = ({ route, navigation }) => {
  const { formData, localFilePath, index, students, reports } = route.params;
  const [studentsState, setStudentsState] = useState(students);
  const [reportsState, setReportsState] = useState(reports);
  const [isLoading, setIsLoading] = useState(false);
  let [student, setStudent] = useState({});
  let [localPath, setLocalPath] = useState("");
  let [idx, setIdx] = useState(null);
  let [errorHeader, setErrorHeader] = useState("");
  let [errorFileDelete, setErrorFileDelete] = useState(false);
  const [appState, setAppState] = useState(AppState.currentState);

  useEffect(() => {
    const subscription = AppState.addEventListener(
      "change",
      async nextAppState => {
        if (
          appState.match(/inactive|background/) &&
          nextAppState === "active"
        ) {
          fetchData();
          if (errorFileDelete) {
            Alert.alert("Error!", errorHeader.replace(/\|\|/g, "\n"));
            await RNFS.unlink(localPath);
            setErrorFileDelete(false);
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
    const unsubscribe = navigation.addListener("focus", () => {
      fetchData();
    });
    return unsubscribe;
  }, [navigation]);

  const fetchData = async () => {
    // setIsLoading(true);
    try {
      const historyJson = await AsyncStorage.getItem("pdfHistory");
      const history = historyJson ? JSON.parse(historyJson) : [];
      setStudentsState(history[index].students);
      setReportsState(history[index].reports);
      // setIsLoading(false);
    } catch (error) {
      // setIsLoading(false);
      ToastAndroid.show("Error Saving History!", ToastAndroid.LONG);
      console.log("Error fetching history from local storage:", error);
    }
  };

  const openPDF = async localFilePath => {
    const directoryExists = await RNFS.exists(localFilePath);
    if (directoryExists) {
      FileViewer.open(localFilePath).catch(async error => {
        ToastAndroid.show(
          "Can't Open PDF!\n" +
            "Go Manually Open It in Your Device From This Path: " +
            localFilePath.substring(localFilePath.indexOf("Download")),
          ToastAndroid.LONG,
        );
        if (errorFileDelete) {
          Alert.alert("Error!", errorHeader.replace(/\|\|/g, "\n"));
          await RNFS.unlink(localPath);
          setErrorFileDelete(false);
        }
        console.log("Error opening PDF:", error);
      });
    } else {
      Alert.alert(
        "File Does Not Exist!",
        "Do you want to Re-Generate the file?",
        [
          {
            text: "NO",
            onPress: () => {},
            style: "cancel",
          },
          {
            text: "YES",
            onPress: () => {
              navigation.navigate("OmrGeneration", {
                omrData: formData,
                localPath: localFilePath,
                idx: index,
                students: studentsState,
                reports: reportsState,
              });
            },
          },
        ],
        { cancelable: false },
      );
    }
  };

  const convertUriToFile = async (uri, fileName, mimeType) => {
    try {
      const fileExists = await RNFS.exists(uri);
      if (!fileExists) {
        throw new Error("File does not exist at the provided URI.");
      }

      const fileBase64 = await RNFS.readFile(uri, "base64");
      const fileBlob = {
        uri: `data:${mimeType};base64,${fileBase64}`,
        name: fileName,
        type: mimeType,
      };

      return fileBlob;
    } catch (error) {
      ToastAndroid.show("An Unexpected Error Occured!", ToastAndroid.LONG);
      console.log("Error converting URI to file:", error);
      throw error;
    }
  };

  const guessMimeType = uri => {
    const extension = uri.split(".").pop().toLowerCase();
    switch (extension) {
      case "jpg":
      case "jpeg":
        return "image/jpeg";
      case "png":
        return "image/png";
      default:
        return "application/octet-stream";
    }
  };

  const saveToLocalStorage = async student => {
    const existingHistory = await AsyncStorage.getItem("pdfHistory");
    const pdfHistory = JSON.parse(existingHistory);
    idx = pdfHistory[index].students.findIndex(
      obj => obj.idno === student.idno,
    );
    setIdx(
      pdfHistory[index].students.findIndex(obj => obj.idno === student.idno),
    );
    if (idx !== -1) {
      Alert.alert(
        "StudentID: " + student.idno + " Already Evaluated!",
        "Do you want to overwrite?",
        [
          {
            text: "NO",
            onPress: async () => {
              await RNFS.unlink(student.localPath);
            },
            style: "cancel",
          },
          {
            text: "YES",
            onPress: async () => {
              await RNFS.unlink(pdfHistory[index].students[idx].localPath);
              pdfHistory[index].students[idx] = student;
              await AsyncStorage.setItem(
                "pdfHistory",
                JSON.stringify(pdfHistory),
              );
              openPDF(localPath);
            },
          },
        ],
        { cancelable: false },
      );
    } else {
      pdfHistory[index].students.push(student);
      await AsyncStorage.setItem("pdfHistory", JSON.stringify(pdfHistory));
      openPDF(localPath);
    }
  };

  const handleSubmit = async source => {
    setIsLoading(true);
    // setTimeout(() => {
    //   setIsLoading(true);
    // }, 0);

    let file1 = null;
    let file2 = null;
    file1 = await convertUriToFile(
      source[0],
      source[0].split("/").pop(),
      guessMimeType(source[0]),
    );
    if (source[1]) {
      file2 = await convertUriToFile(
        source[1],
        source[1].split("/").pop(),
        guessMimeType(source[1]),
      );
    }
    const formdata = new FormData();
    formdata.append("isRoll", formData.isRoll);
    formdata.append("rollDigit", formData.rollDigit);
    formdata.append("setCount", formData.setCount);
    formdata.append("questionsCount", formData.questionsCount);
    formdata.append("mpq", formData.mpq);
    formdata.append("isNegative", formData.isNegative);
    formdata.append("negativeMark", formData.negativeMark);
    for (let i = 1; i <= formData.setCount; i++) {
      for (let j = 1; j <= formData.questionsCount; j++) {
        formdata.append("set" + i + "Q" + j, formData["set" + i + "Q" + j]);
      }
    }
    formdata.append("file1", file1);
    formdata.append("file2", file2);
    formdata.append("regenerate", false);
    try {
      const response = await axios.post(
        "https://omrevalserver.onrender.com/upload",
        formdata,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
          responseType: "blob",
        },
      );

      if (response.data) {
        setIsLoading(false);
        errorHeader = response.headers["error"];
        setErrorHeader(response.headers["error"]);
        const marksHeader = response.headers["marks"];
        const idnoHeader = response.headers["idno"];
        const setnoHeader = response.headers["setno"];
        const markedIndexHeader = response.headers["marked_index"]
          ? JSON.parse(response.headers["marked_index"])
          : null;
        let tempObject = {
          idno: idnoHeader ? idnoHeader : "",
          name: "",
          setno: setnoHeader ? Number(setnoHeader) : 0,
          marks: marksHeader ? Number(marksHeader) : "N/A",
          file1: source[0],
          file2: source[1],
          ...Object.fromEntries(
            new Array(formData.questionsCount)
              .fill(null)
              .map((_, i) => [
                `Q${i + 1}`,
                markedIndexHeader ? markedIndexHeader[i].toString() : "0",
              ]),
          ),
        };
        setStudent(prevStudent => ({
          ...prevStudent,
          tempObject,
        }));
        student = tempObject;
        const lastIndex = localFilePath.lastIndexOf("/");
        const customDirectoryPath = localFilePath.substring(0, lastIndex);
        const directoryExists = await RNFS.exists(customDirectoryPath);
        if (!directoryExists) {
          await RNFS.mkdir(customDirectoryPath);
        }
        const time = new Date().getTime();
        localPath = `${customDirectoryPath}/RESULT_${time}.pdf`;
        setLocalPath(`${customDirectoryPath}/RESULT_${time}.pdf`);
        const reader = new FileReader();
        reader.readAsDataURL(response.data);
        reader.onloadend = () => {
          const base64data = reader.result;
          const base64WithoutPrefix = base64data.split(",")[1];
          RNFS.writeFile(localPath, base64WithoutPrefix, "base64")
            .then(async () => {
              setStudent(prevStudent => ({
                ...prevStudent,
                localPath: localPath,
              }));
              student.localPath = localPath;
              if (Number(idnoHeader) == -1 || errorHeader) {
                openPDF(localPath);
                if (errorHeader && errorHeader.includes("Page")) {
                  errorFileDelete = true;
                  setErrorFileDelete(true);
                } else {
                  navigation.navigate("StudentInformation", {
                    formData,
                    localFilePath,
                    index,
                    student,
                    idx,
                    allowBack: false,
                    msg: errorHeader
                      ? errorHeader
                      : "Please Manully Enter Student Name!",
                  });
                }
              } else if (marksHeader) {
                saveToLocalStorage(student);
              } else {
                ToastAndroid.show("Error Evaluating!", ToastAndroid.LONG);
              }
            })
            .catch(err => {
              setIsLoading(false);
              ToastAndroid.show("Can't Save PDF!", ToastAndroid.LONG);
              console.log("Can't Write File: ", err.message);
            });
        };
      } else {
        setIsLoading(false);
        ToastAndroid.show("No Response!", ToastAndroid.LONG);
        console.log("No Response");
      }
    } catch (error) {
      setIsLoading(false);
      ToastAndroid.show("Error Getting PDF!", ToastAndroid.LONG);
      console.log("Error fetching PDF:", error);
    }
  };

  return (
    <ScrollView
      contentContainerStyle={{
        flexGrow: 1,
      }}>
      {isLoading ? (
        <View style={styles.loader}>
          <ActivityIndicator size="large" color="#007bff" />
        </View>
      ) : (
        <View style={styles.container}>
          <OmrEvaluationInfo
            omrData={formData}
            localFilePath={localFilePath}
            index={index}
            students={studentsState}
            reports={reportsState}
            navigation={navigation}
            openPDF={openPDF}
            handleSubmit={handleSubmit}
          />
        </View>
      )}
    </ScrollView>
  );
};

export default OmrEvaluation;
