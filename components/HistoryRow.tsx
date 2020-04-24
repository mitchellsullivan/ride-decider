import React from 'react';
import {
  Text,
  TouchableOpacity,
  View
} from 'react-native'
import {styles} from './Styles'

export const HistoryRow = ({item, index}: any) => {
  return (
    <TouchableOpacity onPress={() => {}}>
      <View style={[styles.row, {padding: 10, borderTopWidth: 0}]}>
        <View style={{flex: 3}}>
          <Text style={[{fontSize: 11, color: 'white'}]}>
            {item.getDisplayString()}
          </Text>
        </View>
        <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
          <Text style={{color: 'white'}}>
            {/*{item.userRating === -1 ? 'NR' : item.userRating + 1}*/}
            {item.likedStatus === -1 ? 'DISLIKED' : item.likedStatus === 0 ? 'NEUTRAL' : 'LIKED'}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  )
}


