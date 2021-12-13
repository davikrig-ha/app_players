import { BadRequestException, PipeTransform } from "@nestjs/common";
import { ChallengeStatus } from "../interfaces/challenge-status.enum";

export class ChallengeStatusValidationPipe implements PipeTransform {
  readonly permissionStatus = [
    ChallengeStatus.ACCEPTED,
    ChallengeStatus.DENIED,
    ChallengeStatus.CANCELLED,
  ];

  transform(value: any) {
    const status = value.status.toUpperCase();

    if (!this.ehStatusValid(status)) {
      throw new BadRequestException(`${status} is invalid status!`);
    }
    return value;
  }

  private ehStatusValid(status: any) {
    const idx = this.permissionStatus.indexOf(status);
    return idx !== -1;
  }
}
