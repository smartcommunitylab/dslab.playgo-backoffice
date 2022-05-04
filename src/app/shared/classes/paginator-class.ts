export class Paginator<T> {
    
    content?: T[];
    empty?: boolean;
    first?: boolean;
    last?: boolean;
    number?: number;
    numberOfElements?: number;
    pageable?: Pagable;
    size?: number;
    sort?: SortPagable;
    totalElements?: number;
    totalPages?: number;
  }

export class Pagable{
    page?: number;
    size?: number;
    sort?: string;
}

export class SortPagable{
    empty?: number;
    sorted?: number;
    unsorted?: string;
}