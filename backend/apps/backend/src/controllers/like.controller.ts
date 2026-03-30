import { Controller, Post, Body, UseGuards, Req } from '@nestjs/common'
import { LikeService } from '../services/like.service'
import { JwtAuthGuard } from '@app/auth/jwt/jwt-auth.guard'
import { CreateLikeDto } from '../dto/like.dto'
import { CurrentUser } from '@app/auth/decorators/current-user.decorator'
import { UserDocument } from '@app/models/users/user.schema'

@Controller('likes')
export class LikeController {
    constructor(private likeService: LikeService) {}

    @Post()
    @UseGuards(JwtAuthGuard)
    toggleLike(@Body() dto: CreateLikeDto, @CurrentUser() user: UserDocument) {
        return this.likeService.toggleLike(dto, user)
    }
}
