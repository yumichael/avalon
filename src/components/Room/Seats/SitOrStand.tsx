import React, { useContext, useCallback } from 'react';
import { observerWithMeta } from 'src/library/helpers/mobxHelp';
import Room from 'src/model/Room/Room';
import { RoomContext } from '../RoomContexts';
import { loggedReactFC } from 'src/library/logging/loggers';
import { IconButton, StyleSheet } from 'src/library/ui/components';
import bits from 'src/components/bits';

let SitOrStandX: React.FC<{ seatIndex: Room.Seat.Index }> = ({ seatIndex }) => {
  const { roomApiInit } = useContext(RoomContext);
  const roomApi = roomApiInit.readyInstance;
  const sit = useCallback(() => roomApi && roomApi.sitAtSeat(seatIndex), [roomApi, seatIndex]);
  const stand = useCallback(() => roomApi && roomApi.standUp(), [roomApi, seatIndex]);
  const iconPropsKey =
    roomApi && roomApi.canSitAtSeat(seatIndex)
      ? 'sit'
      : roomApi && roomApi.getUserSeatIndex(roomApi.userRef) === seatIndex && roomApi.canStandUp()
      ? 'stand'
      : null;

  const iconPropsMap = {
    sit: { icon: bits.icons.sit.default },
    stand: { icon: bits.icons.stand.default },
  };
  return iconPropsKey ? (
    <IconButton
      icon={iconPropsMap[iconPropsKey].icon}
      color={bits.colors.room.active}
      onPress={{ sit, stand }[iconPropsKey]}
      style={styles.default}
    />
  ) : null;
};
SitOrStandX = observerWithMeta(loggedReactFC()(SitOrStandX));

const styles = StyleSheet.create({
  default: {
    position: 'absolute',
    bottom: -16,
    right: -16,
  },
});

export default SitOrStandX;
