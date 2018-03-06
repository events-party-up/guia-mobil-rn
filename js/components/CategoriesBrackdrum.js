// @flow
import React from "react";
import styled from "styled-components";
import { ICategory } from "../models";

type Props = {
  categoryChain: ICategory[]
};

const CategoryLabel = styled.Text`
  color: ${props => props.theme.colors.primary};
  padding-horizontal: 10px;
`;

const CategoriesBreakdrumContainer = styled.View`
  flex-direction: row;
  flex-wrap: wrap;
  padding-vertical: 10px;
  align-items: center;
`;

const arrowLeft = require("./img/header/back.png");

const ThemedImage = styled.Image`
  tint-color: ${props => props.theme.colors.primary};
  height: 10px;
  width: 10px;
`;
const Separator = () => <ThemedImage source={arrowLeft} />;

const CategoriesBreakdrum = ({ categoryChain }: Props) => (
  <CategoriesBreakdrumContainer>
    {categoryChain
      .map(category => (
        <CategoryLabel key={`cat_${category.id}`}>
          {category.name.toUpperCase()}
        </CategoryLabel>
      ))
      .reduce((items, category) => {
        if (items.length)
          return [
            ...items,
            <Separator key={`sep_${items.length}`} />,
            category
          ];
        return [...items, category];
      }, [])}
  </CategoriesBreakdrumContainer>
);

export default CategoriesBreakdrum;
