import React, { useContext, useMemo } from 'react';
import { observerWithMeta } from 'src/library/helpers/mobxHelp';
import { PlayingContext, RoomContext } from '../RoomContexts';
import { loggedReactFC } from 'src/library/logging/loggers';
import { Card, StyleSheet, TouchableRipple, View, Text } from 'src/library/ui/components';
import { useColors } from 'src/components/bits';
import { TextStyle } from 'react-native';

let RoomBannerX: React.FC = () => {
  const { state } = useContext(RoomContext);
  const { gameXInsert, playing } = useContext(PlayingContext);
  const gameFinish = playing && playing.getFinish();

  const colors = useColors();
  const bannerStyle = useMemo(
    () => ({
      ...styles.container,
      ...(gameFinish
        ? state.isViewingGame()
          ? styles.viewingContainer
          : {
              ...styles.gameFinishContainer,
              borderColor: gameFinish.winningFaction
                ? colors[gameFinish.winningFaction].default
                : colors.game.default,
            }
        : playing
        ? null
        : { ...styles.gameFinishContainer, borderColor: colors.game.default }),
    }),
    [playing, gameFinish, state.isViewingGame()],
  );
  const overlayStyle = useMemo(() => ({ ...styles.container, ...styles.touchOverlay }), []);
  const titleTextStyle = useTitleTextStyle();
  return (
    <>
      <Card style={bannerStyle}>
        {gameXInsert ? (
          gameXInsert.getGameTracker()
        ) : (
          <>
            <View style={styles.space} />
            <Text style={titleTextStyle}>The Resistance</Text>
            <View style={styles.space} />
          </>
        )}
      </Card>
      {!!!state.isViewingGame() && gameFinish ? (
        <TouchableRipple onPress={state.viewGame} style={overlayStyle}>
          <View style={overlayStyle} />
        </TouchableRipple>
      ) : null}
    </>
  );
};
RoomBannerX = observerWithMeta(loggedReactFC()(RoomBannerX));

const styles = StyleSheet.create({
  container: {
    flex: 1, // TODO make position absolute with 100% height+width if buggy.
    padding: 1,
  },
  touchOverlay: {
    position: 'absolute',
    height: '100%',
    width: '100%',
  },
  gameFinishContainer: {
    borderWidth: 1,
    padding: 0,
  },
  viewingContainer: {
    // borderWidth: 1,
    // borderColor: colors.room.passive,
  },
  space: { flex: 1 },
});
function useTitleTextStyle() {
  const colors = useColors();
  return useMemo<TextStyle>(
    () => ({
      // TODO fuck this.
      fontSize: 36,
      fontStyle: 'italic',
      fontWeight: 'bold',
      color: colors.game.default,
      textAlign: 'center',
      textAlignVertical: 'center',
    }),
    [colors],
  );
}

export default RoomBannerX;
