-- AlterTable
ALTER TABLE "BlogPost" ADD COLUMN     "canonicalUrl" TEXT,
ADD COLUMN     "description" TEXT,
ADD COLUMN     "language" TEXT NOT NULL DEFAULT 'en',
ADD COLUMN     "ogImage" TEXT,
ADD COLUMN     "readingTime" INTEGER,
ADD COLUMN     "seoDescription" TEXT,
ADD COLUMN     "seoKeywords" TEXT,
ADD COLUMN     "seoTitle" TEXT,
ADD COLUMN     "status" TEXT NOT NULL DEFAULT 'DRAFT',
ADD COLUMN     "themeMetadata" TEXT,
ADD COLUMN     "thumbnail" TEXT,
ADD COLUMN     "visibility" TEXT NOT NULL DEFAULT 'PUBLIC';
