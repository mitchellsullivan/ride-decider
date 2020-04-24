import React, {Component} from 'react';
import {
  View,
  Text,
  StyleSheet,
} from 'react-native';

import Icon from 'react-native-vector-icons/Feather';

interface IconWithBadgeProps {
  name: string,
  badgeCount: number,
  color: string,
  size: number
}

export default class IconWithBadge extends Component<IconWithBadgeProps> {
  render() {
    const { name, badgeCount, color, size } = this.props;
    return (
      <View style={{ width: size, height: size, margin: 5 }}>
        <Icon name={name} size={size} color={color} />
        {badgeCount > 0 && (
          <View style={ss.badgeView}>
            <Text style={ss.badgeText}>
              {/* {badgeCount} */}
            </Text>
          </View>
        )}
      </View>
    );
  }
}

const ss = StyleSheet.create({
  badgeView: {
    position: 'absolute',
    right: -6,
    top: -3,
    backgroundColor: 'red',
    borderRadius: 6,
    width: 12,
    height: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  badgeText: {
    color: 'white',
    fontSize: 10,
    fontWeight: 'bold'
  },
})
