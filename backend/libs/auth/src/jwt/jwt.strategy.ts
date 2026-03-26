import { Injectable, UnauthorizedException } from '@nestjs/common'
import { PassportStrategy } from '@nestjs/passport'
import { ExtractJwt, Strategy } from 'passport-jwt'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'
import { User, UserDocument } from '@app/models/users/user.schema'

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(), // lit le token depuis le header Authorization: Bearer <token>
            ignoreExpiration: false,
            secretOrKey: process.env.JWT_SECRET,
        })
    }

    // Appelé automatiquement par Passport après validation du token
    // Le payload contient ce qu'on a mis dans le token lors du login
    async validate(payload: { sub: string; email: string }) {
        const user = await this.userModel.findById(payload.sub)
        if (!user) throw new UnauthorizedException()
        return user // injecté dans req.user
    }
}
