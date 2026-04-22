/*
  Warnings:

  - You are about to drop the column `strike` on the `report` table. All the data in the column will be lost.
  - You are about to drop the column `strike_num` on the `report` table. All the data in the column will be lost.
  - Added the required column `street` to the `report` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "report" DROP COLUMN "strike",
DROP COLUMN "strike_num",
ADD COLUMN     "street" VARCHAR(50) NOT NULL,
ADD COLUMN     "street_number" INTEGER NOT NULL DEFAULT 0;
