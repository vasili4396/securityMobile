import React from 'react'
import { View, TextInput, StyleSheet } from 'react-native'

export default ({ placeholder, onChangeText, secureTextEntry, borderBottomColor, textInputStyle, viewContainerStyle, ...props}) => (
  <View style={[styles.textInputContainer, {borderBottomColor: borderBottomColor}]}>
    <TextInput
      style={[styles.defaultTextInputStyle, textInputStyle]}
      secureTextEntry={secureTextEntry}
      placeholder={placeholder}
      autoCapitalize='none'
      autoCorrect={false}
      onChangeText={onChangeText}
      underlineColorAndroid='transparent'
      {...props}
    />
  </View>
)

const styles = StyleSheet.create({
  defaultContainerStyle: {
    flex: 1,
  },
  textInputContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'flex-end',
    paddingBottom: 5,
    height: 45,
    borderBottomColor: primaryColor,
    borderBottomWidth: 1.5
  },
  defaultTextInputStyle: {
    flex: 1,
    paddingTop: 10,
    paddingLeft: 0,
    fontSize: 14,
  }
})