import React from "react";
import styled from "styled-components";
import { Heading2 } from "../../components/common/Text";

const CONTAINER_PADDING_H = 16;

export const Subtitle = styled.Text`
  color: ${props => props.theme.colors.gray};
  font-size: 18px;
  line-height: 18px;
  padding-top: 10px;
  padding-bottom: 10px;
`;

export const WeekImagesContainer = styled.View`
  background-color: ${props => props.theme.colors.lightBackground};
  padding-horizontal: ${CONTAINER_PADDING_H}px;
  padding-top: 20px;
  padding-bottom: 40px;
`;

export const WeekImagesHeader = styled(Heading2)`
  color: ${props => props.theme.colors.gray};
  padding-vertical: 10px;
`;
