import React from 'react';
import {
  Button,
  View,
  Platform,
  Text,
  StatusBar,
  TouchableOpacity,
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';


export default class CriteriaScreen extends React.Component {
  static navigationOptions = ({navigation}) => {
    return {
      title: 'Uhhh',
      drawerLabel: 'Criteria',
      headerRight: () => (
        <Button
          onPress={() => navigation.navigate('Info')}
          title="Info"
          color={Platform.OS === 'ios' ? '#fff' : null}
        />
      ),
      headerLeft: () => (
        <TouchableOpacity
          // style={{width: 50, height: 50}}
          onPress={() => navigation.openDrawer()}>
          <Icon
            style={{marginLeft: 15, padding: 10}}
            name="bars"
            size={25}
            color="#FFF"
          />
        </TouchableOpacity>
      ),
    };
  };
  
  render() {
    const {navigate} = this.props.navigation;
    return (
      <View style={{marginTop: 40, padding: 10}}>
        <Text>Criteria Screen</Text>
      </View>
    );
  }
}
