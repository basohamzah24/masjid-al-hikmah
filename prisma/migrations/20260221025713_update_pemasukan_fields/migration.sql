/*
  Warnings:

  - You are about to drop the column `jenis` on the `Pemasukan` table. All the data in the column will be lost.
  - You are about to drop the column `nama` on the `Pemasukan` table. All the data in the column will be lost.
  - Added the required column `kategori` to the `Pemasukan` table without a default value. This is not possible if the table is not empty.
  - Added the required column `sumber` to the `Pemasukan` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Pemasukan" DROP COLUMN "jenis",
DROP COLUMN "nama",
ADD COLUMN     "kategori" TEXT NOT NULL,
ADD COLUMN     "sumber" TEXT NOT NULL;
