import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { EnvService } from '../env/env.service';
import z from 'zod';
import { Injectable } from '@nestjs/common';
import { UsersRepository } from '@/domain/application/repositories/users-repository';

const tokenPayloadSchema = z.object({
  sub: z.uuid(),
  user_email: z.email().optional(),
});

export type UserPayload = z.infer<typeof tokenPayloadSchema>;

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    config: EnvService,
    private usersRepository: UsersRepository,
  ) {
    const publicKey = config.get('JWT_PUBLIC_KEY');

    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: Buffer.from(publicKey, 'base64'),
      algorithms: ['RS256'],
    });
  }

  async validate(payload: UserPayload) {
    const parsed = tokenPayloadSchema.parse(payload);
    const user = await this.usersRepository.findById(parsed.sub);

    if (!user) {
      return parsed;
    }

    return {
      sub: parsed.sub,
      user_email: parsed.user_email,
      role: user.role,
    };
  }
}
