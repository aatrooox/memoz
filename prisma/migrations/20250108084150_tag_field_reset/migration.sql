/*
  Warnings:

  - You are about to drop the column `memo_id` on the `b_tags` table. All the data in the column will be lost.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_b_memos" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "uid" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "create_ts" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_ts" DATETIME NOT NULL,
    "visible" TEXT NOT NULL DEFAULT 'public',
    "defalt_floded" BOOLEAN NOT NULL DEFAULT false,
    "flod_tip" TEXT,
    "user_id" INTEGER NOT NULL,
    "tags" TEXT NOT NULL DEFAULT '',
    CONSTRAINT "b_memos_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "b_users" ("id") ON DELETE NO ACTION ON UPDATE CASCADE
);
INSERT INTO "new_b_memos" ("content", "create_ts", "defalt_floded", "flod_tip", "id", "uid", "updated_ts", "user_id", "visible") SELECT "content", "create_ts", "defalt_floded", "flod_tip", "id", "uid", "updated_ts", "user_id", "visible" FROM "b_memos";
DROP TABLE "b_memos";
ALTER TABLE "new_b_memos" RENAME TO "b_memos";
CREATE UNIQUE INDEX "b_memos_uid_key" ON "b_memos"("uid");
CREATE TABLE "new_b_tags" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "tag_name" TEXT NOT NULL,
    "create_ts" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_ts" DATETIME NOT NULL,
    "user_id" INTEGER NOT NULL,
    CONSTRAINT "b_tags_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "b_users" ("id") ON DELETE NO ACTION ON UPDATE CASCADE
);
INSERT INTO "new_b_tags" ("create_ts", "id", "tag_name", "updated_ts", "user_id") SELECT "create_ts", "id", "tag_name", "updated_ts", "user_id" FROM "b_tags";
DROP TABLE "b_tags";
ALTER TABLE "new_b_tags" RENAME TO "b_tags";
CREATE UNIQUE INDEX "b_tags_tag_name_key" ON "b_tags"("tag_name");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
