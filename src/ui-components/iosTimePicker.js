import React from 'react'
import {
  DatePickerIOS,
  View,
  StyleSheet,
} from 'react-native'

const iosTimePicker = (props) => {
	const { chosenTime, mode = 'time', onTimeChange, style } = props
	return (
		<View {...this.props} style={style}>
			<DatePickerIOS
				date={chosenTime}
				mode={mode}
				onDateChange={onTimeChange}
			/>
		</View>
	)
}
