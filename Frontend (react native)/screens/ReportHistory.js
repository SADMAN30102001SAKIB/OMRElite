import React, { useState, useEffect } from "react";
import { ActivityIndicator, View, Alert, ToastAndroid } from "react-native";
import FileViewer from "react-native-file-viewer";
import RNFS from "react-native-fs";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import ReportHistoryList from "../components/ReportHistoryList";

const ReportHistory = ({ route, navigation }) => {
  const { formData, localFilePath, index, students } = route.params;
  const [reportItems, setReportItems] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", () => {
      fetchStudent();
    });
    return unsubscribe;
  }, [navigation]);

  const fetchStudent = async () => {
    setIsLoading(true);
    try {
      const historyJson = await AsyncStorage.getItem("pdfHistory");
      const history = JSON.parse(historyJson);
      setReportItems(history[index].reports);
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
      await AsyncStorage.setItem("pdfHistory", JSON.stringify([]));
      await Delete(
        `${RNFS.DownloadDirectoryPath}/OMRElite (!!!DO NOT DELETE!!!)`,
      );
      ToastAndroid.show(
        "History deleted because of corrupted data!",
        ToastAndroid.LONG,
      );
      navigation.navigate("Home");
      console.log("Error fetching student from local storage:", error);
    }
  };

  const Delete = async directoryPath => {
    try {
      const directoryExists = await RNFS.exists(directoryPath);
      if (directoryExists) {
        await RNFS.unlink(directoryPath);
      } else {
        console.log("Directory does not exist:", directoryPath);
      }
    } catch (error) {
      console.log("Error deleting directory:", error);
    }
  };

  const deleteReportItem = async idx => {
    Alert.alert(
      "Delete Report?",
      "Are you sure you want to delete this report? This action cannot be undone.",
      [
        {
          text: "NO",
          onPress: () => {},
          style: "cancel",
        },
        {
          text: "YES",
          onPress: async () => {
            setIsLoading(true);
            try {
              let updatedReports = [...reportItems];
              await Delete(updatedReports[idx].path);
              updatedReports.splice(idx, 1);
              const historyJson = await AsyncStorage.getItem("pdfHistory");
              const history = JSON.parse(historyJson);
              history[index].reports = updatedReports;
              setReportItems(updatedReports);
              await AsyncStorage.setItem("pdfHistory", JSON.stringify(history));

              setIsLoading(false);
              ToastAndroid.show(
                "Item deleted successfully!",
                ToastAndroid.SHORT,
              );
            } catch (error) {
              setIsLoading(false);
              ToastAndroid.show("Failed to delete item!", ToastAndroid.LONG);
              console.log("Error deleting student item:", error);
            }
          },
        },
      ],
      { cancelable: false },
    );
  };

  const handleSubmit = async idx => {
    const formdata = {};
    formdata["institute_name"] = reportItems[idx].iName;
    formdata["paper_name"] = reportItems[idx].pName;
    formdata["isSerial"] = reportItems[idx].isSerial;
    formdata["isID"] = reportItems[idx].isID;
    formdata["isName"] = reportItems[idx].isName;
    formdata["isSet"] = reportItems[idx].isSet;
    formdata["sortBy"] = reportItems[idx].sortBy;
    formdata["isLeftAddionalData"] = reportItems[idx].isLeftAddionalData;
    formdata["totalSet"] = reportItems[idx].totalSet;

    for (let i = 1; reportItems[idx]["roll_number" + i]; i++) {
      formdata["roll_number" + i] = reportItems[idx]["roll_number" + i];
      formdata["name" + i] = reportItems[idx]["name" + i];
      formdata["set" + i] = reportItems[idx]["set" + i];
      formdata["mark" + i] = reportItems[idx]["mark" + i];
    }
    formdata["setStudent1"] = reportItems[idx]["setStudent1"];
    formdata["setStudent2"] = reportItems[idx]["setStudent2"];
    formdata["setStudent3"] = reportItems[idx]["setStudent3"];
    formdata["setStudent4"] = reportItems[idx]["setStudent4"];
    formdata["above80"] = reportItems[idx]["above80"];
    formdata["sixtyTo79"] = reportItems[idx]["sixtyTo79"];
    formdata["fortyTo59"] = reportItems[idx]["fortyTo59"];
    formdata["below40"] = reportItems[idx]["below40"];

    setIsLoading(true);
    try {
      const response = await axios.post(
        "https://reportgenserver-sadman-sakibs-projects.vercel.app/generate_report",
        formdata,
        {
          responseType: "blob",
        },
      );
      if (response.data) {
        let path;
        const lastIndex = localFilePath.lastIndexOf("/");
        const originalDirectoryPath = localFilePath.substring(0, lastIndex);
        const directoryExists = await RNFS.exists(originalDirectoryPath);
        if (!directoryExists) {
          await RNFS.mkdir(originalDirectoryPath);
        }
        path = `${originalDirectoryPath}/REPORT_${new Date().getTime()}.pdf`;

        const reader = new FileReader();
        reader.readAsDataURL(response.data);
        reader.onloadend = () => {
          const base64data = reader.result;
          const base64WithoutPrefix = base64data.split(",")[1];
          RNFS.writeFile(path, base64WithoutPrefix, "base64")
            .then(async () => {
              (await RNFS.exists(path)) &&
                FileViewer.open(path).catch(error => {
                  ToastAndroid.show("Error opening PDF", ToastAndroid.LONG);
                  console.log("Error opening PDF:", error);
                });
              const existingHistory = await AsyncStorage.getItem("pdfHistory");
              const pdfHistory = JSON.parse(existingHistory);
              pdfHistory[index].reports[idx].path = path;
              setReportItems(pdfHistory[index].reports);
              await AsyncStorage.setItem(
                "pdfHistory",
                JSON.stringify(pdfHistory),
              );
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

  return isLoading ? (
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
    <ReportHistoryList
      formData={formData}
      localFilePath={localFilePath}
      index={index}
      students={students}
      reportItems={reportItems}
      deleteReportItem={deleteReportItem}
      handleSubmit={handleSubmit}
      navigation={navigation}
    />
  );
};

export default ReportHistory;
