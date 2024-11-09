/*
  Warnings:

  - Added the required column `chordType` to the `ChordInProgression` table without a default value. This is not possible if the table is not empty.
  - Added the required column `duration` to the `ChordInProgression` table without a default value. This is not possible if the table is not empty.
  - Added the required column `position` to the `ChordInProgression` table without a default value. This is not possible if the table is not empty.

*/
-- CreateTable
CREATE TABLE "ChordType" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "symbol" TEXT NOT NULL,
    "intervals" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "NoteTemplate" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "scaleDegrees" TEXT NOT NULL,
    "weights" TEXT NOT NULL,
    "repetition" TEXT NOT NULL,
    "direction" TEXT NOT NULL DEFAULT 'forward',
    "behavior" TEXT NOT NULL DEFAULT 'continuous',
    "useChordTones" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "RhythmTemplate" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "durations" TEXT NOT NULL,
    "templateDuration" REAL NOT NULL,
    "repetition" TEXT NOT NULL,
    "direction" TEXT NOT NULL DEFAULT 'forward',
    "behavior" TEXT NOT NULL DEFAULT 'continuous',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_ChordInProgression" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "progressionId" TEXT NOT NULL,
    "degree" TEXT NOT NULL,
    "scaleDegree" TEXT NOT NULL,
    "chordType" TEXT NOT NULL,
    "duration" REAL NOT NULL,
    "position" REAL NOT NULL,
    "order" INTEGER NOT NULL,
    "chordNotesDegree" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "ChordInProgression_progressionId_fkey" FOREIGN KEY ("progressionId") REFERENCES "ChordProgression" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_ChordInProgression" ("chordNotesDegree", "createdAt", "degree", "id", "order", "progressionId", "scaleDegree", "updatedAt") SELECT "chordNotesDegree", "createdAt", "degree", "id", "order", "progressionId", "scaleDegree", "updatedAt" FROM "ChordInProgression";
DROP TABLE "ChordInProgression";
ALTER TABLE "new_ChordInProgression" RENAME TO "ChordInProgression";
CREATE INDEX "ChordInProgression_progressionId_idx" ON "ChordInProgression"("progressionId");
CREATE TABLE "new_ChordProgression" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "isPreset" BOOLEAN NOT NULL DEFAULT false,
    "category" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_ChordProgression" ("createdAt", "id", "name", "updatedAt") SELECT "createdAt", "id", "name", "updatedAt" FROM "ChordProgression";
DROP TABLE "ChordProgression";
ALTER TABLE "new_ChordProgression" RENAME TO "ChordProgression";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
