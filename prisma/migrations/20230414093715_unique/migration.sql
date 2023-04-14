/*
  Warnings:

  - A unique constraint covering the columns `[name]` on the table `Quiz` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Quiz_name_key" ON "Quiz"("name");
