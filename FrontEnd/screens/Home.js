import React from "react";
import {
  PermissionsAndroid,
  View,
  TouchableOpacity,
  Text,
  ToastAndroid,
} from "react-native";
import styles from "../screenStyles/HomeStyle";

const Home = ({ navigation }) => {
  const requestStoragePermission = async () => {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
        {
          title: "Storage Permission Required",
          message: "This app needs access to your storage to download PDFs.",
          buttonNeutral: "Ask Me Later",
          buttonNegative: "Cancel",
          buttonPositive: "OK",
        },
      );
      if (granted !== PermissionsAndroid.RESULTS.GRANTED) {
        ToastAndroid.show("Storage Permission Denied!", ToastAndroid.LONG);
        console.log("Storage Permission Denied!");
      } else {
        navigation.navigate("OmrGeneration", {
          omrData: null,
          localPath: null,
          idx: null,
          students: [],
          reports: [],
        });
      }
    } catch (err) {
      console.warn(err);
    }
  };

  return (
    <View style={styles.homeContainer}>
      <Text style={styles.text}>OMRElite</Text>
      <View style={styles.button}>
        <TouchableOpacity
          style={{ ...styles.submitButton, backgroundColor: "#00ff5f" }}
          onPress={async () => {
            await requestStoragePermission();
          }}>
          <Text style={{ ...styles.submitButtonText, color: "black" }}>
            Create
          </Text>
        </TouchableOpacity>
      </View>
      <View style={styles.button}>
        <TouchableOpacity
          style={{ ...styles.submitButton }}
          onPress={() => {
            navigation.navigate("ExamHistory");
          }}>
          <Text style={{ ...styles.submitButtonText }}>Exams</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default Home;
