import React from 'react';
import {Text, TouchableOpacity, View} from 'react-native'
import {styles} from '../Styles'


export const DayRow = ({item, criteriaList}) => {
  let color = 'salmon'
  if (!criteriaList || criteriaList.length === 0) {
    color = 'lightgreen'
  } else {
    criteriaList.forEach((v, i, a) => {
      if (v.passes(item)) {
        color = 'lightgreen'
      }
    })
  }
  
  return (
    <TouchableOpacity onPress={() => {}}>
      <View style={[styles.row, {backgroundColor: color}]}>
        <View style={{flex: 3}}>
          <Text style={[{fontSize: 11}]}>
            {item.getDisplayString()}
          </Text>
        </View>
        <View style={{flex: 1}}>
          <Text>
            {item.userRating === -1 ? '' : item.userRating}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  )
}


