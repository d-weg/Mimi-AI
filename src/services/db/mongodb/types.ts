

export interface GetManyPaginatedResponse<T> {
    data: T[]
    page: number
    total: number
    totalPages: number
}