import React, {Component} from 'react';
import {TouchableHighlight} from 'react-native';
import IconWithBadge from './IconWithBadge';


export const StarButton = ({index, currIdx, onPress}: any) => {
  const active = currIdx >= index && currIdx > -1;

  return (
    <TouchableHighlight style={{
                          backgroundColor: active ? 'gold' : 'gray',
                          borderRadius: 50,
                          marginLeft: 5
                        }}
                        onPress={() => onPress(index)}
                        underlayColor={active ? 'goldenrod' : 'dimgray'}>
      <IconWithBadge name='star'
                     badgeCount={0}
                     size={24}
                     color={active ? '#555' : 'whitesmoke'}/>
    </TouchableHighlight>
  )
}
