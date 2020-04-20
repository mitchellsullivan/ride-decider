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
import {withGlobalContext} from '../GlobalContext';

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
      currCriteria,
      criteriaList,
      saveState,
      onChangeTemp,
      addCriteria,
      onChangeRain,
      delCriteria,
    } = this.props.global;
    return (
      <SafeAreaView style={[styles.container, {flex: 1}]}>
        <KeyboardAvoidingView style={{flex: 1, padding: 0, margin: 0, alignItems: 'center'}}
                              behavior={Platform.OS === "ios" ? 'padding' : undefined}
                              keyboardVerticalOffset={Platform.OS === "ios" ? 100 : 0}>
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
              <View style={[styles.listView, {flex: 0.75, width: 400}]}>
                <KeyboardAwareFlatList
                    style={[]}
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
                                 val={currCriteria.minGoodTemp}/>
              <CriteriaTextInput label={'Hi Temp F'}
                                 saveState={saveState}
                                 onChangeTemp={onChangeTemp}
                                 which={'hi'}
                                 val={currCriteria.maxGoodTemp}/>
              <CriteriaTextInput label={'Max Wind (mph)'}
                                 saveState={saveState}
                                 onChangeTemp={onChangeTemp}
                                 which={'mw'}
                                 val={currCriteria.maxWind}/>
            </View>
            <View style={{flexDirection:"row"}}>
              <View style={{flex: 1, marginTop: 5, alignItems: 'flex-start'}}>
                <Text style={{color: 'white'}}>Rain OK</Text>
                <Switch style={{marginTop: 5}}
                        ios_backgroundColor='green'
                        onValueChange={() => onChangeRain('curr')}
                        value={currCriteria.rainOkay}
                        disabled={false}/>
              </View>
              <View style={{flex: 1, marginTop: 5, alignItems: 'flex-start'}}>
                <Text style={{color: 'white'}}>Wet Roads OK</Text>
                <Switch style={{marginTop: 5}}
                        ios_backgroundColor='green'
                        onValueChange={()=> onChangeRain('prev')}
                        value={currCriteria.prevDayRainOkay}
                        disabled={currCriteria.rainOkay}/>
              </View>
              <View style={{flex: 1, marginTop: 5, alignItems: 'center'}}>
                <TouchableOpacity style={{marginTop: 20}}
                                  onPress={addCriteria}>
                  <View>
                    <Text style={{fontSize: 20, color: 'cyan'}}>
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