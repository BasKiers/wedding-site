-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_RSVPPerson" (
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
    "dinnerKind" BOOLEAN DEFAULT false,
    "dinnerStarter" TEXT,
    "dinnerMain" TEXT,
    "dinnerDesert" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "RSVPPerson_submissionId_fkey" FOREIGN KEY ("submissionId") REFERENCES "RSVPSubmission" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_RSVPPerson" ("createdAt", "dietAlt", "dietAltText", "dietFish", "dietMeat", "dinnerDesert", "dinnerKind", "dinnerMain", "dinnerStarter", "id", "name", "remark", "rsvpCeremony", "rsvpDinner", "rsvpParty", "rsvpReception", "submissionId", "updatedAt") SELECT "createdAt", "dietAlt", "dietAltText", "dietFish", "dietMeat", "dinnerDesert", "dinnerKind", "dinnerMain", "dinnerStarter", "id", "name", "remark", "rsvpCeremony", "rsvpDinner", "rsvpParty", "rsvpReception", "submissionId", "updatedAt" FROM "RSVPPerson";
DROP TABLE "RSVPPerson";
ALTER TABLE "new_RSVPPerson" RENAME TO "RSVPPerson";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
