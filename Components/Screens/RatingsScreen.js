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

export default class RatingsScreen extends React.Component {
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
      historyList,
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
                Past Ratings
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
        </KeyboardAvoidingView>
      </SafeAreaView>
    );
  }
}
