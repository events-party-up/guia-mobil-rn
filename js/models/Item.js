// @flow

export interface IItem {
  id: number;
  category_id: number;
  is_featured: number;
  price: number;
  is_published: number;
  is_special: number;
  address: number;
  coord: number[];
  name: string;
  mail: string;
  description: string;
  image: ?string;
  rating: ?number;
  price: ?number;
  url: ?string;
  chars: number[];
}
