/**
 * One-time migration: converts the Product `likes` array from its old shape
 * (a plain array of User ObjectIds) to the new shape introduced alongside
 * the "liked at" timestamp feature: `[{ user: ObjectId, likedAt: Date }]`.
 *
 * Why this is needed:
 * `models/product.js` used to define `likes: [{ type: ObjectId, ref: "User" }]`.
 * It now defines `likes: [likeSchema]` where `likeSchema` has `user` and
 * `likedAt` fields. Existing documents in the database still have the old
 * plain-ObjectId entries, so populating `likes.user` on them resolves to
 * `undefined` (the raw entry has no `user` property) - that's why the admin
 * "Wishlisted Products" page stopped showing names/emails for likes that
 * existed before this migration.
 *
 * This script talks to the raw MongoDB collection (not the Mongoose model)
 * to avoid the current schema casting old data incorrectly on read, so it
 * can inspect exactly what's stored and fix only the old-format entries.
 * Already-migrated entries (objects with a `user` field) are left as-is, so
 * this script is safe to re-run.
 *
 * Usage: node scripts/migrateProductLikes.js
 */
const mongoose = require("mongoose");
const config = require("../config.js");

async function migrate() {
  await mongoose.connect(config.DB_URI);
  const db = mongoose.connection.db;
  const products = db.collection("products");

  const cursor = products.find({ likes: { $exists: true, $ne: [] } });

  let productsUpdated = 0;
  let entriesMigrated = 0;

  while (await cursor.hasNext()) {
    const product = await cursor.next();
    const likes = Array.isArray(product.likes) ? product.likes : [];

    let changed = false;
    const migratedLikes = likes.map((like) => {
      // Already in the new shape - leave untouched.
      if (like && typeof like === "object" && like.user) {
        return like;
      }

      // Old shape: `like` is itself the User ObjectId (or a string id).
      changed = true;
      entriesMigrated += 1;
      return {
        user: like,
        likedAt: product.updatedAt || product.createdAt || new Date(),
      };
    });

    if (changed) {
      await products.updateOne(
        { _id: product._id },
        { $set: { likes: migratedLikes } },
      );
      productsUpdated += 1;
    }
  }

  console.log(
    `Migration complete. Products updated: ${productsUpdated}. Like entries migrated: ${entriesMigrated}.`,
  );

  await mongoose.disconnect();
}

migrate().catch((err) => {
  console.error("Migration failed:", err);
  process.exit(1);
});
