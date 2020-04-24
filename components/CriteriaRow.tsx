import React, {Component} from 'react';
import {Text, TouchableOpacity, View} from 'react-native';
import {styles} from './Styles'
import IconWithBadge from './IconWithBadge'
import {Criteria} from '../types';

type CriteriaRowProps = {
    delCriteria: any,
    item: Criteria
}

export const CriteriaRow = ({delCriteria, item}: CriteriaRowProps) => {
  return (
      <View style={[styles.row, {flexDirection: 'row', padding: 10}]}>
        <View style={{flex: 1, flexDirection: 'column'}}>
          <View>
            <Text style={{fontSize: 13, color: 'white'}}>
              {item.getDisplayString()}
            </Text>
          </View>
        </View>
        <View>
          <TouchableOpacity onPress={() => delCriteria(item.uuid)}>
            <IconWithBadge name={'x'}
                           badgeCount={0}
                           size={24}
                           color={'red'}/>
          </TouchableOpacity>
        </View>
      </View>
  );
}
