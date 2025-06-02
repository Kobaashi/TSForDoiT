/*
  Warnings:

  - You are about to drop the column `name` on the `User` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "LanguageType" AS ENUM ('native', 'target');

-- CreateEnum
CREATE TYPE "MatchStatus" AS ENUM ('pending', 'accepted', 'declined');

-- DropIndex
DROP INDEX "User_id_key";

-- AlterTable
ALTER TABLE "User" DROP COLUMN "name";

-- CreateTable
CREATE TABLE "Language" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "Language_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserLanguage" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "language_id" INTEGER NOT NULL,
    "type" "LanguageType" NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "UserLanguage_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MatchRequest" (
    "id" SERIAL NOT NULL,
    "from_user_id" INTEGER NOT NULL,
    "to_user_id" INTEGER NOT NULL,
    "status" "MatchStatus" NOT NULL DEFAULT 'pending',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "MatchRequest_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Language_name_key" ON "Language"("name");

-- CreateIndex
CREATE UNIQUE INDEX "UserLanguage_user_id_language_id_type_key" ON "UserLanguage"("user_id", "language_id", "type");

-- CreateIndex
CREATE UNIQUE INDEX "MatchRequest_from_user_id_to_user_id_key" ON "MatchRequest"("from_user_id", "to_user_id");

-- AddForeignKey
ALTER TABLE "UserLanguage" ADD CONSTRAINT "UserLanguage_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserLanguage" ADD CONSTRAINT "UserLanguage_language_id_fkey" FOREIGN KEY ("language_id") REFERENCES "Language"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MatchRequest" ADD CONSTRAINT "MatchRequest_from_user_id_fkey" FOREIGN KEY ("from_user_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MatchRequest" ADD CONSTRAINT "MatchRequest_to_user_id_fkey" FOREIGN KEY ("to_user_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
