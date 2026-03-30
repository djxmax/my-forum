import { Module } from '@nestjs/common'
import { JwtModule } from '@nestjs/jwt'
import { PassportModule } from '@nestjs/passport'
import { MongooseModule } from '@nestjs/mongoose'
import { AuthService } from './auth.service'
import { AuthController } from './auth.controller'
import { User, UserSchema } from '@app/models/users/user.schema'
import { JwtStrategy } from './jwt/jwt.strategy'
import { JwtAuthGuard } from './jwt/jwt-auth.guard'
import { ConfigModule } from '@nestjs/config'
import { OptionalJwtAuthGuard } from './jwt/optional-jwt-auth-guard'

@Module({
    imports: [
        ConfigModule.forRoot({ isGlobal: true }),
        MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
        PassportModule,
        JwtModule.register({
            secret: process.env.JWT_SECRET,
            signOptions: { expiresIn: '7d' },
        }),
    ],
    controllers: [AuthController],
    providers: [AuthService, JwtStrategy, JwtAuthGuard, OptionalJwtAuthGuard],
    exports: [JwtAuthGuard],
})
export class AuthModule {}
