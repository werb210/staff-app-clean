import { PrismaClient, PipelineStage } from "@prisma/client";

const prisma = new PrismaClient();

/* ---------------------------------------------------------
   STAGE RULES
--------------------------------------------------------- */
export async function moveApplicationToStage(applicationId: string, stage: PipelineStage) {
  return prisma.application.update({
    where: { id: applicationId },
    data: { stage },
  });
}

export async function getApplicationsForSilos(silos: string[]) {
  return prisma.application.findMany({
    where: { silo: { in: silos } },
    include: {
      documents: true,
      contact: true,
      company: true,
    },
    orderBy: { createdAt: "desc" },
  });
}

export async function getApplicationSafe(id: string, silos: string[]) {
  const app = await prisma.application.findUnique({
    where: { id },
    include: {
      documents: true,
      contact: true,
      company: true,
    },
  });

  if (!app) return null;
  if (!silos.includes(app.silo)) return null; // Silo guardrail

  return app;
}
