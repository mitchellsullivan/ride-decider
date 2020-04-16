import {StyleSheet, StatusBar} from 'react-native'

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    // padding: ,
    // backgroundColor: 'white',
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
    backgroundColor: 'teal',
  },
  headingText: {
    fontSize: 20,
    textAlign: 'center',
    marginBottom: 8,
    color: 'white',
    fontWeight: 'bold'
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
    color: 'black',
    backgroundColor: 'white'
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
    textAlign: 'center'
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
    width: '95%',
    backgroundColor: 'white',
    // width: '100%'
  },
  scroll: {
    // borderRadius: 5,
    // borderColor: 'lightgray',
    // borderWidth: 1
  },
  row: {
    height: 50,
    marginTop: 0,
    marginBottom: 3,
    // borderColor: 'black',
    // borderBottomWidth: 0.5,
    padding: 5,
    flexDirection: 'row',
    borderBottomWidth: 1
  },
});