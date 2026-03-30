import { Controller, Get, Post, Delete, Param, Body, UseGuards } from '@nestjs/common'
import { PostService } from '../services/post.service'
import { CreatePostDto } from '../dto/post.dto'
import { JwtAuthGuard } from '@app/auth/jwt/jwt-auth.guard'
import { CurrentUser } from '@app/auth/decorators/current-user.decorator'
import { UserDocument } from '@app/models/users/user.schema'

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
    create(@Body() dto: CreatePostDto, @CurrentUser() user: UserDocument) {
        return this.postService.create(dto, user)
    }

    @Delete(':id')
    @UseGuards(JwtAuthGuard)
    delete(@Param('id') id: string, @CurrentUser() user: UserDocument) {
        return this.postService.delete(id, user)
    }
}
