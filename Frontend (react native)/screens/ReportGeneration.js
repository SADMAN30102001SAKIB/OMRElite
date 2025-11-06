import React, { useState, useEffect } from "react";
import {
  ActivityIndicator,
  View,
  Alert,
  ScrollView,
  ToastAndroid,
} from "react-native";
import FileViewer from "react-native-file-viewer";
import RNFS from "react-native-fs";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import ReportGenerationForm from "../components/ReportGenerationForm";
import {
  checkStoragePermissions,
  requestStoragePermissions,
} from "../utils/permissions";

const ReportGeneration = ({ route, navigation }) => {
  const { omrData, localPath, index, students } = route.params;
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    isSerial: true,
    isID: omrData.isRoll,
    isName: omrData.isName || !omrData.isRoll,
    isSet: omrData.setCount > 1,
    sortBy: "set",
    isLeftAddionalData: true,
    totalSet: omrData.setCount > 1 ? "A" : "none",
    rEmail: "",
  });

  useEffect(() => {
    if (!students.length) {
      Alert.alert("Attention", "There are no students");
    }
  }, []);

  const handleInputChange = (name, value) => {
    setFormData(prevState => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = async () => {
    // Check permissions before file operations
    const hasPermissions = await checkStoragePermissions();
    if (!hasPermissions) {
      const granted = await requestStoragePermissions();
      if (!granted) {
        Alert.alert(
          "Permission Required",
          "Storage permission is required to generate reports.",
        );
        return;
      }
    }

    const formdata = {};
    formdata["institute_name"] = omrData.iName;
    formdata["paper_name"] = omrData.pName;
    formdata["isSerial"] = formData.isSerial;
    formdata["isID"] = formData.isID;
    formdata["isName"] = formData.isName;
    formdata["isSet"] = formData.isSet;
    formdata["sortBy"] = formData.sortBy;
    formdata["isLeftAddionalData"] = formData.isLeftAddionalData;
    formdata["totalSet"] = formData.totalSet;

    let tempObj = {
      iName: omrData.iName,
      pName: omrData.pName,
      isSerial: formData.isSerial,
      isID: formData.isID,
      isName: formData.isName,
      isSet: formData.isSet,
      sortBy: formData.sortBy,
      isLeftAddionalData: formData.isLeftAddionalData,
      totalSet: formData.totalSet,
    };

    let newTotalSet =
      formData.totalSet != "none"
        ? formData.totalSet
            .replace(
              /[ABCD]/g,
              match => ({ A: "1", B: "2", C: "3", D: "4" }[match]),
            )
            .split("")
            .sort()
            .join("")
        : "1";

    let setStudent1 = 0;
    let setStudent2 = 0;
    let setStudent3 = 0;
    let setStudent4 = 0;
    const totalMarks = omrData.questionsCount * omrData.mpq;
    let above80 = 0;
    let sixtyTo79 = 0;
    let fortyTo59 = 0;
    let below40 = 0;
    let totalStudents = 0;
    let k = 0;

    for (let i = 0; i < newTotalSet.length; i++) {
      for (let j = 0; j < students.length; j++) {
        if (students[j].setno == newTotalSet[i]) {
          if (i == 0) {
            setStudent1++;
          } else if (i == 1) {
            setStudent2++;
          } else if (i == 2) {
            setStudent3++;
          } else {
            setStudent4++;
          }

          k++;
          formdata["roll_number" + k] = Number(students[j].idno);
          formdata["name" + k] = students[j].name;
          formdata["set" + k] = ["A", "B", "C", "D"][
            Number(students[j].setno) - 1
          ];
          formdata["mark" + k] = Number(students[j].marks);

          tempObj["roll_number" + k] = Number(students[j].idno);
          tempObj["name" + k] = students[j].name;
          tempObj["set" + k] = ["A", "B", "C", "D"][
            Number(students[j].setno) - 1
          ];
          tempObj["mark" + k] = Number(students[j].marks);

          totalStudents++;
          if (students[j].marks >= totalMarks * 0.8) {
            above80++;
          } else if (students[j].marks >= totalMarks * 0.6) {
            sixtyTo79++;
          } else if (students[j].marks >= totalMarks * 0.4) {
            fortyTo59++;
          } else {
            below40++;
          }
        }
      }
    }

    above80 =
      above80 +
      " (" +
      ((above80 / (totalStudents ? totalStudents : 1)) * 100).toFixed(2) +
      "%)";
    sixtyTo79 =
      sixtyTo79 +
      " (" +
      ((sixtyTo79 / (totalStudents ? totalStudents : 1)) * 100).toFixed(2) +
      "%)";
    fortyTo59 =
      fortyTo59 +
      " (" +
      ((fortyTo59 / (totalStudents ? totalStudents : 1)) * 100).toFixed(2) +
      "%)";
    below40 =
      below40 +
      " (" +
      ((below40 / (totalStudents ? totalStudents : 1)) * 100).toFixed(2) +
      "%)";

    formdata["setStudent1"] = setStudent1;
    formdata["setStudent2"] = setStudent2;
    formdata["setStudent3"] = setStudent3;
    formdata["setStudent4"] = setStudent4;
    formdata["above80"] = above80;
    formdata["sixtyTo79"] = sixtyTo79;
    formdata["fortyTo59"] = fortyTo59;
    formdata["below40"] = below40;

    tempObj["setStudent1"] = setStudent1;
    tempObj["setStudent2"] = setStudent2;
    tempObj["setStudent3"] = setStudent3;
    tempObj["setStudent4"] = setStudent4;
    tempObj["above80"] = above80;
    tempObj["sixtyTo79"] = sixtyTo79;
    tempObj["fortyTo59"] = fortyTo59;
    tempObj["below40"] = below40;

    setIsLoading(true);
    try {
      const response = await axios.post(
        "https://report-gen-server.vercel.app/generate_report",
        formdata,
        {
          responseType: "blob",
        },
      );
      if (response.data) {
        let localFilePath;
        const lastIndex = localPath.lastIndexOf("/");
        const originalDirectoryPath = localPath.substring(0, lastIndex);
        const directoryExists = await RNFS.exists(originalDirectoryPath);
        if (!directoryExists) {
          await RNFS.mkdir(originalDirectoryPath);
        }
        localFilePath = `${originalDirectoryPath}/REPORT_${new Date().getTime()}.pdf`;

        const reader = new FileReader();
        reader.readAsDataURL(response.data);
        reader.onloadend = () => {
          const base64data = reader.result;
          const base64WithoutPrefix = base64data.split(",")[1];
          RNFS.writeFile(localFilePath, base64WithoutPrefix, "base64")
            .then(async () => {
              (await RNFS.exists(localFilePath)) &&
                FileViewer.open(localFilePath).catch(error => {
                  ToastAndroid.show(
                    "Can't Open PDF!\n" +
                      "Go Manually Open It in Your Device From This Path:\n" +
                      localFilePath.substring(
                        localFilePath.indexOf("Download"),
                      ),
                    ToastAndroid.LONG,
                  );
                  console.log("Error opening PDF:", error);
                });
              const existingHistory = await AsyncStorage.getItem("pdfHistory");
              const pdfHistory = JSON.parse(existingHistory);
              pdfHistory[index].reports.push({
                name:
                  formData.totalSet != "none"
                    ? "for SET: (" +
                      formData.totalSet.split("").sort().join(", ") +
                      ")"
                    : "for " +
                      (setStudent1 + setStudent2 + setStudent3 + setStudent4) +
                      " Students",
                path: localFilePath,
                ...tempObj,
              });
              await AsyncStorage.setItem(
                "pdfHistory",
                JSON.stringify(pdfHistory),
              );
              navigation.navigate("ReportHistory", {
                formData: omrData,
                localFilePath: localPath,
                index,
                students,
              });
              setIsLoading(false);
            })
            .catch(err => {
              setIsLoading(false);
              ToastAndroid.show("Error Saving PDF!", ToastAndroid.LONG);
              console.log("Error Saving PDF:", err.message);
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

  const handleSubmitCSV = async () => {
    // Check permissions before file operations
    const hasPermissions = await checkStoragePermissions();
    if (!hasPermissions) {
      const granted = await requestStoragePermissions();
      if (!granted) {
        Alert.alert(
          "Permission Required",
          "Storage permission is required to generate CSV files.",
        );
        return;
      }
    }

    if (
      !/^[a-zA-Z0-9._%-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(
        formData.rEmail.trim(),
      )
    ) {
      Alert.alert("", "Please Enter a Valid Email Address!");
      return;
    }

    const formdata = {};
    formdata["paper_name"] = omrData.pName;
    formdata["isSerial"] = formData.isSerial;
    formdata["isID"] = formData.isID;
    formdata["isName"] = formData.isName;
    formdata["isSet"] = formData.isSet;
    formdata["sortBy"] = formData.sortBy;
    formdata["totalSet"] = formData.totalSet;
    formdata["rEmail"] = formData.rEmail;

    let newTotalSet =
      formData.totalSet != "none"
        ? formData.totalSet
            .replace(
              /[ABCD]/g,
              match => ({ A: "1", B: "2", C: "3", D: "4" }[match]),
            )
            .split("")
            .sort()
            .join("")
        : "1";

    let setStudent1 = 0;
    let setStudent2 = 0;
    let setStudent3 = 0;
    let setStudent4 = 0;
    let k = 0;

    for (let i = 0; i < newTotalSet.length; i++) {
      for (let j = 0; j < students.length; j++) {
        if (students[j].setno == newTotalSet[i]) {
          if (i == 0) {
            setStudent1++;
          } else if (i == 1) {
            setStudent2++;
          } else if (i == 2) {
            setStudent3++;
          } else {
            setStudent4++;
          }

          k++;
          formdata["roll_number" + k] = Number(students[j].idno);
          formdata["name" + k] = students[j].name;
          formdata["set" + k] = ["A", "B", "C", "D"][
            Number(students[j].setno) - 1
          ];
          formdata["mark" + k] = Number(students[j].marks);
        }
      }
    }

    formdata["setStudent1"] = setStudent1;
    formdata["setStudent2"] = setStudent2;
    formdata["setStudent3"] = setStudent3;
    formdata["setStudent4"] = setStudent4;

    setIsLoading(true);
    try {
      const response = await axios.post(
        "https://report-gen-server.vercel.app/generate_report_csv",
        formdata,
      );
      if (response.data) {
        setIsLoading(false);
        Alert.alert("", response.data);
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
        <View
          style={{
            backgroundColor: "#111",
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
          }}>
          <ActivityIndicator size="large" color="#007bff" />
        </View>
      ) : (
        <ReportGenerationForm
          omrData={omrData}
          formData={formData}
          handleInputChange={handleInputChange}
          handleSubmit={handleSubmit}
          handleSubmitCSV={handleSubmitCSV}
        />
      )}
    </ScrollView>
  );
};

export default ReportGeneration;
