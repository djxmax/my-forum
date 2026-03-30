import { Injectable, ExecutionContext, UnauthorizedException } from '@nestjs/common'
import { AuthGuard } from '@nestjs/passport'

@Injectable()
export class OptionalJwtAuthGuard extends AuthGuard('jwt') {
    handleRequest(err: any, user: any, info: any) {
        // Token fourni mais invalide (expiré, mauvaise signature, etc.)
        if (info?.name === 'JsonWebTokenError' || info?.name === 'TokenExpiredError' || err) {
            throw new UnauthorizedException(info?.message ?? err?.message)
        }
        // Pas de token ou token ok : on laisse passer et on donne le usersi token ok
        return user ?? null
    }

    canActivate(context: ExecutionContext) {
        return super.canActivate(context)
    }
}
