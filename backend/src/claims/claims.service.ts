import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Claim, ClaimDocument, ClaimStatus } from './claim.schema';
import { CreateClaimDto, UpdateClaimDto } from './claims.dto';

@Injectable()
export class ClaimsService {
  constructor(@InjectModel(Claim.name) private claimModel: Model<ClaimDocument>) {}

  private generateAiSummary(claim: CreateClaimDto): string {
    const amount = claim.claimAmount;
    const name = claim.patientName;
    const desc = claim.description.toLowerCase();

    let claimType = 'medical';
    if (desc.includes('prescription') || desc.includes('medicine') || desc.includes('pharmacy')) {
      claimType = 'pharmacy and prescription';
    } else if (desc.includes('surgery') || desc.includes('operation') || desc.includes('surgical')) {
      claimType = 'surgical procedure';
    } else if (desc.includes('consultation') || desc.includes('doctor') || desc.includes('opd')) {
      claimType = 'outpatient consultation';
    } else if (desc.includes('hospital') || desc.includes('admitted') || desc.includes('ipd')) {
      claimType = 'inpatient hospitalization';
    } else if (desc.includes('lab') || desc.includes('test') || desc.includes('blood') || desc.includes('scan')) {
      claimType = 'diagnostic and laboratory';
    } else if (desc.includes('dental') || desc.includes('tooth') || desc.includes('teeth')) {
      claimType = 'dental treatment';
    }

    const docText = claim.uploadedDocument
      ? 'with attached supporting documents'
      : 'pending document submission';

    return `Patient ${name} submitted a ₹${amount.toLocaleString('en-IN')} ${claimType} claim ${docText}. The claim description indicates ${desc.substring(0, 80)}... This claim has been flagged for standard review based on the provided information.`;
  }

  private getRiskLevel(amount: number): string {
    if (amount < 10000) return 'Low';
    if (amount <= 50000) return 'Medium';
    return 'High';
  }

  async create(createClaimDto: CreateClaimDto, userId: string): Promise<ClaimDocument> {
    const aiSummary = this.generateAiSummary(createClaimDto);
    const riskLevel = this.getRiskLevel(createClaimDto.claimAmount);

    const claim = new this.claimModel({
      ...createClaimDto,
      patientId: new Types.ObjectId(userId),
      status: ClaimStatus.PENDING,
      aiSummary,
      riskLevel,
    });
    return claim.save();
  }

  async findMyClams(userId: string): Promise<ClaimDocument[]> {
    return this.claimModel
      .find({ patientId: new Types.ObjectId(userId) })
      .sort({ createdAt: -1 })
      .exec();
  }

  async findAll(query: {
    status?: string;
    search?: string;
    minAmount?: number;
    maxAmount?: number;
    sort?: string;
  }): Promise<ClaimDocument[]> {
    const filter: any = {};

    if (query.status && query.status !== 'all') {
      filter.status = query.status;
    }

    if (query.search) {
      filter.$or = [
        { patientName: { $regex: query.search, $options: 'i' } },
        { email: { $regex: query.search, $options: 'i' } },
      ];
    }

    if (query.minAmount || query.maxAmount) {
      filter.claimAmount = {};
      if (query.minAmount) filter.claimAmount.$gte = Number(query.minAmount);
      if (query.maxAmount) filter.claimAmount.$lte = Number(query.maxAmount);
    }

    let sortOption: any = { createdAt: -1 };
    if (query.sort === 'oldest') sortOption = { createdAt: 1 };
    if (query.sort === 'highest') sortOption = { claimAmount: -1 };

    return this.claimModel.find(filter).sort(sortOption).exec();
  }

  async findOne(id: string, userId?: string, role?: string): Promise<ClaimDocument> {
    const claim = await this.claimModel.findById(id).exec();
    if (!claim) throw new NotFoundException('Claim not found');

    if (role === 'patient' && claim.patientId.toString() !== userId) {
      throw new ForbiddenException('Access denied');
    }

    return claim;
  }

  async update(id: string, updateClaimDto: UpdateClaimDto): Promise<ClaimDocument> {
    const claim = await this.claimModel.findByIdAndUpdate(id, updateClaimDto, { new: true }).exec();
    if (!claim) throw new NotFoundException('Claim not found');
    return claim;
  }

  async getStats(userId?: string, role?: string) {
    const match: any = {};
    if (role === 'patient' && userId) {
      match.patientId = new Types.ObjectId(userId);
    }

    const [stats] = await this.claimModel.aggregate([
      { $match: match },
      {
        $group: {
          _id: null,
          total: { $sum: 1 },
          pending: { $sum: { $cond: [{ $eq: ['$status', 'Pending'] }, 1, 0] } },
          approved: { $sum: { $cond: [{ $eq: ['$status', 'Approved'] }, 1, 0] } },
          rejected: { $sum: { $cond: [{ $eq: ['$status', 'Rejected'] }, 1, 0] } },
          totalApprovedAmount: { $sum: { $ifNull: ['$approvedAmount', 0] } },
        },
      },
    ]);

    return stats || { total: 0, pending: 0, approved: 0, rejected: 0, totalApprovedAmount: 0 };
  }
}
