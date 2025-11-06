import React from "react";
import {
  ScrollView,
  View,
  Text,
  TouchableOpacity,
  Alert,
  ToastAndroid,
} from "react-native";
import FileViewer from "react-native-file-viewer";
import RNFS from "react-native-fs";
import {
  checkStoragePermissions,
  requestStoragePermissions,
} from "../utils/permissions";
import styles from "../componentStyles/ExamListStyle";

const ReportHistoryList = ({
  formData,
  localFilePath,
  index,
  students,
  reportItems,
  deleteReportItem,
  handleSubmit,
  navigation,
}) => {
  return (
    <View style={styles.container}>
      <View style={{ ...styles.button, marginTop: "10%" }}>
        <TouchableOpacity
          style={{
            ...styles.submitButton,
            borderWidth: 1,
            borderRadius: 15,
            borderStyle: "dashed",
            borderColor: "white",
          }}
          onPress={() => {
            navigation.navigate("ReportGeneration", {
              omrData: formData,
              localPath: localFilePath,
              index,
              students,
            });
          }}>
          <Text style={{ ...styles.submitButtonText }}>Generate Report</Text>
        </TouchableOpacity>
      </View>
      <Text
        style={{
          ...styles.historyText,
          marginTop: "10%",
          marginBottom: "5%",
          color: "#ccc",
        }}>
        History (Total Reports: {reportItems.length}):
      </Text>
      <ScrollView>
        {reportItems.map((item, idx) => (
          <View key={idx} style={styles.historyItem}>
            <TouchableOpacity
              onPress={async () => {
                const hasPermissions = await checkStoragePermissions();
                if (!hasPermissions) {
                  const granted = await requestStoragePermissions();
                  if (!granted) {
                    Alert.alert(
                      "Permission Required",
                      "Storage permission is required to access files.",
                    );
                    return;
                  }
                }

                if (await RNFS.exists(item.path)) {
                  FileViewer.open(item.path).catch(error => {
                    ToastAndroid.show(
                      "Can't Open PDF!\n" +
                        "Go Manually Open It in Your Device From This Path: " +
                        item.path.substring(item.path.indexOf("Download")),
                      ToastAndroid.LONG,
                    );
                    console.log("Error opening PDF:", error);
                  });
                } else {
                  Alert.alert(
                    "File Does Not Exist!",
                    "Do you want to Re-Generate the file? If Not, Then Please Delete This Item!",
                    [
                      {
                        text: "Delete",
                        onPress: () => {
                          deleteReportItem(idx);
                        },
                      },
                      {
                        text: "Re-Generate",
                        onPress: () => {
                          handleSubmit(idx);
                        },
                      },
                    ],
                    { cancelable: true },
                  );
                }
              }}
              style={{
                ...styles.historyContent,
                backgroundColor: idx % 2 ? "#00ff5f" : "#007bff",
              }}>
              <Text
                style={{
                  ...styles.historyText,
                  color: idx % 2 ? "black" : "white",
                }}
                numberOfLines={1}
                ellipsizeMode="tail">
                {"REPORT - " + (idx + 1) + " " + item.name}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => deleteReportItem(idx)}
              style={styles.deleteButton}>
              <Text style={styles.deleteButtonText}>🗑</Text>
            </TouchableOpacity>
          </View>
        ))}
      </ScrollView>
    </View>
  );
};

export default ReportHistoryList;
