import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type UserDocument = User & Document;

export enum UserRole {
  PATIENT = 'patient',
  INSURER = 'insurer',
}

@Schema({ timestamps: true })
export class User {
  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true })
  password: string;

  @Prop({ required: true })
  name: string;

  @Prop({ enum: UserRole, default: UserRole.PATIENT })
  role: UserRole;

  @Prop()
  avatar?: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
