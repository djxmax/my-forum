import { IsOptional, IsString, MaxLength, MinLength } from 'class-validator'
import { AuthorDto } from './author.dto'

export class CreatePostDto {
    @IsString()
    @MinLength(3)
    @MaxLength(150)
    title: string

    @IsString()
    @MinLength(1)
    text: string
}

export class UpdatePostDto {
    @IsOptional()
    @IsString()
    @MinLength(3)
    @MaxLength(150)
    title?: string

    @IsOptional()
    @IsString()
    @MinLength(1)
    text?: string
}

export class PostResponseDto {
    id: string
    title: string
    content: string
    author: AuthorDto
    likesCount: number
    hasLiked: boolean
    createdAt: Date
    updatedAt: Date
}
