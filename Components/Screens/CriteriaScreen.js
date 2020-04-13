import React from 'react';
import {
  Button,
  View,
  Platform,
  Text,
  StatusBar,
  TouchableOpacity, TextInput, Keyboard, Switch, KeyboardAvoidingView, AsyncStorage,
} from 'react-native'
import Icon from 'react-native-vector-icons/FontAwesome';
import {styles} from '../../Styles'
import {Criterium, WeatherPeriod, DEFAULT_HI, DEFAULT_LO} from '../models'

export default class CriteriaScreen extends React.Component {
  static navigationOptions = ({navigation}) => {
    return {
      title: 'Criteria',
    };
  };
  
  async componentDidMount(): void {

  }
  
  
  render() {
    const {navigate} = this.props.navigation;
    const sp = this.props.screenProps;
    return (
      <KeyboardAvoidingView style={styles.container}
                            behavior='padding'>
        <View style={styles.boxView}>
          <View style={{flexDirection:"row"}}>
            <View style={{flex: 0.5}}>
              <Text>Lo Good Temp (F)</Text>
              <TextInput keyboardType='numeric'
                         returnKeyLabel='Done'
                         returnKeyType='done'
                         onSubmitEditing={async () => {
                           Keyboard.dismiss();
                           await sp.saveCriteria();
                         }}
                         onChangeText={(text) => sp.onChangeTemp(text, 'lo')}
                         value={String(sp.criteria.minGoodTemp)}
                         style={[styles.tempBox, {justifyContent: 'flex-start'}]}
                         maxLength={3}/>
            </View>
            <View style={{flex: 0.5}}>
              <Text>Hi Good Temp (F)</Text>
              <TextInput keyboardType='numeric'
                         returnKeyLabel='Done'
                         returnKeyType='done'
                         onSubmitEditing={async () => {
                           Keyboard.dismiss();
                           await sp.saveCriteria();
                         }}
                         onChangeText={text => sp.onChangeTemp(text, 'hi')}
                         value={String(sp.criteria.maxGoodTemp)}
                         style={[styles.tempBox, {justifyContent: 'flex-end'}]}
                         maxLength={3}/>
            </View>
          </View>
          <View style={{flexDirection:"row"}}>
            <View style={{flex: 1, marginTop: 5}}>
              <Text>Rain Today OK</Text>
              <Switch
                style={{marginTop: 5}}
                ios_backgroundColor="#3e3e3e"
                onValueChange={async ()=>{
                  sp.criteria.rainOkay =
                    !sp.criteria.rainOkay;
                  await sp.saveCriteria();
                }}
                value={sp.criteria.rainOkay}
              />
            </View>
            <View style={{flex: 1, marginTop: 5}}>
              <Text>Rain Yesterday OK</Text>
              <Switch
                style={{marginTop: 5}}
                ios_backgroundColor="#3e3e3e"
                onValueChange={async ()=>{
                  sp.criteria.prevDayRainOkay =
                    !sp.criteria.prevDayRainOkay;
                  await sp.saveCriteria();
                }}
                value={sp.criteria.prevDayRainOkay}
              />
            </View>
          </View>
        </View>
      </KeyboardAvoidingView>
    );
  }
}
