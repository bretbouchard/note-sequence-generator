-- CreateTable
CREATE TABLE "ChordType" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "symbol" TEXT NOT NULL,
    "intervals" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "ChordProgression" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "isPreset" BOOLEAN NOT NULL DEFAULT false,
    "category" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "ChordInProgression" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "progressionId" TEXT NOT NULL,
    "degree" TEXT NOT NULL,
    "scaleDegree" TEXT NOT NULL,
    "chordType" TEXT NOT NULL DEFAULT 'maj7',
    "duration" REAL NOT NULL DEFAULT 4.0,
    "position" REAL NOT NULL DEFAULT 0.0,
    "order" INTEGER NOT NULL,
    "chordNotesDegree" TEXT NOT NULL DEFAULT '1,3,5,7',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY ("progressionId") REFERENCES "ChordProgression"("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "NoteTemplate" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "scaleDegrees" TEXT NOT NULL DEFAULT '1,2,3,4,5',
    "weights" TEXT NOT NULL DEFAULT '1,1,1,1,1',
    "repetition" TEXT NOT NULL DEFAULT '{"startBar":0,"duration":4}',
    "direction" TEXT NOT NULL DEFAULT 'forward',
    "behavior" TEXT NOT NULL DEFAULT 'continuous',
    "useChordTones" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "RhythmTemplate" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "durations" TEXT NOT NULL DEFAULT '1,1,1,1',
    "templateDuration" REAL NOT NULL DEFAULT 4.0,
    "repetition" TEXT NOT NULL DEFAULT '{"startBar":0,"duration":4}',
    "direction" TEXT NOT NULL DEFAULT 'forward',
    "behavior" TEXT NOT NULL DEFAULT 'continuous',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateIndex
CREATE INDEX "ChordInProgression_progressionId_idx" ON "ChordInProgression"("progressionId");

-- Insert default chord types
INSERT INTO "ChordType" ("id", "name", "symbol", "intervals") VALUES
('1', 'Major 7th', 'maj7', '0,4,7,11'),
('2', 'Dominant 7th', '7', '0,4,7,10'),
('3', 'Minor 7th', 'm7', '0,3,7,10'),
('4', 'Half Diminished', 'ø7', '0,3,6,10');