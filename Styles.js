import {StyleSheet} from 'react-native'

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
  },
  topSpace: {
    marginTop: 40,
  },
  headingView: {
    paddingTop: 10,
  },
  headingText: {
    fontSize: 24,
    paddingTop: 5,
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
  // button: {
  //   marginBottom: 8,
  //   flex: 0.25
  // },
  butt: {
    height: 40,
    paddingTop: 10,
    paddingRight: 10
    // borderWidth: 1,
  },
  buttText: {
    color: 'blue',
    fontSize: 18,
    textAlign: 'center'
  },
  buttView: {
    // backgroundColor: 'lightgray',
  },
  boxView: {
    flex: 0.25,
    flexDirection: 'column',
    width: 350,
    marginTop: 10
    // borderWidth: 1,
  },
  listView: {
    flex: 0.75,
    width: 350
  },
  scroll: {
    // backgroundColor: 'lightgray',
    // margin: 10,
    // marginTop: 10,
    // borderWidth: 1,
    borderRadius: 5,
    borderColor: 'lightgray',
    borderWidth: 1
  },
  row: {
    height: 50,
    // borderRadius: 5,
    marginTop: 0,
    borderColor: 'black',
    borderBottomWidth: 0.5,
    padding: 5,
    flexDirection: 'row'
  },
});