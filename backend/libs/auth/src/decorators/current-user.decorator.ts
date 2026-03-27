import { createParamDecorator, ExecutionContext } from '@nestjs/common'
import { User, UserDocument } from '@app/models/users/user.schema'

export const CurrentUser = createParamDecorator((_data: unknown, ctx: ExecutionContext): UserDocument => {
    const request = ctx.switchToHttp().getRequest()
    return request.user
})
