import { Controller, Get, Query, Post, Body } from '@nestjs/common';
import { VideoService } from './video.service';
import { Video } from './schemas/video.schema';

@Controller('videos')
export class VideoController {
  constructor(private readonly videoService: VideoService) {}

  @Get()
  async getVideos(@Query('page') page = 1, @Query('limit') limit = 5) {
    return this.videoService.getVideos(Number(page), Number(limit));
  }

  @Post('calculate-price')
  calculatePrice(
    @Body('type') type: string,
    @Body('days') days: number,
    @Body('additionalInfo') additionalInfo?: any,
  ) {
    return {
      data: this.videoService.calculatePrice(type, days, additionalInfo),
    };
  }

  @Post('create-video')
  async createVideo(@Body() videoData: Partial<Video>) {
    return this.videoService.createVideo(videoData);
  }
}
