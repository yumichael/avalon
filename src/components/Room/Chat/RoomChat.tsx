import React, { useContext, useState, useMemo } from 'react';
import { observerWithMeta } from 'src/library/helpers/mobxHelp';
import { loggedReactFC } from 'src/library/logging/loggers';
import { FlatList, StyleSheet, TextInput, View } from 'src/library/ui/components';
import { RoomContext } from '../RoomContexts';
import RoomMessageX, { RoomMessageSeparatorX } from './RoomMessage';
import { ListRenderItem, ViewStyle } from 'react-native';
import Room from 'src/model/Room/Room';
import { useEventCallback } from 'src/library/helpers/reactHelp';
import bits from 'src/components/bits';

const renderMessage: ListRenderItem<{ id: Room.Message.Id; message: Room.Message }> = ({
  item: { message },
}) => {
  return <RoomMessageX message={message} />;
};

const keyExtractor: (_: { id: Room.Message.Id }) => string = ({ id }) => id;

let RoomChatX: React.FC = () => {
  const { roomApiInit } = useContext(RoomContext);
  const roomApi = roomApiInit.readyInstance;
  const messages = (roomApi && roomApi.getMessages()) || [];

  const [textToSend, setTextToSend] = useState('');
  const send = useEventCallback(() => {
    if (roomApi) {
      roomApi.sendMessage(textToSend);
    }
    setTextToSend('');
  }, [roomApi, textToSend]);

  const inactiveInputStyle = useInactiveInputStyle();
  const activeInputStyle = useActiveInputStyle();
  return roomApi ? (
    <View style={styles.default}>
      <FlatList
        data={messages}
        renderItem={renderMessage}
        keyExtractor={keyExtractor}
        inverted={true}
        ItemSeparatorComponent={RoomMessageSeparatorX}
        style={styles.messages}
      >
        {roomApi.getMessages}
      </FlatList>
      <TextInput
        returnKeyType="done"
        placeholder="Enter message..."
        value={textToSend}
        onChangeText={setTextToSend}
        onSubmitEditing={textToSend ? send : undefined}
        blurOnSubmit={textToSend ? false : true}
        style={textToSend ? activeInputStyle : inactiveInputStyle}
      />
    </View>
  ) : null;
};
RoomChatX = observerWithMeta(loggedReactFC()(RoomChatX));

const styles = StyleSheet.create({
  default: {
    flex: 1,
    margin: 3,
    alignItems: 'stretch',
  },
  messages: {
    flex: 1,
  },
});
function useInactiveInputStyle() {
  const { colors } = bits;
  return useMemo<ViewStyle>(
    () => ({
      height: 24,
      borderWidth: 1,
      borderColor: colors.room.passive,
    }),
    [colors],
  );
}
function useActiveInputStyle() {
  const { colors } = bits;
  return useMemo<ViewStyle>(
    () => ({
      height: 24,
      borderWidth: 1,
      borderColor: colors.room.active,
    }),
    [colors],
  );
}

export default RoomChatX;
