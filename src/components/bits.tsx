import React, { useContext, useMemo } from 'react';
import { Text } from 'src/library/ui/components';
import { GameSkinContext } from 'src/style/gameSkin';

const colors = {
  good: {
    default: '#0000FF',
  },
  evil: {
    default: '#FF0000',
  },
  leader: {
    active: '#909090',
    passive: '#606060',
  },
  approve: {
    default: '#00D050',
  },
  reject: {
    default: '#000000',
  },
  team: {
    default: '#FF00FF',
  },
  game: {
    default: '#FF00FF',
  },
  concern: {
    active: '#E9E900',
    passive: '#777777',
  },
  room: {
    active: '#FB9930',
    passive: '#8A6F1C',
  },
};
function useColors() {
  return colors;
}

const alphas = {
  vote: {
    default: 'C0',
  },
  future: {
    default: 'C0',
  },
  highlight: {
    default: '0B',
  },
  helping: {
    default: '40',
  },
};
function useAlphas() {
  return alphas;
}

const icons = {
  leader: {
    default: 'gavel',
  },
  success: {
    default: 'gps-fixed',
  },
  fail: {
    default: 'gps-off',
  },
  currentMission: {
    default: 'gps-not-fixed',
  },
  futureMission: {
    default: 'radio-button-unchecked',
  },
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
      <Text style={{ ...fancyTextStyle, color: colors.approve.default }}>v</Text>
      <Text style={{ ...fancyTextStyle, color: colors.leader.passive }}>o</Text>
      <Text style={{ ...fancyTextStyle, color: colors.reject.default }}>t</Text>
      <Text style={{ ...fancyTextStyle, color: colors.leader.passive }}>e</Text>
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

export { useColors, useAlphas, useIcons, useFancyText, useRoleNames };
