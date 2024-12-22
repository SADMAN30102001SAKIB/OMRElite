import React, { useState, useEffect } from "react";
import { ActivityIndicator, View, Alert, ToastAndroid } from "react-native";
import RNFS from "react-native-fs";
import AsyncStorage from "@react-native-async-storage/async-storage";
import StudentHistoryList from "../components/StudentHistoryList";

const StudentHistory = ({ route, navigation }) => {
  const { formData, localFilePath, index, students } = route.params;
  const [studentItems, setStudentItems] = useState(students);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    fetchStudent();
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
      setStudentItems(history[index].students);
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

  const deleteStudentItem = async idx => {
    Alert.alert(
      "Delete History Item?",
      "Are you sure you want to delete this history item? This action cannot be undone.",
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
              let updatedStudents = [...studentItems];
              await Delete(updatedStudents[idx].localPath);
              updatedStudents.splice(idx, 1);
              const historyJson = await AsyncStorage.getItem("pdfHistory");
              const history = JSON.parse(historyJson);
              history[index].students = updatedStudents;
              setStudentItems(updatedStudents);
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
    <StudentHistoryList
      formData={formData}
      localFilePath={localFilePath}
      index={index}
      studentItems={studentItems}
      deleteStudentItem={deleteStudentItem}
      navigation={navigation}
    />
  );
};

export default StudentHistory;
