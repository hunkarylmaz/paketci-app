import { Injectable } from '@nestjs/common';
import { UsersService } from '../modules/users/users.service';

@Injectable()
export class SeedUsersCommand {
  constructor(private readonly usersService: UsersService) {}

  async run(): Promise<void> {
    console.log('Seeding users...');
    // Implementation here
  }
}

@Injectable()
export class ResetPasswordCommand {
  constructor(private readonly usersService: UsersService) {}

  async run(email: string, password: string): Promise<void> {
    console.log(`Resetting password for ${email}...`);
    // Implementation here
  }
}

@Injectable()
export class ListUsersCommand {
  constructor(private readonly usersService: UsersService) {}

  async run(): Promise<void> {
    console.log('Listing users...');
    // Implementation here
  }
}
