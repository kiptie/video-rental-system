import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type VideoDocument = Video & Document;

@Schema()
export class Video {
  @Prop({ required: true })
  title: string;

  @Prop({
    required: true,
    enum: ['Regular', 'Children’s Movie', 'New Release'],
  })
  type: string;

  @Prop({
    required: true,
    enum: ['Action', 'Drama', 'Romance', 'Comedy', 'Horror'],
  })
  genre: string;

  @Prop()
  maximumAge?: number;

  @Prop()
  yearReleased?: number;
}

export const VideoSchema = SchemaFactory.createForClass(Video);
