import { Controller, Get, Post, Delete, Param, Body, UseGuards } from '@nestjs/common'
import { CommentService } from '../services/comment.service'
import { CreateCommentDto } from '../dto/comment.dto'
import { JwtAuthGuard } from '@app/auth/jwt/jwt-auth.guard'
import { CurrentUser } from '@app/auth'
import { UserDocument } from '@app/models/users/user.schema'

@Controller('comments')
export class CommentController {
    constructor(private commentService: CommentService) {}

    @Get('post/:postId')
    findByPost(@Param('postId') postId: string) {
        return this.commentService.findByPost(postId)
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
