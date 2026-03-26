import { IsOptional, IsString, MaxLength, MinLength } from 'class-validator'

export class CreatePostDto {
    @IsString()
    @MinLength(3)
    @MaxLength(150)
    title: string

    @IsString()
    @MinLength(1)
    text: string
}

export class UpdatePostDto {
    @IsOptional()
    @IsString()
    @MinLength(3)
    @MaxLength(150)
    title?: string

    @IsOptional()
    @IsString()
    @MinLength(1)
    text?: string
}
