import styled from "styled-components";
import { Text } from "react-native";

export const MainViewContainer = styled.View`
  flex: 1;
  padding-top: 30px;
  padding-horizontal: 0;
`;

export const CurrentTempText = styled(Text)`
  font-size: 53px;
  font-weight: 300;
  font-family: "nunito";
  color: ${props => props.theme.colors.gray};
`;

export const Summmary = styled(Text)`
  padding-vertical: 10px;
  align-self: flex-end;
`;
