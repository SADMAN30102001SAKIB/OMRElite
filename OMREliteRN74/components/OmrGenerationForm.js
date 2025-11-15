import React from 'react';
import {
  ScrollView,
  View,
  TextInput,
  Text,
  Switch,
  TouchableOpacity,
} from 'react-native';
import {Picker} from '@react-native-picker/picker';

const OmrGenerationForm = ({
  formData,
  students,
  handleInputChange,
  handleSubmit,
}) => {
  return (
    <ScrollView className="flex-1 bg-[#0a0a0f]">
      <View className="px-5 py-6">
        {/* Header */}
        <View className="mb-6">
          <Text className="text-white text-2xl font-bold mb-1">
            Create OMR Sheet
          </Text>
          <View className="w-12 h-1 bg-primary rounded-full mb-2" />
          <Text className="text-white/40 text-sm">
            Configure your exam settings below
          </Text>
        </View>

        {/* Institution Section */}
        <View className="bg-white/5 rounded-2xl p-5 mb-4 border border-white/10">
          <Text className="text-white text-lg font-bold mb-4">
            Institution Details
          </Text>

          <View className="mb-4">
            <Text
              className={`text-sm font-medium mb-2 ${
                formData.iName ? 'text-white/60' : 'text-red-500'
              }`}>
              Institution Name *
            </Text>
            <TextInput
              placeholder="Enter institution name"
              placeholderTextColor="#666"
              onChangeText={text => handleInputChange('iName', text)}
              className="bg-white/5 text-white rounded-xl border border-white/20 px-4 py-3"
              value={formData.iName ? formData.iName.toString() : ''}
            />
          </View>

          <View className="flex-row items-center justify-between mb-4">
            <Text className="text-white/60 text-sm font-medium">
              Underlined Text
            </Text>
            <Switch
              value={formData.isIUnderline}
              onValueChange={value => handleInputChange('isIUnderline', value)}
              trackColor={{false: '#333', true: '#00ff5f33'}}
              thumbColor={formData.isIUnderline ? '#00ff5f' : '#666'}
            />
          </View>

          <View className="mb-4">
            <Text
              className={`text-sm font-medium mb-2 ${
                formData.iSize ? 'text-white/60' : 'text-red-500'
              }`}>
              Text Size
            </Text>
            <TextInput
              placeholder="e.g., 16"
              placeholderTextColor="#666"
              keyboardType="numeric"
              onChangeText={text => handleInputChange('iSize', text)}
              className="bg-white/5 text-white rounded-xl border border-white/20 px-4 py-3"
              value={formData.iSize ? formData.iSize.toString() : ''}
            />
          </View>

          <View className="mb-4">
            <Text className="text-white/60 text-sm font-medium mb-2">
              Text Color
            </Text>
            <View className="bg-white/5 rounded-xl border border-white/20 overflow-hidden">
              <Picker
                selectedValue={formData.iColor}
                onValueChange={itemValue =>
                  handleInputChange('iColor', itemValue)
                }
                style={{color: '#fff', backgroundColor: 'transparent'}}
                dropdownIconColor="#00ff5f">
                <Picker.Item label="Black" value="black" />
                <Picker.Item label="Red" value="red" />
                <Picker.Item label="Green" value="green" />
                <Picker.Item label="Blue" value="blue" />
                <Picker.Item label="White" value="white" />
              </Picker>
            </View>
          </View>

          <View>
            <Text className="text-white/60 text-sm font-medium mb-2">Font</Text>
            <View className="bg-white/5 rounded-xl border border-white/20 overflow-hidden">
              <Picker
                selectedValue={formData.iFont}
                onValueChange={itemValue =>
                  handleInputChange('iFont', itemValue)
                }
                style={{color: '#fff', backgroundColor: 'transparent'}}
                dropdownIconColor="#00ff5f">
                <Picker.Item label="Helvetica Bold" value="Helvetica-Bold" />
                <Picker.Item
                  label="Helvetica Italic"
                  value="Helvetica-Oblique"
                />
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
        </View>

        {/* Exam Section */}
        <View className="bg-white/5 rounded-2xl p-5 mb-4 border border-white/10">
          <Text className="text-white text-lg font-bold mb-4">
            Exam Details
          </Text>

          <View className="mb-4">
            <Text
              className={`text-sm font-medium mb-2 ${
                formData.pName ? 'text-white/60' : 'text-red-500'
              }`}>
              Exam Name *
            </Text>
            <TextInput
              placeholder="Enter exam name"
              placeholderTextColor="#666"
              onChangeText={text => handleInputChange('pName', text)}
              className="bg-white/5 text-white rounded-xl border border-white/20 px-4 py-3"
              value={formData.pName ? formData.pName.toString() : ''}
            />
          </View>

          <View className="flex-row items-center justify-between mb-4">
            <Text className="text-white/60 text-sm font-medium">
              Underlined Text
            </Text>
            <Switch
              value={formData.isPUnderline}
              onValueChange={value => handleInputChange('isPUnderline', value)}
              trackColor={{false: '#333', true: '#00ff5f33'}}
              thumbColor={formData.isPUnderline ? '#00ff5f' : '#666'}
            />
          </View>

          <View className="mb-4">
            <Text
              className={`text-sm font-medium mb-2 ${
                formData.pSize ? 'text-white/60' : 'text-red-500'
              }`}>
              Text Size
            </Text>
            <TextInput
              placeholder="e.g., 9"
              placeholderTextColor="#666"
              keyboardType="numeric"
              onChangeText={text => handleInputChange('pSize', text)}
              className="bg-white/5 text-white rounded-xl border border-white/20 px-4 py-3"
              value={formData.pSize ? formData.pSize.toString() : ''}
            />
          </View>

          <View className="mb-4">
            <Text className="text-white/60 text-sm font-medium mb-2">
              Text Color
            </Text>
            <View className="bg-white/5 rounded-xl border border-white/20 overflow-hidden">
              <Picker
                selectedValue={formData.pColor}
                onValueChange={itemValue =>
                  handleInputChange('pColor', itemValue)
                }
                style={{color: '#fff', backgroundColor: 'transparent'}}
                dropdownIconColor="#00ff5f">
                <Picker.Item label="Black" value="black" />
                <Picker.Item label="Red" value="red" />
                <Picker.Item label="Green" value="green" />
                <Picker.Item label="Blue" value="blue" />
                <Picker.Item label="White" value="white" />
              </Picker>
            </View>
          </View>

          <View>
            <Text className="text-white/60 text-sm font-medium mb-2">Font</Text>
            <View className="bg-white/5 rounded-xl border border-white/20 overflow-hidden">
              <Picker
                selectedValue={formData.pFont}
                onValueChange={itemValue =>
                  handleInputChange('pFont', itemValue)
                }
                style={{color: '#fff', backgroundColor: 'transparent'}}
                dropdownIconColor="#00ff5f">
                <Picker.Item label="Helvetica Bold" value="Helvetica-Bold" />
                <Picker.Item
                  label="Helvetica Italic"
                  value="Helvetica-Oblique"
                />
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
        </View>

        {/* Configuration Section */}
        {!students.length && (
          <View className="bg-white/5 rounded-2xl p-5 mb-4 border border-white/10">
            <Text className="text-white text-lg font-bold mb-4">
              Sheet Configuration
            </Text>

            <View className="flex-row items-center justify-between mb-4">
              <Text className="text-white/60 text-sm font-medium">
                Show Name Field
              </Text>
              <Switch
                value={formData.isName}
                onValueChange={value => handleInputChange('isName', value)}
                trackColor={{false: '#333', true: '#00ff5f33'}}
                thumbColor={formData.isName ? '#00ff5f' : '#666'}
              />
            </View>

            <View className="flex-row items-center justify-between mb-4">
              <Text className="text-white/60 text-sm font-medium">
                Show ID Box
              </Text>
              <Switch
                value={formData.isRoll}
                onValueChange={value => handleInputChange('isRoll', value)}
                trackColor={{false: '#333', true: '#00ff5f33'}}
                thumbColor={formData.isRoll ? '#00ff5f' : '#666'}
              />
            </View>

            {formData.isRoll && (
              <View className="mb-4">
                <Text
                  className={`text-sm font-medium mb-2 ${
                    formData.rollDigit &&
                    formData.rollDigit > 0 &&
                    formData.rollDigit < 12
                      ? 'text-white/60'
                      : 'text-red-500'
                  }`}>
                  Number of Digits in ID (1-11) *
                </Text>
                <TextInput
                  placeholder="e.g., 7"
                  placeholderTextColor="#666"
                  keyboardType="numeric"
                  onChangeText={text =>
                    handleInputChange('rollDigit', parseInt(text, 10))
                  }
                  className="bg-white/5 text-white rounded-xl border border-white/20 px-4 py-3"
                  value={
                    formData.rollDigit ? formData.rollDigit.toString() : ''
                  }
                />
              </View>
            )}

            <View className="mb-4">
              <Text className="text-white/60 text-sm font-medium mb-3">
                Number of Sets
              </Text>
              <View className="flex-row gap-x-2">
                <TouchableOpacity
                  onPress={() => handleInputChange('setCount', 2)}
                  className={`flex-1 items-center rounded-xl px-3 py-3 border ${
                    formData.setCount === 2
                      ? 'bg-primary/20 border-primary'
                      : 'bg-white/5 border-white/10'
                  }`}>
                  <Text
                    className={`text-sm font-medium ${
                      formData.setCount === 2 ? 'text-primary' : 'text-white'
                    }`}>
                    2
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => handleInputChange('setCount', 3)}
                  className={`flex-1 items-center rounded-xl px-3 py-3 border ${
                    formData.setCount === 3
                      ? 'bg-primary/20 border-primary'
                      : 'bg-white/5 border-white/10'
                  }`}>
                  <Text
                    className={`text-sm font-medium ${
                      formData.setCount === 3 ? 'text-primary' : 'text-white'
                    }`}>
                    3
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => handleInputChange('setCount', 4)}
                  className={`flex-1 items-center rounded-xl px-3 py-3 border ${
                    formData.setCount === 4
                      ? 'bg-primary/20 border-primary'
                      : 'bg-white/5 border-white/10'
                  }`}>
                  <Text
                    className={`text-sm font-medium ${
                      formData.setCount === 4 ? 'text-primary' : 'text-white'
                    }`}>
                    4
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => handleInputChange('setCount', 1)}
                  className={`flex-1 items-center rounded-xl px-3 py-3 border ${
                    formData.setCount === 1
                      ? 'bg-primary/20 border-primary'
                      : 'bg-white/5 border-white/10'
                  }`}>
                  <Text
                    className={`text-sm font-medium ${
                      formData.setCount === 1 ? 'text-primary' : 'text-white'
                    }`}>
                    None
                  </Text>
                </TouchableOpacity>
              </View>
            </View>

            <View>
              <Text
                className={`text-sm font-medium mb-2 ${
                  formData.questionsCount ? 'text-white/60' : 'text-red-500'
                }`}>
                Number of Questions (1-100) *
              </Text>
              <TextInput
                placeholder="e.g., 25"
                placeholderTextColor="#666"
                keyboardType="numeric"
                onChangeText={text =>
                  handleInputChange('questionsCount', parseInt(text, 10))
                }
                className="bg-white/5 text-white rounded-xl border border-white/20 px-4 py-3"
                value={
                  formData.questionsCount
                    ? formData.questionsCount.toString()
                    : ''
                }
              />
            </View>
          </View>
        )}

        {/* Generate Button */}
        <TouchableOpacity
          onPress={handleSubmit}
          activeOpacity={0.7}
          className="bg-primary rounded-2xl py-5 mb-6">
          <Text className="text-black text-center text-lg font-bold">
            {students.length ? 'Re-Generate OMR' : 'Generate OMR Sheet'}
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

export default OmrGenerationForm;
