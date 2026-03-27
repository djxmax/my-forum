import { Controller, Get, Post, Delete, Param, Body, UseGuards, Req, Patch } from '@nestjs/common'
import { PostService } from '../services/post.service'
import { CreatePostDto } from '../dto/post.dto'
import { JwtAuthGuard } from '@app/auth/jwt/jwt-auth.guard'

@Controller('posts')
export class PostController {
    constructor(private postService: PostService) {}

    @Get()
    findAll() {
        return this.postService.findAll()
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.postService.findOne(id)
    }

    @Post()
    @UseGuards(JwtAuthGuard)
    create(@Body() dto: CreatePostDto, @Req() req) {
        return this.postService.create(dto, req.user)
    }

    @Patch(':id/like')
    @UseGuards(JwtAuthGuard)
    toggleLike(@Param('id') id: string, @Req() req) {
        return this.postService.toggleLike(id, req.user)
    }

    @Delete(':id')
    @UseGuards(JwtAuthGuard)
    delete(@Param('id') id: string, @Req() req) {
        return this.postService.delete(id, req.user)
    }
}
