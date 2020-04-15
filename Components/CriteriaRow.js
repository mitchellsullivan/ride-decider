import React from 'react';
import {Text, TouchableOpacity, View} from 'react-native'
import {styles} from '../Styles'

export const CriteriaRow = ({delCriteria, item}) => {
  return (
    <TouchableOpacity onPress={() => delCriteria(item.uuid)}>
      <View style={[styles.row, {backgroundColor: 'white', flexDirection: 'column'}]}>
        <View>
          <Text style={{fontSize: 10}}>
            {item.getDisplayString()}
          </Text>
        </View>
        <View>
          <Text style={{fontSize: 10}}>{item.uuid}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}