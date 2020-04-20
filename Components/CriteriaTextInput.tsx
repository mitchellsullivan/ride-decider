import React from 'react'
import {Keyboard, Text, TextInput, View, StyleSheet} from 'react-native'

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
      <Text style={{fontSize: 14, color: 'white'}}>{label}</Text>
      <TextInput keyboardType='numeric'
                 keyboardAppearance='dark'
                 selectionColor={'white'}
                 returnKeyLabel='Done'
                 returnKeyType='done'
                 onSubmitEditing={async () => {
                   Keyboard.dismiss();
                   await saveState();
                 }}
                 onChangeText={(text) => onChangeTemp(text, which)}
                 value={String(val)}
                 style={[styles.tempBox]}
                 maxLength={3}/>
    </View>
  )
}

const styles = StyleSheet.create({
    tempBox: {
        width: 70,
        // borderWidth: 1,
        borderRadius: 10,
        borderColor: 'lightgray',
        height: 40,
        padding: 5,
        margin: 5,
        fontSize: 24,
        fontWeight: '400',
        textAlign: 'center',
        color: 'white',
        backgroundColor: '#555',
        justifyContent: 'flex-start'
    },
})