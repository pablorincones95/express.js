/*
  Warnings:

  - You are about to drop the column `datte` on the `Appointment` table. All the data in the column will be lost.
  - Added the required column `date` to the `Appointment` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Appointment" DROP COLUMN "datte",
ADD COLUMN     "date" TIMESTAMP(3) NOT NULL;
