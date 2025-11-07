import {StyleSheet} from 'react-native';

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#111',
    height: '100%',
  },
  submitButton: {
    borderRadius: 20,
    width: '50%',
    backgroundColor: '#007BFF',
    paddingVertical: '3%',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: '1%',
  },
  submitButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  button: {
    width: '100%',
    display: 'flex',
    alignItems: 'center',
  },
  loader: {
    backgroundColor: '#111',
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default styles;
