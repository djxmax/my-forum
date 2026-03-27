import { Controller, Get, UseGuards } from '@nestjs/common'
import { AnalyticsService } from '../services/analytics.service'
import { JwtAuthGuard } from '@app/auth/jwt/jwt-auth.guard'
import { CurrentUser } from '@app/auth'
import { UserDocument } from '@app/models/users/user.schema'

@Controller('analytics')
export class AnalyticsController {
    constructor(private analyticsService: AnalyticsService) {}

    // GET /analytics/me → stats de l'utilisateur connecté
    @Get('me')
    @UseGuards(JwtAuthGuard)
    getMyStats(@CurrentUser() user: UserDocument) {
        return this.analyticsService.getMyStats(user)
    }
}
