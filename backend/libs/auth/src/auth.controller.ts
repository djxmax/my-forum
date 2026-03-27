import { Controller, Post, Patch, Body, UseGuards } from '@nestjs/common'
import { AuthService } from './auth.service'
import { ChangePasswordDto, LoginDto, RegisterDto } from './dto/auth.dto'
import { JwtAuthGuard } from './jwt/jwt-auth.guard'
import { CurrentUser } from './decorators/current-user.decorator'
import { UserDocument } from '@app/models/users/user.schema'

@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) {}

    // POST /auth/register
    @Post('register')
    register(@Body() dto: RegisterDto) {
        return this.authService.register(dto)
    }

    // POST /auth/login
    @Post('login')
    login(@Body() dto: LoginDto) {
        return this.authService.login(dto)
    }

    // PATCH /auth/password
    @Patch('password')
    @UseGuards(JwtAuthGuard)
    changePassword(@Body() dto: ChangePasswordDto, @CurrentUser() user: UserDocument) {
        return this.authService.changePassword(user, dto)
    }
}
