import {StyleSheet} from 'react-native';

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    padding: '5%',
  },
  setContainer: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    marginVertical: '3%',
  },
  topBox: {
    borderRadius: 10,
    padding: '5%',
    backgroundColor: '#181818',
  },
  fieldBox: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  box: {
    borderRadius: 10,
    padding: '5%',
    backgroundColor: '#101010',
    borderColor: 'white',
    borderStyle: 'dotted',
    borderWidth: 3,
  },
  text: {
    color: 'white',
    margin: '1%',
    fontWeight: 'bold',
    fontSize: 16,
  },
  label: {
    fontSize: 16,
  },
  submitButton: {
    borderRadius: 50,
    paddingHorizontal: '10%',
    paddingTop: '5%',
    paddingBottom: '5%',
    backgroundColor: '#007BFF',
    paddingVertical: '3%',
  },
  submitButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  button: {
    marginTop: '5%',
    width: '100%',
    display: 'flex',
    alignItems: 'center',
  },
  buttonGroup: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
});

export default styles;
