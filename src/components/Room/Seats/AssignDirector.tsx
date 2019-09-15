import React, { useContext, useCallback } from 'react';
import { observerWithMeta } from 'src/library/helpers/mobxHelp';
import Room from 'src/model/Room/Room';
import { RoomContext } from '../RoomContexts';
import { loggedReactFC } from 'src/library/logging/loggers';
import { IconButton, StyleSheet } from 'src/library/ui/components';
import { useColors, useIcons } from 'src/components/bits';

let AssignDirectorX: React.FC<{ seatIndex: Room.Seat.Index }> = ({ seatIndex }) => {
  const { roomApiInit, state } = useContext(RoomContext);
  const roomApi = roomApiInit.readyInstance;
  const seat = roomApi && roomApi.getSeat(seatIndex);
  const callback = useCallback(
    () => roomApi && seat && seat.userRef && roomApi.setDirector(seat.userRef),
    [roomApi, seatIndex],
  );
  const assign =
    roomApi &&
    state.isAssigningDirector() &&
    roomApi.getDirector().isEqual(roomApi.userRef) &&
    seat &&
    seat.userRef &&
    seatIndex !== roomApi.getUserSeatIndex(roomApi.userRef)
      ? callback
      : null;

  const icons = useIcons();
  const colors = useColors();
  return assign ? (
    <IconButton
      icon={icons.assignDirector.default}
      onPress={assign}
      color={colors.room.active}
      style={styles.default}
    />
  ) : null;
};
AssignDirectorX = observerWithMeta(loggedReactFC()(AssignDirectorX));

const styles = StyleSheet.create({
  default: {
    position: 'absolute',
    top: -16,
    right: -16,
  },
});

export default AssignDirectorX;
