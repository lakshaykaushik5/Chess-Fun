/*
  Warnings:

  - You are about to drop the column `token` on the `MasterUser` table. All the data in the column will be lost.
  - You are about to drop the column `tokenVersion` on the `MasterUser` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "MasterUser" DROP COLUMN "token",
DROP COLUMN "tokenVersion",
ADD COLUMN     "isVerified" BOOLEAN NOT NULL DEFAULT false;
