// @flow
import * as actions from "../actions";
import { ICategory } from "../models";

export type State = {
  raw: ICategory[],
  byId: {
    [key: number]: ICategory
  }
};

const categories = (state: State = { raw: [], byId: {} }, action) => {
  switch (action.type) {
    case actions.CATEGORY_UPDATE_SUCCESS:
      return {
        raw: action.response.data,
        byId: flatTree(action.response.data)
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

export function getCategoryWithId(state: State, id: number): ?ICategory {
  return state.byId[id];
}

export function getCategoryChain(
  state: State,
  childCategoryId: number
): ICategory[] {
  const category = state.byId[childCategoryId];
  if (category) {
    return [...getCategoryChain(state, category.parent_id), category];
  }
  return [];
}

// flat the tree and store the ids instead
function flatTree(
  categoryTree: ICategory[]
): {
  [key: number]: ICategory
} {
  return categoryTree.reduce(
    (acc, category) => ({
      ...acc,
      [category.id]: {
        ...category,
        children: category.children.map(childrenCat => childrenCat.id)
      },
      ...flatTree(category.children)
    }),
    {}
  );
}
