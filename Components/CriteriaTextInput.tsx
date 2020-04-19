import {Keyboard, Text, TextInput, View} from 'react-native'
import {styles} from './Styles'
import React from 'react'

type CriteriaTextInputProps = {
    label: string,
    saveState: () => void,
    onChangeTemp: Function,
    which: string,
    val: any
}

export const CriteriaTextInput = (props: CriteriaTextInputProps) => {
    const {label, saveState, onChangeTemp, which, val} = props;
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
