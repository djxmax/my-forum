import { Controller, Get, Post, Delete, Param, Body, UseGuards, Query } from '@nestjs/common'
import { PostService } from '../services/post.service'
import { CreatePostDto } from '../dto/post.dto'
import { JwtAuthGuard } from '@app/auth/jwt/jwt-auth.guard'
import { CurrentUser } from '@app/auth/decorators/current-user.decorator'
import { UserDocument } from '@app/models/users/user.schema'
import { OptionalJwtAuthGuard } from '@app/auth/jwt/optional-jwt-auth-guard'
import { PaginationDto } from '../dto/pagination.dto'

@Controller('posts')
export class PostController {
    constructor(private postService: PostService) {}

    @Get()
    @UseGuards(OptionalJwtAuthGuard)
    findAll(@CurrentUser() user: UserDocument, @Query() pagination: PaginationDto) {
        return this.postService.findAll(user, pagination)
    }

    @Get(':id')
    @UseGuards(OptionalJwtAuthGuard)
    findOne(@Param('id') id: string, @CurrentUser() user: UserDocument) {
        return this.postService.findOne(id, user)
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
