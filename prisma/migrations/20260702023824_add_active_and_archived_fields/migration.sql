-- AlterTable
ALTER TABLE "BlogPost" ADD COLUMN     "archived" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "Project" ADD COLUMN     "active" BOOLEAN NOT NULL DEFAULT true;

-- AlterTable
ALTER TABLE "Skill" ADD COLUMN     "active" BOOLEAN NOT NULL DEFAULT true;
