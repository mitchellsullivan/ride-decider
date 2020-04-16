import React from 'react';
import {Text, TouchableOpacity, View} from 'react-native'
import {styles} from '../Styles'


export const DayRow = ({item, criteriaList}) => {
  let goodbad = 'N';
  let color = 'salmon'
  if (!criteriaList || criteriaList.length === 0) {
    goodbad = 'Y';
    color = 'lightgreen';
  } else {
    criteriaList.forEach((v, i, a) => {
      if (v.passes(item)) {
        goodbad = 'Y';
        color = 'lightgreen';
      }
    })
  }
  color = 'white';
  return (
    <TouchableOpacity onPress={() => {}}>
      <View style={[styles.row, {backgroundColor: color}]}>
        <View style={{flex: 3}}>
          <Text style={[{fontSize: 11}]}>
            {item.getDisplayString()}
          </Text>
        </View>
        <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
          <Text>
            {goodbad}
            {/*{item.userRating === -1 ? '' : item.userRating}*/}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  )
}


