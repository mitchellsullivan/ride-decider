import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Switch,
  KeyboardAvoidingView,
  FlatList,
  ScrollView,
  Platform
} from 'react-native'
import {styles} from '../Styles'
import {Criteria} from '../models'
import {SafeAreaView} from 'react-navigation'
import {RatingsRow} from '../RatingsRow'
import {withGlobalContext} from '../GlobalContext'

class RatingsScreen extends React.Component<any> {
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
            Past Ratings
          </Text>
        </View>
      </View>
    )
  }

  render() {
    let {
      history,
      delCriteria,
    } = this.props.global;
    return (
        <SafeAreaView style={[styles.container, {flex: 1}]}>
            {this.renderHeading()}
            {!history || history.length === 0 ? (
              <View style={{
                  flex: 1,
                  backgroundColor: 'black',
                  width: '100%',
                  marginTop: 40
              }}>
                  <Text style={{
                    textAlign: 'center',
                    fontSize: 20,
                    color: 'white',
                    paddingTop: 0
                  }}>
                    (No days rated.)
                  </Text>
                </View>
              ) : (
                <View style={[styles.listView, {flex: 1}]}>
                  <FlatList
                    style={styles.scroll}
                    data={history}
                    renderItem={({item}) =>
                      <RatingsRow item={item}/>}
                    keyExtractor={({name}) => name}
                  />
              </View>
            )}
        </SafeAreaView>
    );
  }
}

export default withGlobalContext(RatingsScreen);