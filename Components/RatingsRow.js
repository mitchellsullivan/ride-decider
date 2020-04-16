import React from 'react';
import {Text, TouchableOpacity, View} from 'react-native'
import {styles} from '../Styles'


export const RatingsRow = ({item}) => {
  return (
    <TouchableOpacity onPress={() => {}}>
      <View style={[styles.row]}>
        <View style={{flex: 3}}>
          <Text style={[{fontSize: 11}]}>
            {item.getDisplayString()}
          </Text>
        </View>
        <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
          <Text>
            {item.userRating === -1 ? 'NR' : item.userRating + 1}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  )
}


