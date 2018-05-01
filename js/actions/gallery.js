// @flow
import { normalize, schema } from "normalizr";
import type Axios from "axios";
// Define a users schema
const picture = new schema.Entity("pictures");
const gallery = new schema.Array(picture);

export const ITEM_GALLERY_LOAD = "ITEM_GALLERY_LOAD";
export const ITEM_GALLERY_LOAD_SUCCESS = "ITEM_GALLERY_LOAD_SUCCESS";
export const ITEM_GALLERY_LOAD_FAILURE = "ITEM_GALLERY_LOAD_FAILURE";

export const galleryLoad = (id: number, options: Object) => ({
  type: ITEM_GALLERY_LOAD,
  apiCall: (apiClient: Axios, { itemId }: { itemId: string | number }) => {
    return apiClient.get(`gallery/${itemId}`).then(res => {
      const normalizedData = normalize(res.data, gallery);
      return {
        data: normalizedData
      };
    });
  },
  payload: {
    itemId: id
  },
  options
});
