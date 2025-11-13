import { createApplicationService } from "../services/applicationService.js";
import { createAiService } from "../services/aiService.js";
import { createDocumentService } from "../services/documentService.js";
import { createLenderService } from "../services/lenderService.js";
import { createPipelineService } from "../services/pipelineService.js";
import { createEmailService } from "../services/emailService.js"; // ✅ fixed
import { createTwilioService } from "../services/twilioService.js";
import { createMarketingService } from "../services/marketingService.js";
import { createBackupService } from "../services/backupService.js";
import { createRetryQueueService } from "../services/retryQueueService.js";
import { createOcrService } from "../services/ocrService.js";
import { createTaskService } from "../services/taskService.js";
import { createUserService } from "../services/userService.js";
import { PasskeyAuthService } from "../auth/passkeyAuthService.js";
import { PlaceholderAuthService } from "../auth/placeholderAuthService.js";
import { createContactsService } from "../services/contactsService.js";
import type { SiloContext, SiloKey } from "./types.js";

export const resolveSilo = (silo: SiloKey): SiloContext => {
  switch (silo) {
    case "BF": return createBFContext();
    case "SLF": return createSLFContext();
    case "BI": return createBIContext();
  }
};
