import React, {Component} from 'react';
import {TouchableHighlight} from 'react-native';
import {LikeStatus} from "./models";
import Icon from 'react-native-vector-icons/Feather';


export const ThumbButton = ({onPress, which, curr}: any) => {
    let active = curr === which;
    let backgroundColor = 'black';
    let iconName = '';
    let underlay = '#444';
    let color = 'lightgray';
    let paddingTop = 0;
    let paddingBottom = 0;
    switch (which) {
        case LikeStatus.LIKED:
            iconName = 'thumbs-up';
            paddingBottom = 1;
            if (active) {
                backgroundColor = 'blue';
                underlay = 'darkblue';
                color = 'white'
            }
            break;
        case LikeStatus.DISLIKED:
            iconName = 'thumbs-down';
            paddingTop = 5;
            if (active) {
                backgroundColor = 'red';
                underlay = 'darkred';
                color = 'white'
            }
            break;
    }

    return (
        <TouchableHighlight style={{
            backgroundColor,
            paddingTop,
            paddingBottom,
            borderWidth: 1,
            borderColor: 'white',
            borderRadius: 50,
            marginLeft: 5,
            height: 40,
            width: 40,
            justifyContent: 'center',
            alignItems: 'center'
        }}
        onPress={() => onPress(which)}
        underlayColor={underlay}>
                <Icon name={iconName}
                      size={24}
                      color={color}/>
        </TouchableHighlight>
    )
}
