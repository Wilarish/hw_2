
export enum SortDirectionEnum {
    ASC = 'asc',
    DESC = 'desc'
}

export type DefaultPaginationType = {

    sortBy: string,
    sortDirection: SortDirectionEnum,
    pageNumber: number,
    pageSize: number,
    skip: number
}

export type BlogsPaginationType = DefaultPaginationType & {
    searchNameTerm: string,
}


export type Paginated<T> = {
    pagesCount: number,
    page: number,
    pageSize: number,
    totalCount: number,
    items: T[]
}