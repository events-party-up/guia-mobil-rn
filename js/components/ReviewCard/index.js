import React, { Component } from "react";
import {
  View,
  StyleSheet,
  Text,
  Linking,
  Platform,
  Share,
  Image
} from "react-native";
import UserProfile from "../common/UserProfile";
import ReviewTextInput from "../ReviewTextInput";
import { Heading2 } from "../common/Text";
import styled from "styled-components";

const Card = styled.View`
  border-top-width: 1px;
  border-top-color: ${props => props.theme.colors.border};
  padding-top: 20px;
`;

const ReviewCard = ({ reviewText, onChangeText }) => (
  <Card>
    <Heading2>Escribir un comentario </Heading2>
    <UserProfile userName="Miguel Carvajal" />
    <ReviewTextInput value={reviewText} onChangeText={onChangeText} />
  </Card>
);

export default ReviewCard;
