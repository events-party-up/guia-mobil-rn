import React from "react";
import { TouchableOpacity, Text } from "react-native";
import styled from "styled-components";

const ButtonContainer = styled.TouchableOpacity`
    background-color: ${props =>
        props.primary ? props.theme.colors.primary : props.theme.colors.gray};
    padding: 10px;
    flex: 1;
    margin-left: 10px;
    margin-right: 10px;
    shadow-color: #000;
    elevation: 1;
    shadow-offset: 0px 2px;
    shadow-opacity: 0.8;
    shadow-radius: 2;
`;

const ButtonText = styled.Text`
    color: white;
    font-size: 18px;
    text-align: center;
`;

const Button = ({ title, style, ...props }) => (
    <ButtonContainer {...props} style={style} activeOpacity={0.7}>
        <ButtonText>{title}</ButtonText>
    </ButtonContainer>
);

export default Button;
