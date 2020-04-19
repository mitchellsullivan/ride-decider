import React from 'react';
import {
  View,
  Text,
} from 'react-native';

import Icon from 'react-native-vector-icons/Feather';

interface IconWithBadgeProps {
  name: string,
  badgeCount: number,
  color: string,
  size: number
}

export default class IconWithBadge extends React.Component<IconWithBadgeProps> {
  render() {
    const { name, badgeCount, color, size } = this.props;
    return (
      <View style={{ width: 24, height: 24, margin: 5 }}>
        <Icon name={name} size={size} color={color} />
        {badgeCount > 0 && (
          <View
            style={{
              position: 'absolute',
              right: -6,
              top: -3,
              backgroundColor: 'red',
              borderRadius: 6,
              width: 12,
              height: 12,
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <Text style={{
              color: 'white',
              fontSize: 10,
              fontWeight: 'bold'
            }}>
              {/* {badgeCount} */}
            </Text>
          </View>
        )}
      </View>
    );
  }
}