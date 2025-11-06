import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#111",
    height: "100%",
    color: "white",
    paddingHorizontal: "5%",
  },
  historyItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: "5%",
  },
  historyContent: {
    borderTopLeftRadius: 15,
    borderBottomLeftRadius: 15,
    borderStyle: "dashed",
    borderWidth: 2,
    borderColor: "white",
    flex: 1,
    padding: "5%",
  },
  historyText: {
    color: "white",
    fontWeight: "bold",
  },
  deleteButton: {
    paddingHorizontal: "4%",
    paddingVertical: "3%",
    width: "20%",
    borderTopRightRadius: 15,
    borderBottomRightRadius: 15,
    backgroundColor: "red",
  },
  deleteButtonText: {
    fontSize: 25,
    color: "white",
    fontWeight: "bold",
  },
  setContainer: {
    marginTop: "6%",
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
  },
  submitButton: {
    borderRadius: 50,
    paddingHorizontal: "10%",
    paddingTop: "5%",
    paddingBottom: "5%",
    backgroundColor: "#007BFF",
    paddingVertical: "3%",
  },
  submitButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  button: {
    marginTop: "5%",
    width: "100%",
    display: "flex",
    alignItems: "center",
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
    marginTop: "10%",
    paddingLeft: "5%",
  },
});

export default styles;
