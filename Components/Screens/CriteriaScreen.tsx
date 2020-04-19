import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Switch,
  KeyboardAvoidingView,
  Platform
} from 'react-native'
import {styles} from '../Styles'
import {Criteria} from '../models'
import {SafeAreaView} from 'react-navigation'
import {CriteriaRow} from '../CriteriaRow'
import {CriteriaTextInput} from '../CriteriaTextInput'
import {KeyboardAwareFlatList} from 'react-native-keyboard-aware-scroll-view'
import { withGlobalContext } from '../GlobalContext';

class CriteriaScreen extends React.Component<any> {
  static navigationOptions = ({navigation}: any) => {
    return {
      title: 'Criteria',
    };
  };

  renderHeading = () => {
    return (
      <View style={[styles.headingView]}>
        <View style={{flex: 1}}>
          <Text style={styles.headingText}>
            Criteria
          </Text>
        </View>
      </View>
    )
  }

  render() {
    let {
      curr,
      criteriaList,
      saveState,
      onChangeTemp,
      addCriteria,
      onChangeRain,
      delCriteria
    } = this.props.global;
    return (
      <SafeAreaView style={[{flex: 1}]}>
        <KeyboardAvoidingView style={{flex: 1, padding: 0, margin: 0, alignItems: 'center'}}
                              behavior={Platform.OS === "ios" ? 'padding' : undefined}
                              keyboardVerticalOffset={Platform.OS === "ios" ? 64 : 0}>
        {this.renderHeading()}

          {!criteriaList || criteriaList.length === 0 ? (
            <View style={
              {flex: 0.75, backgroundColor: 'lightgray', width: 350}
            }>
              <Text style={{
                textAlign: 'center',
                fontSize: 20,
                marginTop: 20}}>
                (No criteria set.)
              </Text>
            </View>
          ) : (
            <View style={[styles.listView, {flex: 0.75, backgroundColor: 'yellow'}]}>
              <KeyboardAwareFlatList
                style={[styles.scroll, {backgroundColor: 'gray', flex: 1}]}
                data={criteriaList}
                renderItem={({item}) =>
                  <CriteriaRow delCriteria={delCriteria}
                               item={item}/>}
                keyExtractor={({uuid}) => uuid}
              />
            </View>
          )}
          <View style={[{flex: 0.25}, styles.boxView]}>
            <View style={{flexDirection:"row"}}>
              <CriteriaTextInput label={'Lo Temp F'}
                                 saveState={saveState}
                                 onChangeTemp={onChangeTemp}
                                 which={'lo'}
                                 val={curr.minGoodTemp}/>
              <CriteriaTextInput label={'Hi Temp F'}
                                 saveState={saveState}
                                 onChangeTemp={onChangeTemp}
                                 which={'hi'}
                                 val={curr.maxGoodTemp}/>
              <CriteriaTextInput label={'Max Wind (mph)'}
                                 saveState={saveState}
                                 onChangeTemp={onChangeTemp}
                                 which={'mw'}
                                 val={curr.maxWind}/>
            </View>
            <View style={{flexDirection:"row"}}>
              <View style={{flex: 1, marginTop: 5, alignItems: 'flex-start'}}>
                <Text>Rain OK</Text>
                <Switch style={{marginTop: 5}}
                        ios_backgroundColor="#3e3e3e"
                        onValueChange={() => onChangeRain('curr')}
                        value={curr.rainOkay}
                        disabled={false}/>
              </View>
              <View style={{flex: 1, marginTop: 5, alignItems: 'flex-start'}}>
                <Text>Wet Roads OK</Text>
                <Switch style={{marginTop: 5}}
                        ios_backgroundColor="#3e3e3e"
                        onValueChange={()=> onChangeRain('prev')}
                        value={curr.prevDayRainOkay}
                        disabled={curr.rainOkay}/>
              </View>
              <View style={{flex: 1, marginTop: 5, alignItems: 'center'}}>
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


export default withGlobalContext(CriteriaScreen);