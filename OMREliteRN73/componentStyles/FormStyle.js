import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#111",
    padding: "5%",
  },
  setContainer: {
    marginVertical: "6%",
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
  },
  topContainer: {
    backgroundColor: "#181818",
    padding: "5%",
    borderRadius: 10,
    borderWidth: 2,
    borderColor: "white",
    borderStyle: "solid",
  },
  fieldContainer: {
    marginBottom: "4.5%",
  },
  label: {
    color: "white",
    fontSize: 16,
  },
  input: {
    color: "white",
    borderColor: "gray",
    borderRadius: 10,
    borderWidth: 2,
    marginBottom: "2%",
    paddingLeft: "5%",
  },
  switch: {
    width: "14%",
    marginLeft: "5%",
  },
  switchBox: {
    flexDirection: "row",
    marginTop: "10%",
  },
  radioButton: {
    display: "flex",
    flexDirection: "row",
  },
  radioButtonRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    width: "25%",
  },
  submitButton: {
    borderRadius: 50,
    paddingHorizontal: "10%",
    paddingBottom: "5%",
    paddingTop: "5%",
    paddingVertical: "3%",
    backgroundColor: "#007BFF",
    justifyContent: "center",
    alignItems: "center",
    marginTop: "1%",
  },
  submitButtonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 16,
  },
  button: {
    width: "100%",
    display: "flex",
    alignItems: "center",
  },
  scroll: {
    padding: "2%",
    backgroundColor: "#181818",
    borderRadius: 10,
    borderWidth: 2,
    borderColor: "white",
    borderStyle: "solid",
  },
  option: {
    fontSize: 10,
    fontWeight: "bold",
  },
  box: {
    borderRadius: 10,
    padding: "5%",
    backgroundColor: "#101010",
    borderColor: "white",
    borderStyle: "dotted",
    borderWidth: 3,
    marginBottom: "10%",
  },
});

export default styles;
