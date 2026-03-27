import { IsEmail, IsString, MinLength, MaxLength } from 'class-validator'

export class ChangePasswordDto {
    @IsString()
    @MinLength(1)
    currentPassword: string

    @IsString()
    @MinLength(6)
    newPassword: string
}

export class RegisterDto {
    @IsString()
    @MinLength(3)
    @MaxLength(30)
    username: string

    @IsEmail()
    email: string

    @IsString()
    @MinLength(6)
    password: string
}

export class LoginDto {
    @IsEmail()
    email: string

    @IsString()
    @MinLength(1)
    password: string
}
