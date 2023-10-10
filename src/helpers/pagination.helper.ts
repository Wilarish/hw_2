import {BlogsPaginationType, DefaultPaginationType, SortDirectionEnum} from "../types/pagination.type";
import {BlogsMainType} from "../types/blogs/blogs-main-type";


export const getDefaultPagination = (query: any): DefaultPaginationType => {
    const defaultValues: DefaultPaginationType = {
        sortBy: 'createdAt',
        sortDirection: SortDirectionEnum.DESC,
        pageNumber: 1,
        pageSize: 10,
        skip: 0
    }

    if(query.sortBy) defaultValues.sortBy = query.sortBy
    if(query.sortDirection && query.sortDirection === SortDirectionEnum.ASC) defaultValues.sortDirection = query.sortDirection
    if(query.pageNumber && !isNaN(parseInt(query.pageNumber, 10)) && parseInt(query.pageNumber, 10) > 0) defaultValues.pageNumber = parseInt(query.pageNumber, 10)
    if(query.pageSize && !isNaN(parseInt(query.pageSize, 10)) && parseInt(query.pageSize, 10) > 0) defaultValues.pageSize = parseInt(query.pageSize, 10)

    defaultValues.skip = (defaultValues.pageNumber - 1) * defaultValues.pageSize

    return defaultValues
}

export const getBlogsPagination = (query: any): BlogsPaginationType => {
    const defaultValues: BlogsPaginationType = {
        searchNameTerm: '',
        ...getDefaultPagination(query)
    }

    if(query.searchNameTerm) defaultValues.searchNameTerm = query.searchNameTerm

    return defaultValues
}