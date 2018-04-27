import React, { Component } from "react";
import { StyleSheet, View, Text, TextInput } from "react-native";
import styled from "styled-components";
const ALLOWED_CHAR_COUNT = 100;

const TextArea = styled.TextInput`
  border-width: 1px;
  font-size: 20px;
  font-family: "Nunito";
  border-color: ${props =>
    props.hasError ? "red" : props.theme.colors.border};
  color: ${props => (props.hasError ? "red" : props.theme.colors.black)};
`;
const WordCountText = styled.Text`
  color: ${props => (props.hasError ? "red" : props.theme.colors.black)};
`;
const ReviewTextInput = ({ value, onChangeText }) => {
  const charCount = value.length;

  return (
    <View>
      <TextArea
        placeholder={"Contale a las personas tu experiencia"}
        multiline
        hasError={charCount >= ALLOWED_CHAR_COUNT}
        autofocus
        onChangeText={onChangeText}
        value={value}
        underlineColorAndroid="transparent"
      />
      <View>
        <WordCountText hasError={charCount >= ALLOWED_CHAR_COUNT}>
          {`${charCount}/${ALLOWED_CHAR_COUNT}`}{" "}
        </WordCountText>
      </View>
    </View>
  );
};

export default ReviewTextInput;
