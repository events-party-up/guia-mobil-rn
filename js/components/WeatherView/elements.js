import React from "react";
import styled from "styled-components";
import { Text, View } from "react-native";

export const MainViewContainer = styled.View`
  flex-direction: row;
  align-items: flex-start;
  padding-vertical: 10px;
  padding-horizontal: 20px;
  justify-content: space-between;
`;

export const CurrentTempContainer = styled.View`
  height: 140px;
  justify-content: center;
`;
export const CurrentTempText = styled(Text)`
  font-size: 40px;
  font-weight: 200;
  color: ${props => props.theme.colors.gray};
`;

export const Summmary = styled(Text)`
  padding-vertical: 20px;
`;
