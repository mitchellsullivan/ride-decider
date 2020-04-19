import React from 'react';
import {Text, TouchableOpacity, TouchableHighlight, View} from 'react-native'
import {styles} from './Styles'
import IconWithBadge from './IconWithBadge'
import {Criteria} from './models';

type CriteriaRowProps = {
    delCriteria: any,
    item: Criteria
}

export const CriteriaRow = ({delCriteria, item}: CriteriaRowProps) => {
  return (
      <View style={[styles.row, {backgroundColor: 'white', flexDirection: 'row'}]}>
        <View style={{flex: 6, flexDirection: 'column'}}>
          <View>
            <Text style={{fontSize: 10}}>
              {item.getDisplayString()}
            </Text>
          </View>
          <View>
            <Text style={{fontSize: 10}}>{item.uuid}</Text>
          </View>
        </View>
        <View>
          <TouchableOpacity onPress={() => delCriteria(item.uuid)}>
            <IconWithBadge name={'x'}
                           badgeCount={0}
                           size={30}
                           color={'darkred'}/>
          </TouchableOpacity>
        </View>
      </View>
  );
}