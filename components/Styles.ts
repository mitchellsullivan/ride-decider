import {StyleSheet} from 'react-native'

export const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'black',
  },
  topSpace: {
    marginTop: 0,
  },
  headingView: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 0,
    height: 40,
    paddingTop: 10,
    borderBottomWidth: 0.25,
    borderBottomColor: 'gray',
    backgroundColor: '#111',
  },
  headingText: {
    fontSize: 20,
    textAlign: 'center',
    paddingBottom: 10,
    color: 'white',
    fontWeight: '500'
  },

  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
  location: {
    color: '#333333',
    marginBottom: 5,
  },
  boxView: {
    flexDirection: 'column',
    width: 350,
    marginTop: 10
    // borderWidth: 1,
  },
  listView: {
    width: '100%',
    justifyContent: 'center',
    // backgroundColor: 'white',
    // width: '100%'
  },
  scroll: {
    // borderRadius: 5,
    borderTopColor: 'gray',
    borderTopWidth: 0
  },
  row: {
    // height: 60,
    marginTop: 0,
    marginBottom: 0,
    borderColor: 'gray',
    borderBottomWidth: 0.25,
    paddingLeft: 10,
    paddingRight: 10,
    paddingTop: 5,
    paddingBottom: 5,
    flexDirection: 'row',
  },
});
