import { createParamDecorator } from '@nestjs/common';

export interface PaginationType {
  take: number;
  skip: number;
}
export const Pagination = createParamDecorator((data, req): PaginationType => {
  let {page = 1, per_page = 20} = req.query;
  page = +page;
  per_page = +per_page;
  if (isNaN(page)) {
    page = 1;
  }
  if (isNaN(per_page)) {
    per_page = 20;
  }
  const skip = (page - 1) * per_page;
  return {
    skip: skip < 0 ? 0 : skip,
    take: per_page,
  };
});
