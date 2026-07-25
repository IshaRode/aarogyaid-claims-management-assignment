import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema, Types } from 'mongoose';

export type ClaimDocument = Claim & Document;

export enum ClaimStatus {
  PENDING = 'Pending',
  APPROVED = 'Approved',
  REJECTED = 'Rejected',
}

@Schema({ timestamps: true })
export class Claim {
  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User', required: true })
  patientId: Types.ObjectId;

  @Prop({ required: true })
  patientName: string;

  @Prop({ required: true })
  email: string;

  @Prop({ required: true })
  claimAmount: number;

  @Prop({ type: Number, default: null })
  approvedAmount: number | null;

  @Prop({ required: true })
  description: string;

  @Prop({ type: String, default: null })
  uploadedDocument: string | null;

  @Prop({ enum: Object.values(ClaimStatus), default: ClaimStatus.PENDING })
  status: ClaimStatus;

  @Prop({ type: String, default: null })
  insurerComments: string | null;

  @Prop({ type: String, default: null })
  aiSummary: string | null;

  @Prop({ enum: ['Low', 'Medium', 'High'], default: 'Low' })
  riskLevel: string;
}

export const ClaimSchema = SchemaFactory.createForClass(Claim);
