import { Injectable, ExecutionContext } from '@nestjs/common'
import { AuthGuard } from '@nestjs/passport'

@Injectable()
export class OptionalJwtAuthGuard extends AuthGuard('jwt') {
    // Override pour ne pas lancer d'erreur si pas de token
    handleRequest(err: any, user: any) {
        return user ?? null // retourne l'user si connecté, null sinon
    }

    canActivate(context: ExecutionContext) {
        return super.canActivate(context)
    }
}
