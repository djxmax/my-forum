import { Controller, Get, Post, Delete, Param, Body, UseGuards } from '@nestjs/common'
import { CommentService } from '../services/comment.service'
import { CreateCommentDto } from '../dto/comment.dto'
import { JwtAuthGuard } from '@app/auth/jwt/jwt-auth.guard'
import { CurrentUser } from '@app/auth'
import { UserDocument } from '@app/models/users/user.schema'
import { OptionalJwtAuthGuard } from '@app/auth/jwt/optional-jwt-auth-guard'

@Controller('comments')
export class CommentController {
    constructor(private commentService: CommentService) {}

    @Get('post/:postId')
    @UseGuards(OptionalJwtAuthGuard)
    findByPost(@Param('postId') postId: string, @CurrentUser() user: UserDocument) {
        return this.commentService.findByPost(postId, user)
    }

    @Post()
    @UseGuards(JwtAuthGuard)
    create(@Body() dto: CreateCommentDto, @CurrentUser() user: UserDocument) {
        return this.commentService.create(dto, user)
    }

    @Delete(':id')
    @UseGuards(JwtAuthGuard)
    delete(@Param('id') id: string, @CurrentUser() user: UserDocument) {
        return this.commentService.delete(id, user)
    }
}
