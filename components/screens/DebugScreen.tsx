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

class DebugScreen extends Component<any> {
  static navigationOptions = ({navigation}: any) => {
    return {
      title: 'Debug',
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
    let {city, onDummyHistoryPressed, location} = this.props.global;
    let {dummyHistoryOn} = this.state;
    return (
      <View style={[ss.emptyListContainer, {alignItems: 'center'}]}>
        <View style={{height: 15}}/>
        <Text style={{color: 'white'}}>Your Location: {city}</Text>
        <View style={{height: 15}}/>
        <Text style={{color: 'white'}}>
          Your Coordinates: {location ? `${location.latitude}, ${location.longitude}` : '?, ?'}
        </Text>
        <View style={{height: 40}}/>
          <TouchableHighlight style={ss.dummyButton} onPress={async () => {
            await onDummyHistoryPressed(dummyHistoryOn);
            this.setState({
              dummyHistoryOn: !dummyHistoryOn
            })
          }} underlayColor={'gray'}>
          <Text style={ss.noDaysText}>{dummyHistoryOn ?
            'Remove Dummy History' : 'Add Dummy History'}
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
    fontSize: 16,
    color: 'white',
    paddingTop: 0
  },
  dummyButton: {
    borderWidth: 0.25,
    borderColor: 'gray',
    borderRadius: 10,
    marginLeft: 5,
    height: 50,
    width: 210,
    justifyContent: 'center',
    alignItems: 'center'
  }
});

export default withGlobalContext(DebugScreen);
