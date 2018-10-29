import React from 'react'
import { View, Text } from 'react-native'

const workTypesColor = {
	'W': 'white',
	'H': goodColor,
	'V': '#f5f3a9',
	'A': dangerColor
}

const ColoredCalendarView = (props) => {
	const { children, type, style } = props
	
	coloredBackground = function (type) {
		return {
			backgroundColor: workTypesColor[type]
		}
	}

  return (
    <View {...this.props} style={[style, coloredBackground(type)]}>
    	{ children }
    </View>
  )
}

const ColoredCalendarText = (props) => {
	const { children, type, style } = props
	coloredText = function (type) {
		return {
			color: (Object.keys(workTypes).find(workType => workType === type)) ? 'black' : '#A9A9A9'
		}
	}

  return (
    <Text {...this.props} style={[style, coloredText(type)]}>
    	{ children }
    </Text>
  )
}

export {ColoredCalendarView, ColoredCalendarText}