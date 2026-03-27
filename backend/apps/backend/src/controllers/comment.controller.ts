import { Controller, Get, Post, Delete, Param, Body, UseGuards, Req, Patch } from '@nestjs/common'
import { CommentService } from '../services/comment.service'
import { CreateCommentDto } from '../dto/comment.dto'
import { JwtAuthGuard } from '@app/auth/jwt/jwt-auth.guard'

@Controller('comments')
export class CommentController {
    constructor(private commentService: CommentService) {}

    @Get('post/:postId')
    findByPost(@Param('postId') postId: string) {
        return this.commentService.findByPost(postId)
    }

    @Post()
    @UseGuards(JwtAuthGuard)
    create(@Body() dto: CreateCommentDto, @Req() req) {
        return this.commentService.create(dto, req.user)
    }

    @Patch(':id/like')
    @UseGuards(JwtAuthGuard)
    toggleLike(@Param('id') id: string, @Req() req) {
        return this.commentService.toggleLike(id, req.user)
    }

    @Delete(':id')
    @UseGuards(JwtAuthGuard)
    delete(@Param('id') id: string, @Req() req) {
        return this.commentService.delete(id, req.user)
    }
}
