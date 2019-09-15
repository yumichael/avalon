import React, { useContext, useMemo } from 'react';
import { Text } from 'src/library/ui/components';
import { GameSkinContext } from 'src/style/gameSkin';

const roomActiveColor = '#FF8585';

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
  room: { active: roomActiveColor, passive: '#007AFF' },
};
function useColors() {
  return colors;
}

const alphas = {
  vote: { default: 'C0' },
  future: { default: 'C0' },
  highlight: { default: '0B' },
  helping: { default: '29' },
  role: { default: 'A0' },
};
function useAlphas() {
  return alphas;
}

const icons = {
  leader: { default: 'star' },
  success: { default: 'gps-fixed' },
  fail: { default: 'gps-off' },
  currentMission: { default: 'gps-not-fixed' },
  futureMission: { default: 'radio-button-unchecked' },
  sit: { default: 'get-app' },
  stand: { default: 'publish' /*'exit-to-app'*/ },
  chat: { default: 'forum' },
  help: { default: 'help' },
  info: { default: 'info' },
  assignDirector: { default: 'create' },
};
function useIcons() {
  return icons;
}

const fancyTextStyle = {
  fontWeight: 'bold' as 'bold',
};
const fancyText = {
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
  round: <Text style={{ ...fancyTextStyle, color: colors.concern.active }}>round</Text>,
  success: <Text style={{ ...fancyTextStyle, color: colors.good.default }}>success</Text>,
  fail: <Text style={{ ...fancyTextStyle, color: colors.evil.default }}>fail</Text>,
  CHOOSE: <Text style={{ fontWeight: '500', color: colors.leader.active }}>CHOOSE</Text>,
};
function useFancyText() {
  const { gameSkin } = useContext(GameSkinContext);
  return useMemo(
    () => ({
      ...fancyText,
      good: (
        <Text style={{ ...fancyTextStyle, color: colors.good.default }}>
          {gameSkin.factionNames.good}
        </Text>
      ),
      evil: (
        <Text style={{ ...fancyTextStyle, color: colors.evil.default }}>
          {gameSkin.factionNames.evil}
        </Text>
      ),
    }),
    [gameSkin],
  );
}

function useRoleNames() {
  const { gameSkin } = useContext(GameSkinContext);
  return gameSkin.roleNames;
}

const timeDurations = {
  viewSecret: 1000,
  viewName: 1000,
  viewBids: 2000,
};

export { useColors, useAlphas, useIcons, useFancyText, useRoleNames, timeDurations };
