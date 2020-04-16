import {Keyboard, Text, TextInput, View} from 'react-native'
import {styles} from '../Styles'
import React from 'react'


export const CriteriaTextInput = ({label, saveState, onChangeTemp, which, val}) => {
  return (
    <View style={{flex: 1}}>
      <Text style={{fontSize: 12}}>{label}</Text>
      <TextInput keyboardType='numeric'
                 returnKeyLabel='Done'
                 returnKeyType='done'
                 onSubmitEditing={async () => {
                   Keyboard.dismiss();
                   await saveState();
                 }}
                 onChangeText={(text) => onChangeTemp(text, which)}
                 value={String(val)}
                 style={[styles.tempBox, {justifyContent: 'flex-start'}]}
                 maxLength={3}/>
    </View>
  )
}
