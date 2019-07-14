import React from 'react';
import {
  StyleSheet as RNStyleSheet,
  ViewStyle,
  TextStyle,
  ImageStyle,
  KeyboardAvoidingViewProps,
  TouchableWithoutFeedback,
  Keyboard,
  KeyboardAvoidingView,
} from 'react-native';

export type StyleSheet = { [_: string]: ViewStyle | TextStyle | ImageStyle };
export namespace StyleSheet {
  export function create<T extends StyleSheet>(styles: T): T {
    return RNStyleSheet.create(styles);
  }
}

export { TextInput, Text, KeyboardAvoidingView, View, ScrollView, FlatList } from 'react-native';

export { Card, IconButton, Button, Avatar, TouchableRipple, Chip } from 'react-native-paper';

export { NavigationScreenComponent, NavigationContainer } from 'react-navigation';

export const KeyboardUsingView: React.FC<KeyboardAvoidingViewProps> = props => (
  <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
    <KeyboardAvoidingView {...props} />
  </TouchableWithoutFeedback>
);
