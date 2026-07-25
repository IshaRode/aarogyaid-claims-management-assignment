import {
  Controller, Get, Post, Patch, Body, Param, Query, Request, UseGuards,
} from '@nestjs/common';
import { ClaimsService } from './claims.service';
import { CreateClaimDto, UpdateClaimDto } from './claims.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';

@Controller('claims')
@UseGuards(JwtAuthGuard, RolesGuard)
export class ClaimsController {
  constructor(private readonly claimsService: ClaimsService) {}

  @Post()
  @Roles('patient')
  create(@Body() createClaimDto: CreateClaimDto, @Request() req) {
    return this.claimsService.create(createClaimDto, req.user.id);
  }

  @Get('my')
  @Roles('patient')
  getMyClams(@Request() req) {
    return this.claimsService.findMyClams(req.user.id);
  }

  @Get('stats')
  getStats(@Request() req) {
    return this.claimsService.getStats(req.user.id, req.user.role);
  }

  @Get()
  @Roles('insurer')
  findAll(
    @Query('status') status?: string,
    @Query('search') search?: string,
    @Query('minAmount') minAmount?: number,
    @Query('maxAmount') maxAmount?: number,
    @Query('sort') sort?: string,
  ) {
    return this.claimsService.findAll({ status, search, minAmount, maxAmount, sort });
  }

  @Get(':id')
  findOne(@Param('id') id: string, @Request() req) {
    return this.claimsService.findOne(id, req.user.id, req.user.role);
  }

  @Patch(':id')
  @Roles('insurer')
  update(@Param('id') id: string, @Body() updateClaimDto: UpdateClaimDto) {
    return this.claimsService.update(id, updateClaimDto);
  }
}
