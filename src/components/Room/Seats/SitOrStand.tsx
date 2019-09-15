import React, { useContext, useCallback } from 'react';
import { observerWithMeta } from 'src/library/helpers/mobxHelp';
import Room from 'src/model/Room/Room';
import { RoomContext } from '../RoomContexts';
import { loggedReactFC } from 'src/library/logging/loggers';
import { IconButton, StyleSheet } from 'src/library/ui/components';
import { useColors, useIcons } from 'src/components/bits';

function useIconPropsMap() {
  const icons = useIcons();
  return {
    sit: { icon: icons.sit.default },
    stand: { icon: icons.stand.default },
  };
}

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

  const colors = useColors();
  const iconPropsMap = useIconPropsMap();
  return iconPropsKey ? (
    <IconButton
      icon={iconPropsMap[iconPropsKey].icon}
      color={colors.room.active}
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
