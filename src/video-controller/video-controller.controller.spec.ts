import { Test, TestingModule } from '@nestjs/testing';
import { VideoController } from '../video.controller';
import { VideoService } from '../video.service';
import { BadRequestException } from '@nestjs/common';

describe('VideoController', () => {
  let videoController: VideoController;
  let videoService: VideoService;

  const mockVideoService = {
    getVideos: jest.fn(),
    calculatePrice: jest.fn(),
    createVideo: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [VideoController],
      providers: [
        {
          provide: VideoService,
          useValue: mockVideoService,
        },
      ],
    }).compile();

    videoController = module.get<VideoController>(VideoController);
    videoService = module.get<VideoService>(VideoService);
  });

  it('should be defined', () => {
    expect(videoController).toBeDefined();
  });

  describe('getVideos', () => {
    it('should return a list of videos', async () => {
      const result = [
        { title: 'Video 1', type: 'Regular', genre: 'Action' },
        { title: 'Video 2', type: 'New Release', genre: 'Drama' },
      ];
      mockVideoService.getVideos.mockResolvedValue(result);

      const page = 1;
      const limit = 5;

      expect(await videoController.getVideos(page, limit)).toEqual(result);
      expect(mockVideoService.getVideos).toHaveBeenCalledWith(page, limit);
    });
  });

  describe('calculatePrice', () => {
    it('should return the calculated price for a regular video', () => {
      const type = 'Regular';
      const days = 3;
      const expectedResult = { message: 'successful', price: 300 };

      mockVideoService.calculatePrice.mockReturnValue(expectedResult);

      expect(videoController.calculatePrice(type, days)).toEqual({
        data: expectedResult,
      });
      expect(mockVideoService.calculatePrice).toHaveBeenCalledWith(
        type,
        days,
        undefined,
      );
    });

    it('should throw an error for invalid video type', () => {
      const type = 'InvalidType';
      const days = 3;

      mockVideoService.calculatePrice.mockImplementation(() => {
        throw new Error('Invalid video type');
      });

      expect(() => videoController.calculatePrice(type, days)).toThrowError(
        'Invalid video type',
      );
    });
  });

  describe('createVideo', () => {
    it('should create and return a new video', async () => {
      const videoData = {
        title: 'New Video',
        type: 'Regular',
        genre: 'Action',
      };
      const result = {
        _id: 'abc123',
        ...videoData,
      };

      mockVideoService.createVideo.mockResolvedValue(result);

      expect(await videoController.createVideo(videoData)).toEqual(result);
      expect(mockVideoService.createVideo).toHaveBeenCalledWith(videoData);
    });

    it('should throw an error if the title is missing', async () => {
      const videoData = {
        type: 'Regular',
        genre: 'Action',
      };

      mockVideoService.createVideo.mockImplementation(() => {
        throw new BadRequestException('Title is required');
      });

      await expect(videoController.createVideo(videoData)).rejects.toThrow(
        BadRequestException,
      );
      expect(mockVideoService.createVideo).toHaveBeenCalledWith(videoData);
    });

    it('should throw an error if a video with the same title and type exists', async () => {
      const videoData = {
        title: 'Duplicate Video',
        type: 'Regular',
        genre: 'Action',
      };

      mockVideoService.createVideo.mockImplementation(() => {
        throw new BadRequestException(
          'A video with the same title and type already exists',
        );
      });

      await expect(videoController.createVideo(videoData)).rejects.toThrow(
        BadRequestException,
      );
      expect(mockVideoService.createVideo).toHaveBeenCalledWith(videoData);
    });
  });
});
