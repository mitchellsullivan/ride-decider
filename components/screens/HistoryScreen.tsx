import React, {Component} from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet
} from 'react-native'
import {styles} from '../Styles'
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
          <Text style={styles.headingText}>Past Ratings</Text>
        </View>
      </View>
    )
  }

  renderList = () => {
    let {history, onHistoryRowPressed} = this.props.global;
    let isEmpty = !history || history.length == 0;
    return isEmpty ? (
        <Text style={ss.noData}>(No history yet.)</Text>
      ) : (
        <FlatList
          style={{flex: 1}}
          data={history}
          renderItem={({item, index}) =>
            <HistoryRow item={item}
                        index={index}
                        onPressed={onHistoryRowPressed}/>}
          keyExtractor={(item, idx) => item.name + idx + item.abbr}
        />

    )
  }


  render() {

    return (
      <SafeAreaView style={[styles.container, {flex: 1}]}>
        {this.renderHeading()}
        <View style={[styles.listView, {flex: 1, width: '100%', flexDirection: 'row'}]}>
          {this.renderList()}
        </View>
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
  noDataView: {flex: 1,
    backgroundColor: 'black',
    flexDirection: 'column',
    justifyContent: 'center'
  },
  emptyListContainer: {
    flex: 1,
    backgroundColor: 'black',
    width: '100%',
    marginTop: 10
  },
});

export default withGlobalContext(StatusScreen);
