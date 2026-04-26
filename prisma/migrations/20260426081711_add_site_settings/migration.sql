-- CreateTable
CREATE TABLE "site_settings" (
    "id" TEXT NOT NULL DEFAULT 'singleton',
    "background_dark" TEXT NOT NULL DEFAULT '#050510',
    "background_light" TEXT NOT NULL DEFAULT '#f4f1ff',
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "site_settings_pkey" PRIMARY KEY ("id")
);
