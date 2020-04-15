import {StyleSheet, StatusBar} from 'react-native'

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
  },
  topSpace: {
    marginTop: 0,
  },
  headingView: {

  },
  headingText: {
    fontSize: 20,
    textAlign: 'center'
  },
  tempBox: {
    width: 70,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: 'lightgray',
    height: 40,
    padding: 5,
    margin: 5,
    fontSize: 18,
    textAlign: 'center',
    color: 'black'
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
    height: 40,
    paddingTop: 10,
    paddingRight: 10
  },
  buttText: {
    color: 'blue',
    fontSize: 18,
    textAlign: 'center'
  },
  buttView: {
  },
  boxView: {
    flex: 0.25,
    flexDirection: 'column',
    width: 350,
    marginTop: 10
    // borderWidth: 1,
  },
  listView: {
    width: 350
  },
  scroll: {
    // borderRadius: 5,
    // borderColor: 'lightgray',
    // borderWidth: 1
  },
  row: {
    height: 50,
    marginTop: 0,
    marginBottom: 5,
    // borderColor: 'black',
    // borderBottomWidth: 0.5,
    padding: 5,
    flexDirection: 'row'
  },
});