import React from "react";
import styled from "styled-components";

export const Container = styled.View`
  background-color: ${props => props.theme.colors.primary};
  flex: 1;
  padding-horizontal: 16px;
`;

export const HeaderText = styled.Text`
  font-family: "Nunito";
  text-align: center;
  font-size: 24px;
  font-weight: 200;
  color: white;
`;
