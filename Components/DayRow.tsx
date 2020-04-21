import React from 'react';
import {Text, TouchableOpacity, View} from 'react-native'
import {styles} from './Styles'
import {Criteria, WeatherPeriod} from "./models";
import Icon from "react-native-vector-icons/Feather";

type DayRowProps = {
  item: WeatherPeriod,
  criteriaList: Array<Criteria>
}

export const DayRow = ({item, criteriaList}: DayRowProps) => {
  let goodbad = 'N';
  let color = 'salmon'
  if (!criteriaList || criteriaList.length === 0) {
    goodbad = 'Y';
    color = 'lightgreen';
  } else {
    criteriaList.forEach((v: Criteria) => {
      if (v.passes(item)) {
        goodbad = 'Y';
        color = 'lightgreen';
      }
    })
  }
  color = 'transparent';

  let shortDay = (item.name || '   ').substr(0, 3);

  let lastBorderColor = shortDay !== 'Mon' ? 'transparent' : 'gray';
  let lastBorderWidth = item.idx === '14' || item.idx === '13' ? 0 : 0.25;

  return (
    <TouchableOpacity onPress={() => {}} style={{flex: 1}}>
      <View style={[styles.row, {backgroundColor: color, borderBottomWidth: lastBorderWidth}]}>
        <View style={{flex: 1}}>
            <Text style={{fontSize: 18, color: 'white'}}>{shortDay}</Text>
            <Text style={{fontSize: 24, color: 'white'}}>{item.temp}{'\u00b0'}{'F'}</Text>
        </View>
          <View style={{flex: 3}}>
              <Text style={{fontSize: 14, color: 'white', paddingTop: 0, textAlign: 'left'}}>
                  {item.shortForecast}.
              </Text>
              <Text style={{fontSize: 14, color: 'white', paddingTop: 5, textAlign: 'left'}}>
                  {item.windString} Winds
              </Text>
          </View>
        {/*<View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>*/}
          {/*{goodbad === 'N' ? (*/}
          {/*    <Icon name={'frown'} color={'white'} size={26}/>*/}
          {/*): (*/}
          {/*    <Icon name={'smile'} color={'white'} size={26}/>*/}
          {/*)}*/}
        {/*</View>*/}
      </View>
    </TouchableOpacity>
  )
}


