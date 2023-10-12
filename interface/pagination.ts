export interface Pagination {
  current: number;
  limit: number;
  total: number;
  next?: {
    page: number;
    limit: number;
    total: number;
  };
  prev?: {
    page: number;
    limit: number;
    total: number;
  };
}

export interface QueryOptions{
  offset: number;
  limit: number;
  attributes?: any;
  order: [string[]];
  where?: any,
  include?: any;
  group?: any
}

export const ignoreKeys = ['page', 'limit', 'days', 'from', 'to', 'latitude', 'longitude', 'term', 'order', 'columns'];