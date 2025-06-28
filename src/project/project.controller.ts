import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
  Req,
} from '@nestjs/common';
import { ProjectService } from './project.service';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { ApiBearerAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { GetProjecListtDto } from './dto/get-project-list.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { Request } from 'express';

@Controller('project')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
export class ProjectController {
  constructor(private readonly projectService: ProjectService) {}

  @Post('create')
  create(@Body() createProjectDto: CreateProjectDto, @Req() req: Request) {
    return this.projectService.create(createProjectDto, req.user);
  }

  @ApiOperation({ summary: '프로젝트 목록 조회' })
  @ApiResponse({ status: 200, description: '프로젝트 목록 조회 성공' })
  @Get('list')
  findAll(@Query() queryParams: GetProjecListtDto) {
    return this.projectService.findAll(queryParams);
  }

  @ApiOperation({ summary: '프로젝트 상세 조회' })
  @ApiResponse({ status: 200, description: '프로젝트 상세 조회 성공' })
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.projectService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateProjectDto: UpdateProjectDto) {
    return this.projectService.update(+id, updateProjectDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.projectService.remove(+id);
  }
}
