import { Controller, Get, UseGuards, Req } from '@nestjs/common'
import { AnalyticsService } from '../services/analytics.service'
import { JwtAuthGuard } from '@app/auth/jwt/jwt-auth.guard'

@Controller('analytics')
export class AnalyticsController {
    constructor(private analyticsService: AnalyticsService) {}

    // GET /analytics/me → stats de l'utilisateur connecté
    @Get('me')
    @UseGuards(JwtAuthGuard)
    getMyStats(@Req() req) {
        return this.analyticsService.getMyStats(req.user)
    }
}
