import {StyleSheet} from 'react-native';

const styles = StyleSheet.create({
  text: {
    position: 'absolute',
    color: 'white',
    fontWeight: 'bold',
    fontSize: 48,
    top: '5%',
  },
  homeContainer: {
    backgroundColor: '#111',
    height: '100%',
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-evenly',
  },
  submitButton: {
    borderRadius: 20,
    borderStyle: 'dashed',
    borderWidth: 3,
    borderColor: 'white',
    backgroundColor: '#007BFF',
    justifyContent: 'center',
    alignItems: 'center',
    width: 150,
    paddingVertical: '10%',
  },
  submitButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  button: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default styles;
