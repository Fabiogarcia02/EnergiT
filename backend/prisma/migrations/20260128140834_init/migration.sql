-- CreateTable
CREATE TABLE "users" (
    "id" SERIAL NOT NULL,
    "nome" VARCHAR(255) NOT NULL,
    "email" VARCHAR(255) NOT NULL,
    "senha_hash" VARCHAR(255) NOT NULL,
    "created_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");
