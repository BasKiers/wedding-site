-- CreateTable
CREATE TABLE "RSVPPerson" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "submissionId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "dietAlt" BOOLEAN NOT NULL,
    "rsvpCeremony" BOOLEAN NOT NULL,
    "rsvpReception" BOOLEAN NOT NULL,
    "rsvpDinner" BOOLEAN NOT NULL,
    "rsvpParty" BOOLEAN NOT NULL,
    "dietMeat" BOOLEAN NOT NULL,
    "dietFish" BOOLEAN NOT NULL,
    "remark" TEXT NOT NULL,
    "dietAltText" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "RSVPPerson_submissionId_fkey" FOREIGN KEY ("submissionId") REFERENCES "RSVPSubmission" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "RSVPSubmission" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "email" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
