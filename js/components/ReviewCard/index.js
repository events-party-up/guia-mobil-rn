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
import { connect } from "react-redux";

const Card = styled.View`
  border-top-width: 1px;
  border-top-color: ${props => props.theme.colors.border};
  padding-top: 20px;
`;

const ReviewCard = ({ reviewText, onChangeText, userProfile }) => (
  <Card>
    <Heading2>Escribir un comentario </Heading2>
    <UserProfile
      profileImageUrl={userProfile.profilePic}
      userName={`${userProfile.firstName} ${userProfile.lastName}`}
    />
    <ReviewTextInput value={reviewText} onChangeText={onChangeText} />
  </Card>
);

const mapStateToProps = state => ({
  userProfile: state.auth.userProfile
});

export default connect(mapStateToProps)(ReviewCard);
