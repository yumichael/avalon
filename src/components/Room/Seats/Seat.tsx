import React, { useContext } from 'react';
import { observerWithMeta } from 'src/library/helpers/mobxHelp';
import Room from 'src/model/Room/Room';
import { RoomContext, PlayingContext } from '../RoomContexts';
import UserInRoomX from '../User/UserInRoom';
import SitOrStandX from './SitOrStand';
import { loggedReactFC } from 'src/library/logging/loggers';
import { View, StyleSheet } from 'src/library/ui/components';

let SeatX: React.FC<{ seatIndex: Room.Seat.Index }> = ({ seatIndex }) => {
  const { roomApiInit } = useContext(RoomContext);
  const roomApi = roomApiInit.readyInstance;
  const seat = roomApi && roomApi.getSeat(seatIndex);
  const userRef = seat && seat.userRef;
  const { playing, gameXInjection } = useContext(PlayingContext);
  const playerIndex = playing && userRef ? playing.getPlayerIndexForUser(userRef) : undefined;
  return (
    <View style={styles.default}>
      <View style={styles.tight}>
        <UserInRoomX userRef={userRef} />
        {gameXInjection && playerIndex !== undefined
          ? gameXInjection.getPlayerAttributes(playerIndex)
          : null}
        <SitOrStandX seatIndex={seatIndex} />
      </View>
    </View>
  );
};
SeatX = observerWithMeta(loggedReactFC()(SeatX));

const styles = StyleSheet.create({
  default: {
    flex: 1,
    justifyContent: 'center',
  },
  tight: {
    height: 64,
    width: 64,
    margin: 9,
    alignSelf: 'center',
    justifyContent: 'center',
  },
});

export default SeatX;
