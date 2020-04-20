import {StyleSheet, StatusBar} from 'react-native'

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
    marginBottom: 8,
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
  butt: {
    // height: 40,
    paddingTop: 0,
    paddingRight: 10,
    paddingLeft: 10
  },
  buttText: {
    color: 'cyan',
    fontSize: 16,
    textAlign: 'center',
    fontWeight: "500"
  },
  buttView: {
  },
  boxView: {
    flexDirection: 'column',
    width: 350,
    marginTop: 10
    // borderWidth: 1,
  },
  listView: {
    width: '100%',
    // backgroundColor: 'white',
    // width: '100%'
  },
  scroll: {
    // borderRadius: 5,
    // borderColor: 'lightgray',
    // borderWidth: 1
  },
  row: {
    height: 60,
    marginTop: 0,
    marginBottom: 0,
    borderColor: 'gray',
    // borderBottomWidth: 0.25,
    paddingLeft: 15,
    paddingRight: 15,
    flexDirection: 'row',
  },
});