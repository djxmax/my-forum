import { IsEnum, IsMongoId } from 'class-validator'
import { LikeParentType } from '@app/models/likes/like.schema'

export class CreateLikeDto {
    @IsMongoId()
    parentId: string

    @IsEnum(LikeParentType)
    parentType: LikeParentType
}
