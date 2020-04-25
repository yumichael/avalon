import React from 'react';
import { Text } from 'src/library/ui/components';
import { skinStore } from 'src/style/gameSkin';
import { Dimensions } from 'react-native';

const roomActiveColor = '#FF8585';
const roomPassiveColor = '#007AFF';

const colors = {
  good: { default: '#0000FF' },
  evil: { default: '#FF0000' },
  leader: { active: roomActiveColor, passive: '#626262' },
  // approve: { default: '#00D050' },
  approve: { default: '#18FFA8' },
  reject: { default: '#101A10' },
  // reject: { default: '#FFFF10' },
  team: { default: '#FF00FF' },
  game: { default: '#FF00FF' },
  // concern: { active: '#E9E900', passive: '#777777' },
  concern: { active: '#E9E900', passive: /*'#82705A'*/ '#3C9077' },
  // room: { active: '#FB9930', passive: '#8A6F1C' },
  room: { active: roomActiveColor, passive: roomPassiveColor },
  presence: { active: '#96A2E0', passive: '#808080' },
};

const alphas = {
  vote: { default: 'C0' },
  future: { default: '52' },
  highlight: { default: '0B' },
  helping: { default: '29' },
  role: { default: 'A0' },
};

const icons = {
  leader: { default: 'star' },
  success: { default: 'check-circle' },
  fail: { default: 'close-circle' },
  currentMission: { default: 'circle' },
  futureMission: { default: 'circle-outline' },
  aRound: { default: 'chevron-right' },
  lastRound: { default: 'page-last' },
  sit: { default: 'arrow-down-thick' },
  stand: { default: 'arrow-up-thick' },
  chat: { default: 'forum' },
  help: { default: 'help-circle' },
  info: { default: 'information' },
  assignDirector: { default: 'circle' },
  seeSecret: { default: 'eye' },
  unseeSecret: { default: 'eye-off' },
  vote: { default: 'radiobox-blank' },
  newGame: { default: 'gamepad' },
  addToTeam: { default: 'plus-circle' },
  removeFromTeam: { default: 'minus-circle' },
};

const fancyTextStyle = {
  fontWeight: 'bold' as 'bold',
};
const fancyTextBase = {
  leader: <Text style={{ ...fancyTextStyle, color: colors.leader.active }}>leader</Text>,
  team: <Text style={{ ...fancyTextStyle, color: colors.team.default }}>team</Text>,
  voted: <Text style={{ ...fancyTextStyle, color: colors.leader.passive }}>voted</Text>,
  // vote: <Text style={{ ...fancyTextStyle, color: colors.leader.passive }}>vote</Text>,
  vote: (
    <>
      <Text style={{ ...fancyTextStyle, color: colors.leader.passive }}>v</Text>
      <Text style={{ ...fancyTextStyle, color: colors.approve.default }}>o</Text>
      <Text style={{ ...fancyTextStyle, color: colors.leader.passive }}>t</Text>
      <Text style={{ ...fancyTextStyle, color: colors.reject.default }}>e</Text>
    </>
  ),
  bid: (
    <>
      <Text style={{ ...fancyTextStyle, color: colors.good.default }}>b</Text>
      <Text style={{ ...fancyTextStyle, color: colors.team.default }}>i</Text>
      <Text style={{ ...fancyTextStyle, color: colors.evil.default }}>d</Text>
    </>
  ),
  mission: <Text style={{ ...fancyTextStyle, color: colors.concern.active }}>mission</Text>,
  missions: <Text style={{ ...fancyTextStyle, color: colors.concern.active }}>missions</Text>,
  round: <Text style={{ ...fancyTextStyle, color: colors.concern.active }}>round</Text>,
  success: <Text style={{ ...fancyTextStyle, color: colors.good.default }}>success</Text>,
  fail: <Text style={{ ...fancyTextStyle, color: colors.evil.default }}>fail</Text>,
  CHOOSE: <Text style={{ fontWeight: '500', color: colors.leader.active }}>CHOOSE</Text>,
  theGame: (
    <Text style={{ ...fancyTextStyle, fontStyle: 'italic', color: colors.game.default }}>
      The Resistance
    </Text>
  ),
};
const fancyText = {
  ...fancyTextBase,
  get good() {
    return (
      <Text style={{ ...fancyTextStyle, color: colors.good.default }}>
        {skinStore.getGameSkin().factionNames.good}
      </Text>
    );
  },
  get evil() {
    return (
      <Text style={{ ...fancyTextStyle, color: colors.evil.default }}>
        {skinStore.getGameSkin().factionNames.evil}
      </Text>
    );
  },
  get goodPlayers() {
    return (
      <Text style={{ ...fancyTextStyle, color: colors.good.default }}>
        {skinStore.getGameSkin().roleNames.goods}
      </Text>
    );
  },
  get evilPlayers() {
    return (
      <Text style={{ ...fancyTextStyle, color: colors.evil.default }}>
        {skinStore.getGameSkin().roleNames.evils}
      </Text>
    );
  },
};

const timeDurations = {
  viewSecret: 1000,
  viewName: 1000,
  viewBids: 2000,
};

const { height, width } = Dimensions.get('window');
const constSizes = {
  screenHeight: height,
  screenWidth: width,
  presenceCurve: 3,
  presenceBorderWidth: 3,
  inputHeight: 24,
};

const bits = { colors, alphas, icons, fancyText, timeDurations, constSizes };
export default bits;
