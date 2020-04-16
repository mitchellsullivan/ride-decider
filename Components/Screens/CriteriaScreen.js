import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Switch,
  KeyboardAvoidingView,
  FlatList,
  ScrollView
} from 'react-native'
import {styles} from '../../Styles'
import {Criteria} from '../models'
import {SafeAreaView} from 'react-navigation'
import {CriteriaRow} from '../CriteriaRow'
import {CriteriaTextInput} from '../CriteriaTextInput'
import {KeyboardAwareScrollView, KeyboardAwareFlatList} from 'react-native-keyboard-aware-scroll-view'
import KeyboardSpacer from 'react-native-keyboard-spacer';

export default class CriteriaScreen extends React.Component {
  static navigationOptions = ({navigation}) => {
    return {
      title: 'Criteria',
    };
  };

  renderHeading = () => {
    return (
      <View style={[styles.headingView]}>
        <View style={{flex: 1}}>
          <Text style={styles.headingText}>
            Criteria
          </Text>
        </View>
      </View>
    )
  }

  render() {
    const {navigate} = this.props.navigation;
    let {
      curr,
      criteriaList,
      saveState,
      onChangeTemp,
      addCriteria,
      onChangeRain,
      delCriteria
    } = this.props.screenProps;
    return (
      <SafeAreaView style={[{flex: 1}]}>
        
        {/*<KeyboardAwareScrollView style={{flex: 1, backgroundColor: 'azure'}}*/}
        {/*  contentContainerStyle={{flex: 1}}>*/}
        {/*<KeyboardAvoidingView style={{flex: 1, padding: 0, margin: 0, alignItems: 'center'}}*/}
        {/*                      behavior={Platform.OS === "ios" ? 'padding' : null}*/}
        {/*                      keyboardVerticalOffset={Platform.OS === "ios" ? 64 : 0}>*/}
        {this.renderHeading()}
        <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
          <View style={[{flex: 0.25}, styles.boxView]}>
            <View style={{flexDirection:"row"}}>
              <CriteriaTextInput label={'Lo Temp F'}
                                 saveState={saveState}
                                 onChangeTemp={onChangeTemp}
                                 which={'lo'}
                                 val={curr.minGoodTemp}/>
              <CriteriaTextInput label={'Hi Temp F'}
                                 saveState={saveState}
                                 onChangeTemp={onChangeTemp}
                                 which={'hi'}
                                 val={curr.maxGoodTemp}/>
              <CriteriaTextInput label={'Max Wind (mph)'}
                                 saveState={saveState}
                                 onChangeTemp={onChangeTemp}
                                 which={'mw'}
                                 val={curr.maxWind}/>
            </View>
            <View style={{flexDirection:"row"}}>
              <View style={{flex: 1, marginTop: 5, alignItems: 'flex-start'}}>
                <Text>Rain OK</Text>
                <Switch style={{marginTop: 5}}
                        ios_backgroundColor="#3e3e3e"
                        onValueChange={() => onChangeRain('curr')}
                        value={curr.rainOkay}
                        disabled={false}/>
              </View>
              <View style={{flex: 1, marginTop: 5, alignItems: 'flex-start'}}>
                <Text>Wet Roads OK</Text>
                <Switch style={{marginTop: 5}}
                        ios_backgroundColor="#3e3e3e"
                        onValueChange={()=> onChangeRain('prev')}
                        value={curr.prevDayRainOkay}
                        disabled={curr.rainOkay}/>
              </View>
              <View style={{flex: 1, marginTop: 5, alignItems: 'center'}}>
                <TouchableOpacity style={{marginTop: 20}}
                                  onPress={addCriteria}>
                  <View>
                    <Text style={{fontSize: 20, color: 'blue'}}>
                      Add
                    </Text>
                  </View>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>
        {!criteriaList || criteriaList.length === 0 ? (
          <View style={
            {flex: 0.75, backgroundColor: 'lightgray', width: 350}
          }>
            <Text style={{
              textAlign: 'center',
              fontSize: 20,
              marginTop: 20}}>
              (No criteria set.)
            </Text>
          </View>
        ) : (
          <View style={[styles.listView, {flex: 0.75, backgroundColor: 'yellow'}]}>
            <KeyboardAwareFlatList
              style={[styles.scroll, {backgroundColor: 'gray', flex: 1}]}
              data={criteriaList}
              renderItem={({item}) =>
                <CriteriaRow delCriteria={delCriteria}
                             item={item}/>}
              keyExtractor={({uuid}) => uuid}
            />
          </View>
        )}
        {/*<KeyboardSpacer/>*/}
      </SafeAreaView>
    );
  }
}











// import React from 'react';
// import {
//   View,
//   Text,
//   TouchableOpacity,
//   Switch,
//   KeyboardAvoidingView,
//   FlatList,
//   ScrollView,
//   TextInput,
//   Button,
//   SafeAreaView
// } from 'react-native'
// import {styles} from '../../Styles'
// import {Criteria} from '../models'
// import {Header} from 'react-navigation-stack'
// import {BottomTabBar} from 'react-navigation-tabs';
// import {CriteriaRow} from '../CriteriaRow'
// import {CriteriaTextInput} from '../CriteriaTextInput'
// import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
//
// export default class CriteriaScreen extends React.Component {
//   static navigationOptions = ({navigation}) => {
//     return {
//       title: 'Criteria',
//       headerTransparent: true
//     };
//   };
//
//   renderHeading = () => {
//     return (
//       <View style={[styles.headingView]}>
//         <View style={{flex: 1}}>
//           <Text style={styles.headingText}>
//             Criteria
//           </Text>
//         </View>
//       </View>
//     )
//   }
//
//   render() {
//     const {navigate} = this.props.navigation;
//     let {
//       curr,
//       criteriaList,
//       saveState,
//       onChangeTemp,
//       addCriteria,
//       onChangeRain,
//       delCriteria
//     } = this.props.screenProps;
//     return (
//         // <KeyboardAvoidingView style={{backgroundColor: 'azure', flex: 1}}
//         //                       behavior={Platform.OS === "ios" ? "padding" : null}
//         //                       contentContainerStyle={{flex: 1}}>
//       <KeyboardAwareScrollView>
//           <SafeAreaView style={[{flex: 1}]}>
//             <View style={{flex: 1, justifyContent: 'flex-end', paddingTop: Header.HEIGHT}}>
//               <Text style={{
//                 fontSize: 36,
//                 marginBottom: 48,
//               }}>
//                 Header
//               </Text>
//               <TextInput
//                 placeholder="Username"
//                 style={{        height: 40,
//                   borderColor: "#000000",
//                   borderBottomWidth: 1,
//                   marginBottom: 36,}}
//               />
//               <TextInput
//                 placeholder="Password"
//                 style={{        height: 40,
//                   borderColor: "#000000",
//                   borderBottomWidth: 1,
//                   marginBottom: 36,}}
//               />
//               <TextInput
//                 placeholder="Confrim Password"
//                 style={{        height: 40,
//                   borderColor: "#000000",
//                   borderBottomWidth: 1,
//                   marginBottom: 36,}}
//               />
//               <TextInput
//                 placeholder="Confrim Password"
//                 style={{        height: 40,
//                   borderColor: "#000000",
//                   borderBottomWidth: 1,
//                   marginBottom: 36,}}
//               />
//               <TextInput
//                 placeholder="Confrim Password"
//                 style={{        height: 40,
//                   borderColor: "#000000",
//                   borderBottomWidth: 1,
//                   marginBottom: 36,}}
//               />
//               <TextInput
//                 placeholder="Confrim Password"
//                 style={{        height: 40,
//                   borderColor: "#000000",
//                   borderBottomWidth: 1,
//                   marginBottom: 36,}}
//               />
//               <TextInput
//                 placeholder="Confrim Password"
//                 style={{        height: 40,
//                   borderColor: "#000000",
//                   borderBottomWidth: 1,
//                   marginBottom: 36,}}
//               />
//               <View style={styles.btnContainer}>
//                 <Button title="Submit" onPress={() => null} />
//               </View>
//               <View style={{ flex : 1 }} />
//             </View>
//           </SafeAreaView>
//         </KeyboardAwareScrollView>
//     );
//   }
// }
