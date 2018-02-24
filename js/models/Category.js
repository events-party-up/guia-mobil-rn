// @flow

export interface ICategory {
    id: number;
    is_last: boolean;
    level: number;
    icon: string;
    parent_id: number;
    children: any[];
}
