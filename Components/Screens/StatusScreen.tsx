import React, {Component} from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet
} from 'react-native'
import {styles} from '../styles'
import {SafeAreaView} from 'react-navigation'
import {HistoryRow} from '../HistoryRow'
import {withGlobalContext} from '../GlobalContext'


class StatusScreen extends Component<any> {
  static navigationOptions = ({navigation}: any) => {
    return {
      title: 'Status',
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

  renderHistory = () => {
    let {history} = this.props.global;
    let noHistory = !history || history.length == 0;

    return (
      <View style={[styles.listView, ss.emptyListContainer]}>
        {noHistory ? (
          <Text style={ss.noDaysText}>
            (No days rated.)
          </Text>
        ):(
          <FlatList
            style={styles.scroll}
            data={history}
            renderItem={({item}) => <HistoryRow item={item}/>}
            keyExtractor={({name}) => name}
          />
        )}
      </View>
    )
  }

  render() {

    return (
      <SafeAreaView style={[styles.container, {flex: 1}]}>
        {this.renderHeading()}
        {this.renderHistory()}
      </SafeAreaView>
    );
  }
}


const ss = StyleSheet.create({
  emptyListContainer: {
    flex: 1,
    backgroundColor: 'black',
    width: '100%',
    marginTop: 40
  },
  noDaysText: {
    textAlign: 'center',
    fontSize: 20,
    color: 'white',
    paddingTop: 0
  }
});

export default withGlobalContext(StatusScreen);
