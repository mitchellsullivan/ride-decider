import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Switch,
  KeyboardAvoidingView,
  FlatList,
  ScrollView
} from 'react-native'
import {styles} from '../../Styles'
import {Criteria} from '../models'
import {SafeAreaView} from 'react-navigation'
import {RatingsRow} from '../RatingsRow'
import {CriteriaTextInput} from '../CriteriaTextInput'

export default class RatingsScreen extends React.Component {
  static navigationOptions = ({navigation}) => {
    return {
      title: 'Criteria',
    };
  };
  
  renderHeading = () => {
    return (
      <View style={[styles.headingView]}>
        <View style={{flex: 1}}>
          <Text style={styles.headingText}>
            Past Ratings
          </Text>
        </View>
      </View>
    )
  }
  
  render() {
    const {navigate} = this.props.navigation;
    let {
      history,
      delCriteria
    } = this.props.screenProps;
    return (
      <SafeAreaView style={[{flex: 1, justifyContent: 'center', padding: 0, margin:0}]}>
        <KeyboardAvoidingView style={{flex: 1, padding: 0, margin: 0, alignItems: 'center'}}
                              behavior={Platform.OS === "ios" ? "padding" : null}
                              keyboardVerticalOffset={Platform.OS === "ios" ? 100 : 0}>
            {this.renderHeading()}
            {!history || history.length === 0 ? (
              <View style={
                {flex: 0.90, backgroundColor: 'white', width: '100%', marginTop: 10}
              }>
                <Text style={{
                  textAlign: 'center',
                  fontSize: 20,
                  marginTop: 20}}>
                  (No days rated.)
                </Text>
              </View>
            ) : (
              <View style={[styles.listView, {flex: 0.90, marginTop: 10}]}>
                <FlatList
                  style={styles.scroll}
                  data={history}
                  renderItem={({item}) =>
                    <RatingsRow delCriteria={delCriteria}
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
