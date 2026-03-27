import { Controller, Get, Post, Delete, Param, Body, UseGuards, Req, Patch } from '@nestjs/common'
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

    @Patch(':id/like')
    @UseGuards(JwtAuthGuard)
    toggleLike(@Param('id') id: string, @Req() @CurrentUser() user: UserDocument) {
        return this.commentService.toggleLike(id, user)
    }

    @Delete(':id')
    @UseGuards(JwtAuthGuard)
    delete(@Param('id') id: string, @CurrentUser() user: UserDocument) {
        return this.commentService.delete(id, user)
    }
}
