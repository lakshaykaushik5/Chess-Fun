-- CreateEnum
CREATE TYPE "GameStatus" AS ENUM ('IN_PROGRESS', 'BLACK_WIN', 'WHITE_WIN', 'DRAW');

-- CreateTable
CREATE TABLE "MasterUser" (
    "id" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "status" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "isVerified" BOOLEAN NOT NULL DEFAULT false,
    "verifyCode" TEXT,
    "verifyCodeExpiresAt" TIMESTAMP(3),

    CONSTRAINT "MasterUser_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MasterGames" (
    "id" TEXT NOT NULL,
    "whitePlayerId" TEXT NOT NULL,
    "blackPlayerId" TEXT NOT NULL,
    "gameStatus" "GameStatus" NOT NULL DEFAULT 'IN_PROGRESS',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "MasterGames_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MasterMoves" (
    "id" TEXT NOT NULL,
    "gameId" TEXT NOT NULL,
    "moveNumber" INTEGER NOT NULL,
    "fenString" TEXT NOT NULL,
    "moveNotation" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "MasterMoves_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "MasterUser_username_key" ON "MasterUser"("username");

-- CreateIndex
CREATE UNIQUE INDEX "MasterUser_email_key" ON "MasterUser"("email");

-- CreateIndex
CREATE INDEX "MasterGames_whitePlayerId_idx" ON "MasterGames"("whitePlayerId");

-- CreateIndex
CREATE INDEX "MasterGames_blackPlayerId_idx" ON "MasterGames"("blackPlayerId");

-- CreateIndex
CREATE INDEX "MasterMoves_gameId_moveNumber_idx" ON "MasterMoves"("gameId", "moveNumber");

-- CreateIndex
CREATE UNIQUE INDEX "MasterMoves_gameId_moveNumber_key" ON "MasterMoves"("gameId", "moveNumber");

-- AddForeignKey
ALTER TABLE "MasterGames" ADD CONSTRAINT "MasterGames_whitePlayerId_fkey" FOREIGN KEY ("whitePlayerId") REFERENCES "MasterUser"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MasterGames" ADD CONSTRAINT "MasterGames_blackPlayerId_fkey" FOREIGN KEY ("blackPlayerId") REFERENCES "MasterUser"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MasterMoves" ADD CONSTRAINT "MasterMoves_gameId_fkey" FOREIGN KEY ("gameId") REFERENCES "MasterGames"("id") ON DELETE CASCADE ON UPDATE CASCADE;
