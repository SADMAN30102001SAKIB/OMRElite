import React from "react";
import {
  View,
  TextInput,
  Text,
  Switch,
  TouchableOpacity,
  Alert,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import styles from "../componentStyles/FormStyle";

const ExamMarkingForm = ({
  mpq,
  isNegative,
  negativeMark,
  wqCase,
  handleInputChange,
  handleSave,
  students,
}) => {
  return (
    <View style={{ ...styles.container, justifyContent: "space-between" }}>
      <View style={{ ...styles.topContainer, marginVertical: "5%" }}>
        <View>
          <Text
            style={
              mpq ? { ...styles.label } : { ...styles.label, color: "#ff5500" }
            }>
            Marks Per Question:
          </Text>
          <TextInput
            placeholder="ex: 1"
            keyboardType="numeric"
            onChangeText={text => handleInputChange("mpq", text)}
            style={styles.input}
            value={!isNaN(Number(mpq)) ? mpq.toString() : ""}
          />
        </View>

        <View style={{ marginTop: "15%" }}>
          <Text style={styles.label}>Select No-Ans Mark:</Text>
          <Picker
            selectedValue={wqCase}
            onValueChange={(itemValue, itemIndex) =>
              handleInputChange("wqCase", itemValue)
            }
            style={styles.picker}>
            <Picker.Item label="filled -> (0) | blank -> (0)" value="1" />
            <Picker.Item
              label={`filled -> (${
                isNaN(Number(mpq)) ? "N/A" : "+" + mpq
              }) | blank -> (${isNaN(Number(mpq)) ? "N/A" : "+" + mpq})`}
              value="2"
            />
            <Picker.Item
              label={`filled -> (0) | blank -> (${
                isNaN(Number(mpq)) ? "N/A" : "+" + mpq
              })`}
              value="3"
            />
            {isNegative && (
              <Picker.Item
                label={`filled -> (${
                  isNaN(Number(negativeMark)) ? "N/A" : negativeMark
                }) | blank -> (0)`}
                value="4"
              />
            )}
            {isNegative && (
              <Picker.Item
                label={`filled -> (${
                  isNaN(Number(negativeMark)) ? "N/A" : negativeMark
                }) | blank -> (${isNaN(Number(mpq)) ? "N/A" : "+" + mpq})`}
                value="5"
              />
            )}
          </Picker>
        </View>

        <View style={styles.switchBox}>
          <Text style={styles.label}>Allow Negative Mark?</Text>
          <Switch
            value={isNegative}
            onValueChange={value => {
              handleInputChange("isNegative", value);
              handleInputChange("wqCase", 1);
            }}
            style={styles.switch}
          />
        </View>

        {isNegative ? (
          <View style={{ ...styles.fieldContainer, marginTop: "15%" }}>
            <Text
              style={
                !isNaN(Number(negativeMark))
                  ? { ...styles.label }
                  : { ...styles.label, color: "#ff5500" }
              }>
              Negative Mark Per Mistake:
            </Text>
            <TextInput
              placeholder="ex: 0.25"
              keyboardType="numeric"
              onChangeText={text => handleInputChange("negativeMark", text)}
              style={{ ...styles.input }}
              value={
                !isNaN(Number(negativeMark)) ? negativeMark.toString() : ""
              }
            />
          </View>
        ) : null}
      </View>

      <View style={styles.button}>
        <TouchableOpacity
          style={{
            ...styles.submitButton,
            backgroundColor: "#00ff5f",
          }}
          onPress={() => {
            students.length
              ? Alert.alert(
                  "Are you sure?",
                  "Saving Will Re-Calculate All Evaluated Student's Score & Also You Should Update All Student's \"Result PDF\" by Re-Generating, If You Change Anything here!",
                  [
                    {
                      text: "NO",
                      onPress: () => {},
                      style: "cancel",
                    },
                    {
                      text: "YES",
                      onPress: () => {
                        handleSave();
                      },
                    },
                  ],
                  { cancelable: false },
                )
              : handleSave();
          }}>
          <Text style={{ ...styles.submitButtonText, color: "black" }}>
            Save
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default ExamMarkingForm;
