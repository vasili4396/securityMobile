import React from 'react'
import { View, StyleSheet, Text } from 'react-native'

function severalResults (results) {
  let res = []
  for (result of results) {
    res.push(
      <Text>{result + ', '}</Text>
    )
  }
  return res
}

export default ({ results, between, ...props}) => (
  <View style={styles.resultContainer}>
    <Text style={{fontWeight: 'bold'}}>Ответ</Text>
    {severalResults(results)}
    <Text style={{fontWeight: 'bold'}}>Промежуточные результаты</Text>
    {severalResults(between)}
  </View>
)

const styles = StyleSheet.create({
  resultContainer: {
    paddingTop: 15,
    justifyContent: 'center',
    alignItems: 'center'
  },
})