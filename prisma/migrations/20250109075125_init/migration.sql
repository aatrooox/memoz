-- CreateTable
CREATE TABLE "b_users" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "uid" TEXT NOT NULL,
    "email" TEXT,
    "username" TEXT NOT NULL,
    "nickname" TEXT,
    "password" TEXT NOT NULL,
    "avatar_url" TEXT,
    "role" TEXT NOT NULL DEFAULT 'user'
);

-- CreateTable
CREATE TABLE "b_memo" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "uid" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "create_ts" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_ts" DATETIME NOT NULL,
    "visible" TEXT NOT NULL DEFAULT 'public',
    "defalt_floded" BOOLEAN NOT NULL DEFAULT false,
    "flod_tip" TEXT,
    "user_id" INTEGER NOT NULL,
    CONSTRAINT "b_memo_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "b_users" ("id") ON DELETE NO ACTION ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "b_comments" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "uid" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "create_ts" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_ts" DATETIME NOT NULL,
    "type" TEXT NOT NULL DEFAULT 'article',
    "memo_id" INTEGER,
    "user_id" INTEGER NOT NULL,
    CONSTRAINT "b_comments_memo_id_fkey" FOREIGN KEY ("memo_id") REFERENCES "b_memo" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "b_comments_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "b_users" ("id") ON DELETE NO ACTION ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "b_tag" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "tag_name" TEXT NOT NULL,
    "create_ts" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_ts" DATETIME NOT NULL,
    "user_id" INTEGER NOT NULL,
    CONSTRAINT "b_tag_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "b_users" ("id") ON DELETE NO ACTION ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "memo_tag_relations" (
    "tagId" INTEGER NOT NULL,
    "memoId" INTEGER NOT NULL,
    "create_ts" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_ts" DATETIME NOT NULL,

    PRIMARY KEY ("tagId", "memoId"),
    CONSTRAINT "memo_tag_relations_tagId_fkey" FOREIGN KEY ("tagId") REFERENCES "b_tag" ("id") ON DELETE NO ACTION ON UPDATE CASCADE,
    CONSTRAINT "memo_tag_relations_memoId_fkey" FOREIGN KEY ("memoId") REFERENCES "b_memo" ("id") ON DELETE NO ACTION ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "b_sub_comments" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "uid" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "create_ts" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_ts" DATETIME NOT NULL,
    "comment_id" INTEGER NOT NULL,
    "reply_sub_comment_id" INTEGER,
    "user_id" INTEGER NOT NULL,
    "memo_id" INTEGER,
    CONSTRAINT "b_sub_comments_comment_id_fkey" FOREIGN KEY ("comment_id") REFERENCES "b_comments" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "b_sub_comments_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "b_users" ("id") ON DELETE NO ACTION ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "b_likes" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "create_ts" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_ts" DATETIME NOT NULL,
    "target" TEXT NOT NULL DEFAULT 'article',
    "memo_id" INTEGER,
    "sub_comment_id" INTEGER,
    "comment_id" INTEGER,
    "user_id" INTEGER NOT NULL,
    CONSTRAINT "b_likes_memo_id_fkey" FOREIGN KEY ("memo_id") REFERENCES "b_memo" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "b_likes_sub_comment_id_fkey" FOREIGN KEY ("sub_comment_id") REFERENCES "b_sub_comments" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "b_likes_comment_id_fkey" FOREIGN KEY ("comment_id") REFERENCES "b_comments" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "b_likes_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "b_users" ("id") ON DELETE NO ACTION ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "b_users_uid_key" ON "b_users"("uid");

-- CreateIndex
CREATE UNIQUE INDEX "b_users_username_key" ON "b_users"("username");

-- CreateIndex
CREATE UNIQUE INDEX "b_memo_uid_key" ON "b_memo"("uid");

-- CreateIndex
CREATE UNIQUE INDEX "b_comments_uid_key" ON "b_comments"("uid");

-- CreateIndex
CREATE UNIQUE INDEX "b_tag_tag_name_key" ON "b_tag"("tag_name");

-- CreateIndex
CREATE UNIQUE INDEX "b_sub_comments_uid_key" ON "b_sub_comments"("uid");
