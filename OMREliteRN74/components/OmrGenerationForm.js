import React from 'react';
import {
  ScrollView,
  View,
  TextInput,
  Text,
  Switch,
  TouchableOpacity,
} from 'react-native';
import {RadioButton} from 'react-native-paper';
import {Picker} from '@react-native-picker/picker';
import styles from '../componentStyles/FormStyle';

const OmrGenerationForm = ({
  formData,
  students,
  handleInputChange,
  handleSubmit,
}) => {
  return (
    <ScrollView
      style={{
        ...styles.container,
        padding: '3%',
        paddingTop: '10%',
      }}>
      <View
        style={{
          padding: '5%',
          borderColor: 'white',
          borderWidth: 2,
          borderRadius: 10,
        }}>
        <View style={styles.box}>
          <View>
            <Text
              style={
                formData.iName
                  ? {...styles.label}
                  : {...styles.label, color: '#ff5500'}
              }>
              Institution Name:
            </Text>
            <TextInput
              placeholder="Edit"
              onChangeText={text => handleInputChange('iName', text)}
              style={styles.input}
              value={formData.iName ? formData.iName.toString() : ''}
            />
          </View>

          <View
            style={{
              ...styles.fieldContainer,
              display: 'flex',
              flexDirection: 'row',
              marginBottom: '0%',
            }}>
            <Text style={styles.label}>Underlined?</Text>
            <Switch
              value={formData.isIUnderline}
              onValueChange={value => handleInputChange('isIUnderline', value)}
              style={styles.switch}
              trackColor={{false: '#767577', true: '#aaffaa'}}
              thumbColor={formData.isIUnderline ? '#00aa5f' : '#f4f3f4'}
            />
          </View>

          <View
            style={{
              display: 'flex',
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}>
            <Text
              style={
                formData.iSize
                  ? styles.label
                  : {...styles.label, color: '#ff5500'}
              }>
              Text Size:
            </Text>
            <TextInput
              placeholder="ex: 16"
              keyboardType="numeric"
              onChangeText={text => handleInputChange('iSize', text)}
              style={{
                ...styles.input,
                width: '65%',
                marginTop: '3%',
              }}
              value={formData.iSize ? formData.iSize.toString() : ''}
            />
          </View>

          <View>
            <Text style={styles.label}>Text Color Of Institution Name:</Text>
            <Picker
              selectedValue={formData.iColor}
              onValueChange={(itemValue, itemIndex) =>
                handleInputChange('iColor', itemValue)
              }
              style={styles.picker}>
              <Picker.Item label="Black" value="black" />
              <Picker.Item label="Red" value="red" />
              <Picker.Item label="Green" value="green" />
              <Picker.Item label="Blue" value="blue" />
              <Picker.Item label="White" value="white" />
            </Picker>
          </View>

          <View>
            <Text style={styles.label}>Font Of Institution Name:</Text>
            <Picker
              selectedValue={formData.iFont}
              onValueChange={(itemValue, itemIndex) =>
                handleInputChange('iFont', itemValue)
              }
              style={styles.picker}>
              <Picker.Item label="Helvetica Bold" value="Helvetica-Bold" />
              <Picker.Item label="Helvetica Italic" value="Helvetica-Oblique" />
              <Picker.Item
                label="Helvetica Bold-Italic"
                value="Helvetica-BoldOblique"
              />
              <Picker.Item label="Times New Roman Bold" value="Times-Bold" />
              <Picker.Item
                label="Times New Roman Italic"
                value="Times-Italic"
              />
              <Picker.Item
                label="Times New Roman Bold-Italic"
                value="Times-BoldItalic"
              />
              <Picker.Item label="Courier Bold" value="Courier-Bold" />
              <Picker.Item label="Courier Italic" value="Courier-Oblique" />
              <Picker.Item
                label="Courier Bold-Italic"
                value="Courier-BoldOblique"
              />
            </Picker>
          </View>
        </View>

        <View style={styles.box}>
          <View>
            <Text
              style={
                formData.pName
                  ? {...styles.label}
                  : {...styles.label, color: '#ff5500'}
              }>
              Exam Name:
            </Text>
            <TextInput
              placeholder="Edit"
              onChangeText={text => handleInputChange('pName', text)}
              style={styles.input}
              value={formData.pName ? formData.pName.toString() : ''}
            />
          </View>

          <View
            style={{
              ...styles.fieldContainer,
              display: 'flex',
              flexDirection: 'row',
              marginBottom: '0%',
            }}>
            <Text style={styles.label}>Underlined?</Text>
            <Switch
              value={formData.isPUnderline}
              onValueChange={value => handleInputChange('isPUnderline', value)}
              style={styles.switch}
              trackColor={{false: '#767577', true: '#aaffaa'}}
              thumbColor={formData.isPUnderline ? '#00aa5f' : '#f4f3f4'}
            />
          </View>

          <View
            style={{
              display: 'flex',
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}>
            <Text
              style={
                formData.pSize
                  ? styles.label
                  : {...styles.label, color: '#ff5500'}
              }>
              Text Size:
            </Text>
            <TextInput
              placeholder="ex: 9"
              keyboardType="numeric"
              onChangeText={text => handleInputChange('pSize', text)}
              style={{
                ...styles.input,
                width: '65%',
                marginTop: '3%',
              }}
              value={formData.pSize ? formData.pSize.toString() : ''}
            />
          </View>

          <View>
            <Text style={styles.label}>Text Color Of Exam Name:</Text>
            <Picker
              selectedValue={formData.pColor}
              onValueChange={(itemValue, itemIndex) =>
                handleInputChange('pColor', itemValue)
              }
              style={styles.picker}>
              <Picker.Item label="Black" value="black" />
              <Picker.Item label="Red" value="red" />
              <Picker.Item label="Green" value="green" />
              <Picker.Item label="Blue" value="blue" />
              <Picker.Item label="White" value="white" />
            </Picker>
          </View>

          <View>
            <Text style={styles.label}>Font Of Exam Name:</Text>
            <Picker
              selectedValue={formData.pFont}
              onValueChange={(itemValue, itemIndex) =>
                handleInputChange('pFont', itemValue)
              }
              style={styles.picker}>
              <Picker.Item label="Helvetica Bold" value="Helvetica-Bold" />
              <Picker.Item label="Helvetica Italic" value="Helvetica-Oblique" />
              <Picker.Item
                label="Helvetica Bold-Italic"
                value="Helvetica-BoldOblique"
              />
              <Picker.Item label="Times New Roman Bold" value="Times-Bold" />
              <Picker.Item
                label="Times New Roman Italic"
                value="Times-Italic"
              />
              <Picker.Item
                label="Times New Roman Bold-Italic"
                value="Times-BoldItalic"
              />
              <Picker.Item label="Courier Bold" value="Courier-Bold" />
              <Picker.Item label="Courier Italic" value="Courier-Oblique" />
              <Picker.Item
                label="Courier Bold-Italic"
                value="Courier-BoldOblique"
              />
            </Picker>
          </View>
        </View>

        {!students.length && (
          <View>
            <View
              style={{
                ...styles.fieldContainer,
                display: 'flex',
                flexDirection: 'row',
              }}>
              <Text style={styles.label}>Show Name Field?</Text>
              <Switch
                value={formData.isName}
                onValueChange={value => handleInputChange('isName', value)}
                style={styles.switch}
                trackColor={{false: '#767577', true: '#aaffaa'}}
                thumbColor={formData.isName ? '#00aa5f' : '#f4f3f4'}
              />
            </View>

            <View style={{display: 'flex', flexDirection: 'row'}}>
              <Text style={styles.label}>Show ID Box?</Text>
              <Switch
                value={formData.isRoll}
                onValueChange={value => handleInputChange('isRoll', value)}
                style={styles.switch}
                trackColor={{false: '#767577', true: '#aaffaa'}}
                thumbColor={formData.isRoll ? '#00aa5f' : '#f4f3f4'}
              />
            </View>

            {formData.isRoll ? (
              <View style={styles.fieldContainer}>
                <Text
                  style={
                    formData.rollDigit &&
                    formData.rollDigit > 0 &&
                    formData.rollDigit < 12
                      ? {...styles.label}
                      : {...styles.label, color: '#ff5500'}
                  }>
                  Number of Digits In ID (1 - 11):
                </Text>
                <TextInput
                  placeholder="ex: 7"
                  keyboardType="numeric"
                  onChangeText={text =>
                    handleInputChange('rollDigit', parseInt(text))
                  }
                  style={styles.input}
                  value={
                    formData.rollDigit ? formData.rollDigit.toString() : ''
                  }
                />
              </View>
            ) : null}

            <View
              style={{
                ...styles.fieldContainer,
                marginTop: formData.isRoll ? 0 : 20,
              }}>
              <Text style={styles.label}>Number of Sets:</Text>
              <RadioButton.Group
                onValueChange={newValue =>
                  handleInputChange('setCount', parseInt(newValue))
                }
                value={String(formData.setCount)}>
                <View style={styles.radioButton}>
                  <View style={styles.radioButtonRow}>
                    <RadioButton value="2" color="#00aa5f" />
                    <Text>2</Text>
                  </View>
                  <View style={styles.radioButtonRow}>
                    <RadioButton value="3" color="#00aa5f" />
                    <Text>3</Text>
                  </View>
                  <View style={styles.radioButtonRow}>
                    <RadioButton value="4" color="#00aa5f" />
                    <Text>4</Text>
                  </View>
                  <View style={styles.radioButtonRow}>
                    <RadioButton value="1" color="#00aa5f" />
                    <Text>None</Text>
                  </View>
                </View>
              </RadioButton.Group>
            </View>

            <View style={styles.fieldContainer}>
              <Text
                style={
                  formData.questionsCount
                    ? {...styles.label}
                    : {...styles.label, color: '#ff5500'}
                }>
                Number of Questions (1 - 100):
              </Text>
              <TextInput
                placeholder="ex: 25"
                keyboardType="numeric"
                onChangeText={text =>
                  handleInputChange('questionsCount', parseInt(text))
                }
                style={styles.input}
                value={
                  formData.questionsCount
                    ? formData.questionsCount.toString()
                    : ''
                }
              />
            </View>
          </View>
        )}
      </View>

      <View style={{...styles.button, marginTop: '5%'}}>
        <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
          <Text style={styles.submitButtonText}>
            {students.length ? 'Re-Generate' : 'Generate'}
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

export default OmrGenerationForm;
