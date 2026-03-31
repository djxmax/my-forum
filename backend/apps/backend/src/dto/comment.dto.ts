import { IsMongoId, IsString, MinLength } from 'class-validator'
import { AuthorDto } from './author.dto'

export class CreateCommentDto {
    @IsString()
    @MinLength(1)
    text: string

    @IsMongoId()
    postId: string
}

export class CommentResponseDto {
    id: string
    content: string
    author: AuthorDto
    post: string
    likesCount: number
    hasLiked: boolean
    createdAt: Date
    updatedAt: Date
}
