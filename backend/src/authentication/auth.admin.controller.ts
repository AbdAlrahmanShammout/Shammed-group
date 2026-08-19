import { Body, Controller, Get, HttpCode, HttpStatus, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Throttle } from '@nestjs/throttler';

import { AuthService } from '@/authentication/auth.service';
import { LoginRequestDto } from '@/authentication/dto/request/login-request.dto';
import { AuthSessionResponseDto } from '@/authentication/dto/response/auth-session-response.dto';
import { LoginResponseDto } from '@/authentication/dto/response/login-response.dto';
import { Role } from '@/authentication/enum/role.enum';
import { Principal } from '@/common/auth/principal.interface';
import { LOGIN_THROTTLE_LIMIT, LOGIN_THROTTLE_TTL_MS } from '@/common/constants/policy.constants';
import { LoggedInUser } from '@/common/decorators/requests/logged-in-user.decorator';
import { PublicRoute } from '@/common/decorators/route/public-route.decorator';
import { Roles } from '@/common/decorators/route/roles.decorator';
import { JwtAuthGuard } from '@/common/guards/jwt-auth.guard';
import { RolesGuard } from '@/common/guards/roles.guard';

@ApiTags('Admin - Auth')
@Controller('admin/auth')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class AuthAdminController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @PublicRoute()
  @HttpCode(HttpStatus.OK)
  @Throttle({ default: { ttl: LOGIN_THROTTLE_TTL_MS, limit: LOGIN_THROTTLE_LIMIT } })
  @ApiOperation({ summary: 'Exchange the admin password for an access token' })
  @ApiBody({ type: LoginRequestDto })
  @ApiResponse({ status: HttpStatus.OK, type: LoginResponseDto })
  async login(@Body() requestDto: LoginRequestDto): Promise<LoginResponseDto> {
    const result = await this.authService.login({
      password: requestDto.password,
    });
    return new LoginResponseDto(result);
  }

  @Get('me')
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Return the authenticated admin principal' })
  @ApiResponse({ status: HttpStatus.OK, type: AuthSessionResponseDto })
  getMe(@LoggedInUser() currentUser: Principal): AuthSessionResponseDto {
    return new AuthSessionResponseDto(currentUser);
  }
}
