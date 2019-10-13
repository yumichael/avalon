import React, { useContext, useMemo, useState, useEffect, useCallback } from 'react';
import { observerWithMeta } from 'src/library/helpers/mobxHelp';
import Room from 'src/model/Room/Room';
import { RoomContext, PlayingContext } from '../RoomContexts';
import UserInRoomX, { UserView } from '../User/UserInRoom';
import SitOrStandX from './SitOrStand';
import { loggedReactFC } from 'src/library/logging/loggers';
import { View, StyleSheet, TouchableRipple } from 'src/library/ui/components';
import bits from 'src/components/bits';
import { ViewStyle } from 'react-native';
import AssignDirectorX from './AssignDirector';

let SeatX: React.FC<{ seatIndex: Room.Seat.Index }> = ({ seatIndex }) => {
  const { roomApiInit } = useContext(RoomContext);
  const roomApi = roomApiInit.readyInstance;
  const seat = roomApi && roomApi.getSeat(seatIndex);
  const userRef = seat && seat.userRef;
  const { playing, gameXInsert } = useContext(PlayingContext);
  const playerIndex = playing && userRef ? playing.getPlayerIndexForUser(userRef) : undefined;

  const [userView, setUserView] = useState<UserView>('avatar');
  const toggleUserView = useCallback(
    () =>
      setUserView(
        prevUserView => ({ avatar: 'name' as 'name', name: 'avatar' as 'avatar' }[prevUserView]),
      ),
    [setUserView],
  );
  useEffect(() => {
    if (userView !== 'avatar') {
      const timeout = setTimeout(() => setUserView('avatar'), bits.timeDurations.viewBids);
      return () => {
        clearTimeout(timeout);
      };
    }
    return undefined;
  }, [userView, setUserView]);

  const emptyStyle = useEmptyStyle();
  return (
    <View style={styles.default}>
      <View style={styles.tight}>
        {userRef ? (
          <UserInRoomX userRef={userRef} userView={userView} />
        ) : (
          <View style={emptyStyle} />
        )}
        {gameXInsert && playerIndex !== undefined
          ? gameXInsert.getPlayerAttributes(playerIndex)
          : null}
        <SitOrStandX seatIndex={seatIndex} />
        <AssignDirectorX seatIndex={seatIndex} />
        {userRef ? (
          <TouchableRipple onPress={toggleUserView} style={styles.touch}>
            <View style={styles.touchView} />
          </TouchableRipple>
        ) : null}
      </View>
    </View>
  );
};
SeatX = observerWithMeta(loggedReactFC()(SeatX));

const styles = StyleSheet.create({
  default: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  tight: {
    height: (bits.constSizes.screenHeight / 812) * 64,
    width: (bits.constSizes.screenHeight / 812) * 64,
    margin: (bits.constSizes.screenHeight / 812) * 9,
    alignItems: 'center',
    justifyContent: 'center',
  },
  touch: {
    alignSelf: 'center',
    position: 'absolute',
    height: (bits.constSizes.screenHeight / 812) * 32,
    width: (bits.constSizes.screenHeight / 812) * 32,
    borderRadius: (bits.constSizes.screenHeight / 812) * 16,
    // backgroundColor: '#f00', // testing
  },
  touchView: { flex: 1 },
});
function useEmptyStyle() {
  const { colors, alphas, constSizes } = bits;
  return useMemo<ViewStyle>(
    () => ({
      height: (constSizes.screenHeight / 812) * (64 + 8),
      width: (constSizes.screenHeight / 812) * (64 + 8),
      borderRadius: (constSizes.screenHeight / 812) * 64,
      backgroundColor: colors.concern.passive + alphas.helping.default,
    }),
    [colors.concern.passive, alphas.helping.default],
  );
}

export default SeatX;
