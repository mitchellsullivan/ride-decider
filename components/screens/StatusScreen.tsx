import React, {Component} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableHighlight
} from 'react-native'
import {styles} from '../Styles'
import {SafeAreaView} from 'react-navigation'
import {withGlobalContext} from '../GlobalContext'

class StatusScreen extends Component<any> {
  static navigationOptions = ({navigation}: any) => {
    return {
      title: 'Status',
    };
  };

  state = {
    dummyHistoryOn: false
  }

  renderHeading = () => {
    return (
      <View style={[styles.headingView]}>
        <View style={{flex: 1}}>
          <Text style={styles.headingText}>
            Debug
          </Text>
        </View>
      </View>
    )
  }

  renderContent = () => {
    let {city, onDummyHistoryPressed} = this.props.global;
    let {dummyHistoryOn} = this.state;
    return (
      <View style={[ss.emptyListContainer, {alignItems: 'center'}]}>
        <Text style={{color: 'white'}}>Your Location: {city}</Text>
        <View style={{height: 50}}/>
        <TouchableHighlight style={{
          borderWidth: 0.25,
          borderColor: 'gray',
          borderRadius: 10,
          marginLeft: 5,
          height: 50,
          width: 200,
          justifyContent: 'center',
          alignItems: 'center'
        }} onPress={async () => {
          await onDummyHistoryPressed(dummyHistoryOn);
          this.setState({
            dummyHistoryOn: !dummyHistoryOn
          })
        }} underlayColor={'gray'}>
          <Text style={ss.noDaysText}>{dummyHistoryOn ?
            'Remove Dummy Days' : 'Append Dummy Days'}
          </Text>
        </TouchableHighlight>
      </View>
    )
  }

  render() {

    return (
      <SafeAreaView style={[styles.container, {flex: 1}]}>
        {this.renderHeading()}
        {this.renderContent()}
      </SafeAreaView>
    );
  }
}


const ss = StyleSheet.create({
  emptyListContainer: {
    flex: 1,
    backgroundColor: 'black',
    width: '100%',
    marginTop: 10
  },
  noDaysText: {
    textAlign: 'center',
    fontSize: 20,
    color: 'white',
    paddingTop: 0
  }
});

export default withGlobalContext(StatusScreen);
