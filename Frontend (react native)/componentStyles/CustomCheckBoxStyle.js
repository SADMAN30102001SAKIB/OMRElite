import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  radioGroup: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: "1.5%",
    justifyContent: "center",
  },
  radioButton: {
    marginRight: 20,
  },
  outerCircle: {
    height: 35,
    width: 35,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: "#000",
    alignItems: "center",
    justifyContent: "center",
  },
  selectedOuterCircle: {
    borderColor: "#fff",
    backgroundColor: "#007bff",
  },
  label: {
    fontSize: 12,
    color: "#fff",
  },
});

export default styles;
