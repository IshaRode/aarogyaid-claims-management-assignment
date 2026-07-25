import { Injectable, OnApplicationBootstrap, Logger, ConflictException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcryptjs';
import { User, UserDocument, UserRole } from './user.schema';

@Injectable()
export class UsersService implements OnApplicationBootstrap {
  private readonly logger = new Logger(UsersService.name);

  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async onApplicationBootstrap() {
    await this.seedUsers();
  }

  private async seedUsers() {
    const demoUsers = [
      {
        email: 'patient@aarogyaid.com',
        password: 'password123',
        name: 'Priya Sharma',
        role: UserRole.PATIENT,
      },
      {
        email: 'insurer@aarogyaid.com',
        password: 'password123',
        name: 'Rajesh Kumar',
        role: UserRole.INSURER,
      },
    ];

    for (const userData of demoUsers) {
      const exists = await this.userModel.findOne({ email: userData.email });
      if (!exists) {
        const hashedPassword = await bcrypt.hash(userData.password, 10);
        await this.userModel.create({
          ...userData,
          password: hashedPassword,
        });
        this.logger.log(`Seeded user: ${userData.email}`);
      }
    }
  }

  async create(data: { email: string; password: string; name: string; role?: UserRole }): Promise<UserDocument> {
    const existing = await this.userModel.findOne({ email: data.email.toLowerCase() });
    if (existing) {
      throw new ConflictException('User with this email already exists');
    }

    const hashedPassword = await bcrypt.hash(data.password, 10);
    const newUser = await this.userModel.create({
      email: data.email.toLowerCase(),
      password: hashedPassword,
      name: data.name,
      role: data.role || UserRole.PATIENT,
    });

    return newUser;
  }

  async findByEmail(email: string): Promise<UserDocument | null> {
    return this.userModel.findOne({ email: email.toLowerCase() }).exec();
  }

  async findById(id: string): Promise<UserDocument | null> {
    return this.userModel.findById(id).exec();
  }
}
