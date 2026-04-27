-- AlterTable
ALTER TABLE "experiences" ADD COLUMN     "description_en" TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN     "role_en" TEXT DEFAULT '';

-- AlterTable
ALTER TABLE "projects" ADD COLUMN     "description_en" TEXT,
ADD COLUMN     "long_description_en" TEXT,
ADD COLUMN     "name_en" TEXT;
