// @flow
export interface IReview {
  id: number;
  item_id: number;
  user_id: string;
  profile_img: string;
  profile_name: string;
  date: string;
  price: number;
  stars: number;
  rtext: string;
  uuid: string;
  updated_at: string;
}
