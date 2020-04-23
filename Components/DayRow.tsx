import React, {Component} from 'react';
import {Text, TouchableOpacity, View, StyleSheet} from 'react-native'
import {styles} from './styles'
import {Criteria, WeatherPeriod} from "./models";

type DayRowProps = {
  item: WeatherPeriod,
  criteriaList: Array<Criteria>
}

export const DayRow = ({item, criteriaList}: DayRowProps) => {
  let color = 'transparent';
  let shortDay = (item.name || '   ').substr(0, 3);
  let lastBorderWidth = item.idx === '14' || item.idx === '13' ? 0 : 0.25;

  return (
    <TouchableOpacity onPress={() => {}} style={{flex: 1}}>
      <View style={[styles.row, {backgroundColor: color, borderBottomWidth: lastBorderWidth}]}>
        <View style={{flex: 1}}>
            <Text style={{fontSize: 18, color: 'white'}}>{shortDay}</Text>
            <Text style={{fontSize: 24, color: 'white'}}>{item.temp}{'\u00b0'}{'F'}</Text>
        </View>
          <View style={{flex: 3}}>
              <Text style={{fontSize: 14, color: 'white', textAlign: 'left'}}>
                {item.xtrashortfc.split(/\s+\(/g)[0]}
              </Text>
              <Text style={{fontSize: 14, color: 'white', paddingTop: 5, textAlign: 'left'}}>
                  {item.windString} Winds
              </Text>
          </View>
        <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
          <Text style={ss.predictText}>Temp: {item.prediction.tempRatingStr}</Text>
          <Text style={ss.predictText}>Sky: {item.prediction.skyRatingStr}</Text>
          <Text style={ss.predictText}>Wind: {item.prediction.windRatingStr}</Text>
          {/*{goodbad === 'N' ? (*/}
          {/*    <Icon name={'frown'} color={'white'} size={26}/>*/}
          {/*): (*/}
          {/*    <Icon name={'smile'} color={'white'} size={26}/>*/}
          {/*)}*/}
        </View>
      </View>
    </TouchableOpacity>
  )
}


const ss = StyleSheet.create({
  predictText: {
    color: 'white',
    fontSize: 12,
    textAlign: 'left',
  }
})
