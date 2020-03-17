import { Body, Controller, Get, Param, Post, Query, UseGuards, Inject, Request, Put, Response, Delete } from '@nestjs/common';
import {
  ApiUseTags,
  ApiOkResponse,
  ApiForbiddenResponse,
  ApiOperation,
} from '@nestjs/swagger';
import { CarouselService } from 'src/module/carousel/carousel.service';
import { AuthGuard } from '@nestjs/passport';



@ApiUseTags('carousel')
@ApiForbiddenResponse({ description: 'Unauthorized' })
@Controller('api/carousels')
export class ApiCarouselController {
  constructor(
    @Inject(CarouselService) private carouselService: CarouselService,
  ) { }


  @Get('')
  @ApiOkResponse({
    description: '轮播图列表',
  })
  @ApiOperation({ title: '轮播图列表', description: '轮播图列表' })
  async all(
  ): Promise<any> {
    return await this.carouselService.listByUser()
  }
}