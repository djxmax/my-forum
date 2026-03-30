import { IsInt, IsOptional, Min } from 'class-validator'
import { Type } from 'class-transformer'

export class PaginationDto {
    @IsOptional()
    @Type(() => Number)
    @IsInt()
    @Min(0)
    page?: number = 0

    @IsOptional()
    @Type(() => Number)
    @IsInt()
    @Min(1)
    limit?: number = 10

}

export function getPaginationData(pagination: PaginationDto) {
    const page = Number(pagination.page ?? 0)
    const limit = Number(pagination.limit ?? 10)
    const skip = page * limit
    return [page, limit, skip]
}

export class PaginatedResponseDto<T> {
    data: T[]
    total: number
    page: number
    limit: number
    totalPages: number
}
