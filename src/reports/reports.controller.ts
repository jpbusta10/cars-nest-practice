import { Controller, Post, Body, UseGuards, Patch, Param } from '@nestjs/common';
import { CreateReportDTO } from './dtos/create-report-dto';
import { ReportsService } from './reports.service';
import { AuthGuard } from 'src/gurds/auth.gurds';
import { CurrentUser } from 'src/users/decorators/currentUser.decorator';
import  { User } from '../users/user.entity'
import { ReportDTO } from './dtos/report.dto';
import { Serialize } from 'src/interceptors/serialize.interceptor';
import { ApproveReportDto } from './dtos/approve-report-dto';

@Controller('reports')
export class ReportsController {
    constructor(private reportsService: ReportsService) {}

    @Post()
    @UseGuards(AuthGuard)
    @Serialize(ReportDTO)
    createReport(@Body() body: CreateReportDTO, @CurrentUser() user:User) {
        return this.reportsService.create(body, user);
    }

    @Patch('/:id')
    approveReport(@Param('id') id: string, @Body() body: ApproveReportDto) {

    }
}
