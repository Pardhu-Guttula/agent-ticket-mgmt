import { ProfileQuery } from '../queries/ProfileQuery';
import { AgentService } from '../../domain/services/AgentService';
import { ApplicationError, ErrorCode } from '../../domain/common/ApplicationConstants';
import { AgentProfile } from '../../domain/entities/AgentProfile';

export class ProfileHandler {
  constructor(private readonly agentService: AgentService) {}

  async handle(query: ProfileQuery): Promise<AgentProfile> {
    const profile = await this.agentService.getAgentProfile(query.agentId);
    if (!profile) {
      throw new ApplicationError(ErrorCode.AgentNotFound, ApplicationError.ERROR_AGENT_NOT_FOUND);
    }
    return profile;
  }
}
 