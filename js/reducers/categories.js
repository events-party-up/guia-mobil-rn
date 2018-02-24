// @flow
import * as actions from "../actions";

const categories = (state = [], action) => {
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
export function getCategoriesWithParentId(state, id: number) {
    console.log({ state });
    return state.raw.find(category => category.id === id).children;
}
