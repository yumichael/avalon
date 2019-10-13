import React, { useContext, useMemo } from 'react';
import { observerWithMeta } from 'src/library/helpers/mobxHelp';
import { loggedReactFC } from 'src/library/logging/loggers';
import { Text, StyleSheet, View } from 'src/library/ui/components';
import Room from 'src/model/Room/Room';
import UserAvatarX from '../User/UserAvatar';
import { UserContext } from 'src/components/UserContexts';
import bits from 'src/components/bits';
import { ViewStyle } from 'react-native';

const RoomMessageSeparatorX: React.FC = () => {
  const separatorStyle = useSeparatorStyle();
  return <View style={separatorStyle} />;
};
export { RoomMessageSeparatorX };

let RoomMessageX: React.FC<{ message: Room.Message }> = ({ message: { userRef, text } }) => {
  const { userApiInit } = useContext(UserContext);
  const userApi = userApiInit && userApiInit.readyInstance;
  return (
    <>
      <View style={userApi && userApi.ref.isEqual(userRef) ? styles.myself : styles.otherUser}>
        <UserAvatarX userRef={userRef} size={16} style={styles.avatar} />
        <Text style={styles.userName}>{userRef.id}</Text>
      </View>
      <Text style={styles.message}>{text}</Text>
    </>
  );
};
RoomMessageX = observerWithMeta(loggedReactFC()(RoomMessageX));

const styles = StyleSheet.create({
  message: {},
  avatar: {
    marginStart: 6,
    marginEnd: 3,
  },
  userName: {
    fontWeight: 'bold',
  },
  otherUser: {
    flexDirection: 'row',
    direction: 'ltr',
  },
  myself: {
    flexDirection: 'row',
    direction: 'rtl',
  },
});
function useSeparatorStyle() {
  const { colors, alphas } = bits;
  return useMemo<ViewStyle>(
    () => ({
      height: 0,
      borderTopWidth: 1,
      borderTopColor: colors.room.passive + alphas.helping.default,
    }),
    [colors.room.passive, alphas.helping.default],
  );
}

export default RoomMessageX;
