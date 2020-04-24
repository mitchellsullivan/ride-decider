import React, {Component} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Switch,
  KeyboardAvoidingView,
  Platform,
  StyleSheet
} from 'react-native'
import {styles} from '../Styles'
import {Criteria} from '../../types'
import {SafeAreaView} from 'react-navigation'
import {CriteriaRow} from '../CriteriaRow'
import {CriteriaTextInput} from '../CriteriaTextInput'
import {KeyboardAwareFlatList} from 'react-native-keyboard-aware-scroll-view'
import {withGlobalContext} from '../GlobalContext';
import {DEFAULT_HI, DEFAULT_LO} from "../../data";

class CriteriaScreen extends Component<any> {
  static navigationOptions = ({navigation}: any) => {
    return {
      title: 'Criteria',
    };
  };

  renderHeading = () => {
    return (
        <View style={[styles.headingView]}>
          <View style={{flex: 1}}>
            <Text style={styles.headingText}>Whitelist</Text>
          </View>
        </View>
    )
  }

  renderList = () => {
    const { criteriaList, delCriteria } = this.props.global;
    const isEmpty = !criteriaList || criteriaList.length === 0;
    return isEmpty ? (
      <View style={ss.noDataView}>
        <Text style={ss.noData}>(No items set.)</Text>
      </View>
    ) : (
      <View style={[styles.listView, {flex: 0.75, width: '100%', flexDirection: 'row'}]}>
        <KeyboardAwareFlatList
          style={{flex: 1}}
          data={criteriaList}
          renderItem={({item}) =>
            <CriteriaRow delCriteria={delCriteria}
                         item={item}/>}
          keyExtractor={({uuid}) => uuid}
        />
      </View>
    )
  }

  renderTextInput = (label: string, which: string, val: number) => {
    let {saveCriteria, onChangeCriteriaTxtBox} = this.props.global;
    return (
      <CriteriaTextInput {
        ...{label, which, val, onChangeCriteriaTxtBox, saveCriteria}}/>
    )
  }

  render() {
    let {
      currCriteria,
      addCriteria,
      onChangeRain,
    } = this.props.global;

    const behave = Platform.OS === "ios" ? 'padding' : undefined;
    const off = Platform.OS === "ios" ? 90 : 0;

    return (
      <SafeAreaView style={[styles.container, {flex: 1}]}>
        <KeyboardAvoidingView style={ss.kav} behavior={behave} keyboardVerticalOffset={off}>
          {this.renderHeading()}
          {this.renderList()}
          <View style={[{flex: 0.25}, styles.boxView]}>
            <View style={{flexDirection:"row"}}>
              {this.renderTextInput('Lo Temp F', 'lo', currCriteria.minGoodTemp)}
              {this.renderTextInput('Hi Temp F', 'hi', currCriteria.maxGoodTemp)}
              {this.renderTextInput('Max Wind', 'mw', currCriteria.maxWind || '')}
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

const ss = StyleSheet.create({
  noData: {
    textAlign: 'center',
    fontSize: 20,
    marginTop: 20,
    color: 'white'
  },
  noDataView: {flex: 0.75,
    backgroundColor: 'black',
    flexDirection: 'column',
    justifyContent: 'center'
  },
  kav: {
    flex: 1,
    padding: 0,
    margin: 0,
    alignItems: 'center'
  },
})

export default withGlobalContext(CriteriaScreen);
