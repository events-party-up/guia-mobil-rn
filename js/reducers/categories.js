// @flow
import * as actions from "../actions";
import { ICategory } from "../models";

export type State = {
  raw: ICategory[]
};

const categories = (state: State = { raw: [] }, action) => {
  switch (action.type) {
    case actions.CATEGORY_UPDATE_SUCCESS:
      return {
        raw: action.response.data
      };
    default:
      return state;
  }
};

export default categories;

// state selectors
export function getCategoriesWithParentId(
  state: State,
  id: number
): ICategory[] {
  console.log({ state });
  const parentCategory = state.raw.find(category => category.id === id);
  if (parentCategory) {
    return parentCategory.children;
  }
  return [];
}
