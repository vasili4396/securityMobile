import React from 'react'
import {
  Text,
  StyleSheet,
  TouchableOpacity
} from 'react-native'

export default ({ buttonText, onPress, color, buttonTextStyle }) => (
  <TouchableOpacity onPress={onPress} style={[styles.defaultButtonOpacity, {borderColor: color ? color : primaryColor}]}>
    <Text style={[styles.defaultButtonText, {color: color ? color: primaryColor}, buttonTextStyle]}>
      {buttonText}
    </Text>
  </TouchableOpacity>
)

const styles = StyleSheet.create({
  defaultButtonOpacity: {
    backgroundColor: 'transparent',
    borderRadius: 20,
    borderWidth: 2
  },
  defaultButtonText: {
    fontSize: 20,
    padding: 15,
    alignSelf: 'center'
  }
})