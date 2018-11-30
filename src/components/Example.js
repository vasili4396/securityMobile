import React from 'react'
import { View, StyleSheet, Text } from 'react-native'

export default ({ exampleText, ...props}) => (
  <View style={styles.resultContainer}>
    <Text style={{fontWeight: 'bold'}}>Пример задачи, которую решает данный раздел</Text>
    <Text style={{paddingTop: 10, paddingBottom: 25}}>
      {exampleText}
    </Text>
  </View>
)

const styles = StyleSheet.create({
  resultContainer: {
    paddingTop: 5,
    paddingHorizontal: 15,
    justifyContent: 'center'
  },
})