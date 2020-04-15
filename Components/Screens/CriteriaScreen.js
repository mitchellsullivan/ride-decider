import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Switch,
  KeyboardAvoidingView,
  FlatList,
} from 'react-native'
import {styles} from '../../Styles'
import {Criteria} from '../models'
import {SafeAreaView} from 'react-navigation'
import {CriteriaRow} from '../CriteriaRow'
import {CriteriaTextInput} from '../CriteriaTextInput'

export default class CriteriaScreen extends React.Component {
  static navigationOptions = ({navigation}) => {
    return {
      title: 'Criteria',
    };
  };
  
  render() {
    const {navigate} = this.props.navigation;
    let {
      curr,
      criteriaList,
      saveState,
      onChangeTemp,
      addCriteria,
      onChangeRain,
      delCriteria
    } = this.props.screenProps;
    return (
      <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView style={{flex: 1}}
                            behavior='padding'>
        <View style={[styles.headingView, {
          flexDirection: 'row',
          marginBottom: 5,
          flex: 0.05}]}>
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
          <View style={
            {flex: 0.60, backgroundColor: 'lightgray', width: 350}
          }>
            <Text style={{
              textAlign: 'center',
              fontSize: 20,
              marginTop: 20}}>
              (No criteria set.)
            </Text>
          </View>
        ) : (
          <View style={[styles.listView, {flex: 0.60}]}>
            <FlatList
              style={styles.scroll}
              data={criteriaList}
              renderItem={({item}) =>
                <CriteriaRow delCriteria={delCriteria}
                             item={item}/>}
              keyExtractor={({uuid}) => uuid}
            />
          </View>
        )}
        <View style={[{flex: 0.35}, styles.boxView]}>
          <View style={{flexDirection:"row"}}>
            <CriteriaTextInput label={'Lo Temp F'}
                               saveState={saveState}
                               onChangeTemp={onChangeTemp}
                               which={'lo'}
                               curr={curr}/>
            <CriteriaTextInput label={'Hi Temp F'}
                               saveState={saveState}
                               onChangeTemp={onChangeTemp}
                               which={'hi'}
                               curr={curr}/>
            <CriteriaTextInput label={'Max Wind (mph)'}
                               saveState={saveState}
                               onChangeTemp={onChangeTemp}
                               which={'mw'}
                               curr={curr}/>
          </View>
          <View style={{flexDirection:"row"}}>
            <View style={{flex: 1, marginTop: 5}}>
              <Text>Rain OK</Text>
              <Switch style={{marginTop: 5}}
                      ios_backgroundColor="#3e3e3e"
                      onValueChange={() => onChangeRain('curr')}
                      value={curr.rainOkay}/>
            </View>
            <View style={{flex: 1, marginTop: 5}}>
              <Text>Wet Roads OK</Text>
              <Switch style={{marginTop: 5}}
                      ios_backgroundColor="#3e3e3e"
                      onValueChange={()=> onChangeRain('prev')}
                      value={curr.prevDayRainOkay}/>
            </View>
            <View style={{flex: 1, marginTop: 5, paddingLeft: 50}}>
              <TouchableOpacity style={{marginTop: 20}}
                                onPress={addCriteria}>
                <View>
                  <Text style={{fontSize: 20, color: 'blue'}}>
                    Add
                  </Text>
                </View>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </KeyboardAvoidingView>
      </SafeAreaView>
    );
  }
}
