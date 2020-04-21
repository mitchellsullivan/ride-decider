import React, {Component} from 'react';
import {Text, TouchableOpacity, View} from 'react-native';
import {styles} from './styles'
import IconWithBadge from './IconWithBadge'
import {Criteria} from './models';

type CriteriaRowProps = {
    delCriteria: any,
    item: Criteria
}

export const CriteriaRow = ({delCriteria, item}: CriteriaRowProps) => {
  return (
      <View style={[styles.row, {flexDirection: 'row', padding: 10}]}>
        <View style={{flex: 1, flexDirection: 'column'}}>
          <View>
            <Text style={{fontSize: 14, color: 'white', paddingLeft: 10, paddingTop: 10}}>
              {item.getDisplayString()}
            </Text>
          </View>
          {/*<View>*/}
          {/*  <Text style={{fontSize: 10}}>{item.uuid}</Text>*/}
          {/*</View>*/}
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
