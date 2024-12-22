import React, { useState, useCallback } from "react";
import { View, Text, TouchableOpacity, Alert } from "react-native";
import CustomCheckBox from "./CustomCheckBox";
import styles from "../componentStyles/FormStyle";

const QuestionItem = React.memo(
  ({ index, set, handleInputChange, newOmrData }) => {
    const questionNumber = index + 1;
    const questionKey = `set${set}Q${questionNumber}`;
    const value = newOmrData[questionKey];

    return (
      <View
        style={{
          ...styles.fieldContainer,
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
        }}>
        <Text
          style={
            !value.includes("-")
              ? value.length > 1
                ? {
                    ...styles.label,
                    padding: "1%",
                    marginBottom: "1.5%",
                    color: "#ffff00",
                  }
                : {
                    ...styles.label,
                    padding: "1%",
                    marginBottom: "1.5%",
                    color: "#55ff00",
                  }
              : {
                  ...styles.label,
                  padding: "1%",
                  marginBottom: "1.5%",
                  color: "#ff5500",
                }
          }>
          {questionNumber < 10 ? `Q0${questionNumber}:` : `Q${questionNumber}:`}
        </Text>
        <CustomCheckBox
          options={[
            { label: "A", value: "1" },
            { label: "B", value: "2" },
            { label: "C", value: "3" },
            { label: "D", value: "4" },
          ]}
          selectedValue={value}
          onValueChange={newValue => {
            if (!value.includes("-") && value == newValue) {
              newValue = (-newOmrData.wqCase).toString();
            } else if (!value.includes("-") && value.includes(newValue)) {
              newValue = value.replace(newValue, "");
            } else if (!value.includes("-")) {
              newValue = newValue + value;
            }
            handleInputChange(questionKey, newValue);
          }}
        />
      </View>
    );
  },
);

const AnswerSheetForm = ({
  newOmrData,
  handleInputChange,
  handleSave,
  students,
}) => {
  const [set, setSet] = useState(1);
  const [currentPage, setCurrentPage] = useState(0);

  const questionsPerPage = 10;
  const totalPages = Math.ceil(newOmrData.questionsCount / questionsPerPage);

  const list = ["A", "B", "C", "D"].slice(0, newOmrData.setCount);

  const handleNext = useCallback(() => {
    setCurrentPage(current =>
      current < totalPages - 1 ? current + 1 : current,
    );
  }, [totalPages]);

  const handlePrev = useCallback(() => {
    setCurrentPage(current => (current > 0 ? current - 1 : current));
  }, []);

  const handleHardNext = useCallback(() => {
    setCurrentPage(totalPages - 1);
  }, [totalPages]);

  const handleHardPrev = useCallback(() => {
    setCurrentPage(0);
  }, []);

  const handleSetChange = useCallback(newValue => {
    setSet(parseInt(newValue, 10));
    setCurrentPage(0);
  }, []);

  const startIndex = currentPage * questionsPerPage;
  const endIndex = startIndex + questionsPerPage;
  const questionsToShow = new Array(newOmrData.questionsCount)
    .fill(null)
    .slice(startIndex, endIndex);

  return (
    <View style={styles.container}>
      <View
        style={{
          ...styles.fieldContainer,
          marginTop: "5%",
          marginBottom: list.length > 1 ? "6%" : "16%",
        }}>
        {list.length > 1 && (
          <View
            style={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-around",
            }}>
            <Text style={styles.label}>SET: </Text>
            <CustomCheckBox
              options={list.map((item, index) => ({
                label: item,
                value: (index + 1).toString(),
              }))}
              selectedValue={set.toString()}
              onValueChange={handleSetChange}
            />
          </View>
        )}
      </View>

      <View
        style={{
          ...styles.scroll,
        }}>
        {questionsToShow.map((_, index) => (
          <QuestionItem
            key={index}
            index={startIndex + index}
            set={set}
            handleInputChange={handleInputChange}
            newOmrData={newOmrData}
          />
        ))}
      </View>

      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-around",
          marginTop: "5%",
        }}>
        {currentPage > 0 && (
          <View>
            <TouchableOpacity
              onPress={handleHardPrev}
              style={{ paddingTop: "20%" }}>
              <Text
                style={{
                  ...styles.submitButtonText,
                  fontSize: 35,
                  transform: [{ rotate: "180deg" }],
                }}>
                {"⇶"}
              </Text>
            </TouchableOpacity>
          </View>
        )}
        {currentPage > 0 && (
          <View>
            <TouchableOpacity
              onPress={handlePrev}
              style={{ paddingTop: "20%" }}>
              <Text
                style={{
                  ...styles.submitButtonText,
                  fontSize: 35,
                  transform: [{ rotate: "180deg" }],
                }}>
                {"➣"}
              </Text>
            </TouchableOpacity>
          </View>
        )}
        {currentPage < totalPages - 1 && (
          <View>
            <TouchableOpacity onPress={handleNext}>
              <Text
                style={{
                  ...styles.submitButtonText,
                  fontSize: 35,
                }}>
                {"➣"}
              </Text>
            </TouchableOpacity>
          </View>
        )}
        {currentPage < totalPages - 1 && (
          <View>
            <TouchableOpacity onPress={handleHardNext}>
              <Text
                style={{
                  ...styles.submitButtonText,
                  fontSize: 35,
                }}>
                {"⇶"}
              </Text>
            </TouchableOpacity>
          </View>
        )}
      </View>

      <View style={{ ...styles.button, marginTop: "10%" }}>
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

export default AnswerSheetForm;
