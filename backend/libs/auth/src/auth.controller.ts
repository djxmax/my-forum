import { Controller, Post, Patch, Body, UseGuards, Req } from '@nestjs/common'
import { AuthService } from './auth.service'
import { ChangePasswordDto, LoginDto, RegisterDto } from './dto/auth.dto'
import { JwtAuthGuard } from './jwt/jwt-auth.guard'

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
    changePassword(@Body() dto: ChangePasswordDto, @Req() req) {
        return this.authService.changePassword(req.user, dto)
    }
}
