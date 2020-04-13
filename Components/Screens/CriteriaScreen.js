import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  Keyboard,
  Switch,
  KeyboardAvoidingView,
  FlatList,
} from 'react-native'
import {styles} from '../../Styles'
import {Criteria} from '../models'

export default class CriteriaScreen extends React.Component {
  static navigationOptions = ({navigation}) => {
    return {
      title: 'Criteria',
    };
  };
  
  // async componentDidMount(): void {
  //
  // }
  
  renderItem(item: Criteria) {
    return (
      <TouchableOpacity onPress={() => this.props.screenProps.delCriteria(item.uuid)}>
        <View style={[styles.row, {backgroundColor: 'white', flexDirection: 'column'}]}>
          <View>
            <Text style={{fontSize: 11}}>
              {item.getDisplayString()}
            </Text>
          </View>
          <View>
            <Text style={{fontSize: 11}}>{item.uuid}</Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  }
  
  render() {
    const {navigate} = this.props.navigation;
    let {curr, criteriaList, saveState, onChangeTemp, addCriteria, onChangeRain } = this.props.screenProps;
    return (
      <KeyboardAvoidingView style={styles.container}
                            behavior='padding'>
        <View style={styles.topSpace}/>
        <View style={[styles.headingView, {flexDirection: 'row', marginBottom: 5}]}>
          <View style={{flex: 1}}>
            <View style={styles.buttView}>
            </View>
          </View>
          <View style={{flex: 1}}>
            <Text style={styles.headingText}>
              Criteria
            </Text>
          </View>
          <View style={{flex: 1}}>
          </View>
        </View>
        {!criteriaList || criteriaList.length === 0 ? (
          <View style={{flex: 0.75, backgroundColor: 'lightgray', width: 350}}>
            <Text style={{textAlign: 'center', fontSize: 20, marginTop: 20}}>
              (No criteria set.)
            </Text>
          </View>
        ) : (
          <View style={styles.listView}>
            <FlatList
              style={styles.scroll}
              data={criteriaList}
              renderItem={({item}) => this.renderItem(item)}
              keyExtractor={item => item.uuid}
            />
          </View>
        )}
        <View style={styles.boxView}>
          <View style={{flexDirection:"row"}}>
            <View style={{flex: 1}}>
              <Text style={{fontSize: 12}}>Lo Good Temp (F)</Text>
              <TextInput keyboardType='numeric'
                         returnKeyLabel='Done'
                         returnKeyType='done'
                         onSubmitEditing={async () => {
                           Keyboard.dismiss();
                           await saveState();
                         }}
                         onChangeText={(text) => onChangeTemp(text, 'lo')}
                         value={String(curr.minGoodTemp)}
                         style={[styles.tempBox, {justifyContent: 'flex-start'}]}
                         maxLength={3}/>
            </View>
            <View style={{flex: 1}}>
              <Text style={{fontSize: 12}}>Hi Good Temp (F)</Text>
              <TextInput keyboardType='numeric'
                         returnKeyLabel='Done'
                         returnKeyType='done'
                         onSubmitEditing={async () => {
                           Keyboard.dismiss();
                           await saveState();
                         }}
                         onChangeText={text => onChangeTemp(text, 'hi')}
                         value={String(curr.maxGoodTemp)}
                         style={[styles.tempBox, {justifyContent: 'flex-end'}]}
                         maxLength={3}/>
            </View>
            <View style={{flex: 1}}>
              <Text style={{fontSize: 12}}>Max Wind (mph)</Text>
              <TextInput keyboardType='numeric'
                         returnKeyLabel='Done'
                         returnKeyType='done'
                         onSubmitEditing={async () => {
                           Keyboard.dismiss();
                           await saveState();
                         }}
                         onChangeText={text => onChangeTemp(text, 'mw')}
                         value={String(curr.maxWind)}
                         style={[styles.tempBox, {justifyContent: 'flex-end'}]}
                         maxLength={3}/>
            </View>
          </View>
          <View style={{flexDirection:"row"}}>
            <View style={{flex: 1, marginTop: 5}}>
              <Text>Rain OK</Text>
              <Switch
                style={{marginTop: 5}}
                ios_backgroundColor="#3e3e3e"
                onValueChange={() => onChangeRain('curr')}
                value={curr.rainOkay}
              />
            </View>
            <View style={{flex: 1, marginTop: 5}}>
              <Text>Wet Roads OK</Text>
              <Switch
                style={{marginTop: 5}}
                ios_backgroundColor="#3e3e3e"
                onValueChange={()=> onChangeRain('prev')}
                value={curr.prevDayRainOkay}
              />
            </View>
            <View style={{flex: 1, marginTop: 5, paddingLeft: 50}}>
              <TouchableOpacity style={{marginTop: 20}}
                                onPress={addCriteria}>
                <View>
                  <Text style={{fontSize: 20, color: 'blue'}}>Add It</Text>
                </View>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </KeyboardAvoidingView>
    );
  }
}
