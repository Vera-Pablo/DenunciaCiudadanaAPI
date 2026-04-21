-- CreateTable
CREATE TABLE "role" (
    "id_role" SERIAL NOT NULL,
    "type_role" VARCHAR(30) NOT NULL,

    CONSTRAINT "role_pkey" PRIMARY KEY ("id_role")
);

-- CreateTable
CREATE TABLE "status" (
    "id_status" SERIAL NOT NULL,
    "type_status" VARCHAR(20) NOT NULL,

    CONSTRAINT "status_pkey" PRIMARY KEY ("id_status")
);

-- CreateTable
CREATE TABLE "user" (
    "id_user" SERIAL NOT NULL,
    "dni" INTEGER NOT NULL,
    "name" VARCHAR(50) NOT NULL,
    "email" VARCHAR(100) NOT NULL,
    "password" VARCHAR(100) NOT NULL,
    "telefono" VARCHAR(15) NOT NULL,
    "is_active" BOOLEAN NOT NULL,
    "id_role" INTEGER NOT NULL,

    CONSTRAINT "user_pkey" PRIMARY KEY ("id_user")
);

-- CreateTable
CREATE TABLE "type" (
    "id_type" SERIAL NOT NULL,
    "type" VARCHAR(20) NOT NULL,

    CONSTRAINT "type_pkey" PRIMARY KEY ("id_type")
);

-- CreateTable
CREATE TABLE "report" (
    "id_report" SERIAL NOT NULL,
    "tracking_num" VARCHAR(10) NOT NULL,
    "description" TEXT NOT NULL,
    "strike" VARCHAR(50) NOT NULL,
    "strike_num" INTEGER NOT NULL DEFAULT 0,
    "img_url" VARCHAR(250) NOT NULL,
    "date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "id_type" INTEGER NOT NULL,
    "id_status" INTEGER NOT NULL,
    "id_user" INTEGER NOT NULL,

    CONSTRAINT "report_pkey" PRIMARY KEY ("id_report")
);

-- CreateTable
CREATE TABLE "comment" (
    "id_comment" SERIAL NOT NULL,
    "text" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "id_report" INTEGER NOT NULL,
    "id_user" INTEGER NOT NULL,

    CONSTRAINT "comment_pkey" PRIMARY KEY ("id_comment")
);

-- CreateIndex
CREATE UNIQUE INDEX "role_type_role_key" ON "role"("type_role");

-- CreateIndex
CREATE UNIQUE INDEX "status_type_status_key" ON "status"("type_status");

-- CreateIndex
CREATE UNIQUE INDEX "user_dni_key" ON "user"("dni");

-- CreateIndex
CREATE UNIQUE INDEX "user_email_key" ON "user"("email");

-- CreateIndex
CREATE UNIQUE INDEX "type_type_key" ON "type"("type");

-- CreateIndex
CREATE UNIQUE INDEX "report_tracking_num_key" ON "report"("tracking_num");

-- AddForeignKey
ALTER TABLE "user" ADD CONSTRAINT "user_id_role_fkey" FOREIGN KEY ("id_role") REFERENCES "role"("id_role") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "report" ADD CONSTRAINT "report_id_type_fkey" FOREIGN KEY ("id_type") REFERENCES "type"("id_type") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "report" ADD CONSTRAINT "report_id_status_fkey" FOREIGN KEY ("id_status") REFERENCES "status"("id_status") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "report" ADD CONSTRAINT "report_id_user_fkey" FOREIGN KEY ("id_user") REFERENCES "user"("id_user") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "comment" ADD CONSTRAINT "comment_id_report_fkey" FOREIGN KEY ("id_report") REFERENCES "report"("id_report") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "comment" ADD CONSTRAINT "comment_id_user_fkey" FOREIGN KEY ("id_user") REFERENCES "user"("id_user") ON DELETE RESTRICT ON UPDATE CASCADE;
