/*
  Warnings:

  - The primary key for the `Language` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `Language` table. All the data in the column will be lost.
  - The primary key for the `MatchRequest` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `MatchRequest` table. All the data in the column will be lost.
  - The primary key for the `User` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `User` table. All the data in the column will be lost.
  - The primary key for the `UserLanguage` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `UserLanguage` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "MatchRequest" DROP CONSTRAINT "MatchRequest_from_user_id_fkey";

-- DropForeignKey
ALTER TABLE "MatchRequest" DROP CONSTRAINT "MatchRequest_to_user_id_fkey";

-- DropForeignKey
ALTER TABLE "UserLanguage" DROP CONSTRAINT "UserLanguage_language_id_fkey";

-- DropForeignKey
ALTER TABLE "UserLanguage" DROP CONSTRAINT "UserLanguage_user_id_fkey";

-- AlterTable
ALTER TABLE "Language" DROP CONSTRAINT "Language_pkey",
DROP COLUMN "id",
ADD COLUMN     "language_id" SERIAL NOT NULL,
ADD CONSTRAINT "Language_pkey" PRIMARY KEY ("language_id");

-- AlterTable
ALTER TABLE "MatchRequest" DROP CONSTRAINT "MatchRequest_pkey",
DROP COLUMN "id",
ADD COLUMN     "matchrequest_id" SERIAL NOT NULL,
ADD CONSTRAINT "MatchRequest_pkey" PRIMARY KEY ("matchrequest_id");

-- AlterTable
ALTER TABLE "User" DROP CONSTRAINT "User_pkey",
DROP COLUMN "id",
ADD COLUMN     "user_id" SERIAL NOT NULL,
ADD CONSTRAINT "User_pkey" PRIMARY KEY ("user_id");

-- AlterTable
ALTER TABLE "UserLanguage" DROP CONSTRAINT "UserLanguage_pkey",
DROP COLUMN "id",
ADD COLUMN     "userlanguage_id" SERIAL NOT NULL,
ADD CONSTRAINT "UserLanguage_pkey" PRIMARY KEY ("userlanguage_id");

-- AddForeignKey
ALTER TABLE "UserLanguage" ADD CONSTRAINT "UserLanguage_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserLanguage" ADD CONSTRAINT "UserLanguage_language_id_fkey" FOREIGN KEY ("language_id") REFERENCES "Language"("language_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MatchRequest" ADD CONSTRAINT "MatchRequest_from_user_id_fkey" FOREIGN KEY ("from_user_id") REFERENCES "User"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MatchRequest" ADD CONSTRAINT "MatchRequest_to_user_id_fkey" FOREIGN KEY ("to_user_id") REFERENCES "User"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;
