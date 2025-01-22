import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Video, VideoDocument } from './schemas/video.schema';

@Injectable()
export class VideoService {
  constructor(
    @InjectModel(Video.name) private videoModel: Model<VideoDocument>,
  ) {}

  // Get paginated video list
  async getVideos(page: number, limit: number): Promise<Video[]> {
    const skip = (page - 1) * limit;
    // Fetch only the title, type, and genre fields
    return this.videoModel
      .find()
      .skip(skip)
      .limit(limit)
      .select('title type genre'); // Only return these fields
  }

  // Calculate rental price
  calculatePrice(
    type: string,
    days: number,
    additionalInfo?: any,
  ): { message: string; price: number } {
    let response = {
      message: '',
      price: 0,
    };

    switch (type) {
      case 'Regular':
        response.message = 'successful';
        response.price = days * 100;
        break;
      case 'Children’s Movie':
        response.message = 'successful';
        response.price = days * 50 + (additionalInfo?.maximumAge || 0) / 2;
        break;
      case 'New Release':
        response.message = 'successful';
        response.price =
          days * 150 -
          (new Date().getFullYear() - (additionalInfo?.yearReleased || 0));
        break;
      default:
        response.message = 'Invalid video type';
        throw new Error('Invalid video type');
    }

    return response;
  }

  // Create a new video
  async createVideo(videoData: Partial<Video>): Promise<Video> {
    const { title, type, genre } = videoData;

    // Validation
    if (!title) {
      throw new BadRequestException('Title is required');
    }
    if (!type) {
      throw new BadRequestException('Type is required');
    }
    if (!['Regular', 'Children’s Movie', 'New Release'].includes(type)) {
      throw new BadRequestException(
        'Invalid type. Allowed values are Regular, Children’s Movie, New Release',
      );
    }
    if (!genre) {
      throw new BadRequestException('Genre is required');
    }
    if (!['Action', 'Drama', 'Romance', 'Comedy', 'Horror'].includes(genre)) {
      throw new BadRequestException(
        'Invalid genre. Allowed values are Action, Drama, Romance, Comedy, Horror',
      );
    }

    // Check if a video with the same title and type already exists
    const existingVideo = await this.videoModel.findOne({ title, type });
    if (existingVideo) {
      throw new BadRequestException(
        'A video with the same title and type already exists',
      );
    }

    // Save to the database if no duplicate found
    const newVideo = new this.videoModel(videoData);
    return newVideo.save();
  }
}
