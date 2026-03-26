import { Injectable, ConflictException, UnauthorizedException } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'
import { JwtService } from '@nestjs/jwt'
import * as bcrypt from 'bcrypt'
import { User, UserDocument } from '@app/models/users/user.schema'
import { LoginDto, RegisterDto } from './dto/auth.dto'

@Injectable()
export class AuthService {
    constructor(@InjectModel(User.name) private userModel: Model<UserDocument>, private jwtService: JwtService) {}

    async register(dto: RegisterDto) {
        const existing = await this.userModel.findOne({ email: dto.email })
        if (existing) throw new ConflictException('Email already in use')

        const hashedPassword = await bcrypt.hash(dto.password, 10)

        const user = await this.userModel.create({
            username: dto.username,
            email: dto.email,
            password: hashedPassword,
        })

        return this.signToken(user)
    }

    async login(dto: LoginDto) {
        const user = await this.userModel.findOne({ email: dto.email })
        if (!user) throw new UnauthorizedException('Invalid credentials')

        const isMatch = await bcrypt.compare(dto.password, user.password)
        if (!isMatch) throw new UnauthorizedException('Invalid credentials')

        return this.signToken(user)
    }

    private signToken(user: UserDocument) {
        const payload = { sub: user._id, email: user.email }
        return {
            access_token: this.jwtService.sign(payload),
            user: {
                id: user._id,
                username: user.username,
                email: user.email,
            },
        }
    }
}
