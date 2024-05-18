import React from "react";
import { View, Text, Switch, TouchableOpacity, TextInput } from "react-native";
import { Picker } from "@react-native-picker/picker";
import CustomCheckBox from "./CustomCheckBox";
import styles from "../componentStyles/FormStyle";

const ReportGenerationForm = ({
  omrData,
  formData,
  handleInputChange,
  handleSubmit,
  handleSubmitCSV,
}) => {
  return (
    <View
      style={{
        ...styles.container,
        padding: "3%",
        paddingTop: "20%",
      }}>
      <View
        style={{
          padding: "5%",
          borderColor: "white",
          borderWidth: 2,
          borderRadius: 10,
        }}>
        <View
          style={{
            ...styles.fieldContainer,
            display: "flex",
            flexDirection: "row",
          }}>
          <Text style={styles.label}>Show Student's Performance?</Text>
          <Switch
            value={formData.isLeftAddionalData}
            onValueChange={value => {
              handleInputChange("isLeftAddionalData", value);
            }}
            style={styles.switch}
            trackColor={{ false: "#767577", true: "#aaffaa" }}
            thumbColor={formData.isLeftAddionalData ? "#00aa5f" : "#f4f3f4"}
          />
        </View>
        <Text style={{ ...styles.label, marginTop: "5%", marginBottom: "2%" }}>
          Report Table Info 🔽:
        </Text>
        <View
          style={{
            ...styles.fieldContainer,
            display: "flex",
            flexDirection: "row",
          }}>
          <Text style={styles.label}>Show Serial Column?</Text>
          <Switch
            value={formData.isSerial}
            onValueChange={value => handleInputChange("isSerial", value)}
            style={styles.switch}
            trackColor={{ false: "#767577", true: "#aaffaa" }}
            thumbColor={formData.isSerial ? "#00aa5f" : "#f4f3f4"}
          />
        </View>
        {omrData.isRoll && (
          <View
            style={{
              ...styles.fieldContainer,
              display: "flex",
              flexDirection: "row",
            }}>
            <Text style={styles.label}>Show ID Column?</Text>
            <Switch
              value={formData.isID}
              onValueChange={value => {
                handleInputChange("sortBy", "set");
                handleInputChange("isID", value);
              }}
              style={styles.switch}
              trackColor={{ false: "#767577", true: "#aaffaa" }}
              thumbColor={formData.isID ? "#00aa5f" : "#f4f3f4"}
            />
          </View>
        )}
        {(omrData.isName || !omrData.isRoll) && (
          <View
            style={{
              ...styles.fieldContainer,
              display: "flex",
              flexDirection: "row",
            }}>
            <Text style={styles.label}>Show Name Column?</Text>
            <Switch
              value={formData.isName}
              onValueChange={value => {
                handleInputChange("sortBy", "set");
                handleInputChange("isName", value);
              }}
              style={styles.switch}
              trackColor={{ false: "#767577", true: "#aaffaa" }}
              thumbColor={formData.isName ? "#00aa5f" : "#f4f3f4"}
            />
          </View>
        )}
        {omrData.setCount > 1 && (
          <View
            style={{
              ...styles.fieldContainer,
              display: "flex",
              flexDirection: "row",
            }}>
            <Text style={styles.label}>Show Set Column?</Text>
            <Switch
              value={formData.isSet}
              onValueChange={value => {
                handleInputChange("sortBy", "set");
                handleInputChange("isSet", value);
              }}
              style={styles.switch}
              trackColor={{ false: "#767577", true: "#aaffaa" }}
              thumbColor={formData.isSet ? "#00aa5f" : "#f4f3f4"}
            />
          </View>
        )}
        <View style={{ marginVertical: "5%" }}>
          <Text style={styles.label}>Sort By:</Text>
          <Picker
            selectedValue={formData.sortBy}
            onValueChange={(itemValue, itemIndex) =>
              handleInputChange("sortBy", itemValue)
            }
            style={styles.picker}>
            <Picker.Item
              label={formData.isSet ? "Question Set" : "Default"}
              value="set"
            />
            <Picker.Item label="Obtained Score" value="marks" />
            {formData.isID && (
              <Picker.Item label="ID Number" value="roll_number" />
            )}
            {formData.isName && (
              <Picker.Item label="Student Name" value="name" />
            )}
          </Picker>
        </View>

        {omrData.setCount > 1 && (
          <View style={styles.setContainer}>
            <Text style={styles.label}>SET: </Text>
            <CustomCheckBox
              options={["A", "B", "C", "D"]
                .slice(0, omrData.setCount)
                .map((item, index) => ({
                  label: item,
                  value: item,
                }))}
              selectedValue={formData.totalSet}
              onValueChange={newValue => {
                if (
                  formData.totalSet != newValue &&
                  formData.totalSet.includes(newValue)
                ) {
                  newValue = formData.totalSet.replace(newValue, "");
                } else if (formData.totalSet != newValue) {
                  newValue = newValue + formData.totalSet;
                }
                handleInputChange("totalSet", newValue);
              }}
            />
          </View>
        )}
        <View style={{ ...styles.button, marginTop: "5%" }}>
          <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
            <Text style={styles.submitButtonText}>Generate Report PDF</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View
        style={{
          padding: "5%",
          marginVertical: "10%",
          borderColor: "white",
          borderWidth: 2,
          borderRadius: 10,
        }}>
        <View>
          <Text
            style={
              /^[a-zA-Z0-9]+(\.[a-zA-Z0-9]+)*@gmail\.com$/.test(
                formData.rEmail.trim(),
              )
                ? { ...styles.label }
                : { ...styles.label, color: "#ff5500" }
            }>
            Recipient Email:
          </Text>
          <TextInput
            placeholder="ex: sadman30102001sakib@gamil.com"
            keyboardType="email-address"
            onChangeText={text => handleInputChange("rEmail", text)}
            style={styles.input}
          />
        </View>
        <View style={{ ...styles.button, marginTop: "5%" }}>
          <TouchableOpacity
            style={styles.submitButton}
            onPress={handleSubmitCSV}>
            <Text style={styles.submitButtonText}>Email CSV</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default ReportGenerationForm;
