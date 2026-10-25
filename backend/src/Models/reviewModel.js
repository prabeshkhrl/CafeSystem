import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema(
  {
    orderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Order",
      required: true,
      unique: true, // ⛔ one review per order
    },

    customerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    restaurantId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Restaurant",
      required: true,
      index: true,
    },

    menuItemIds: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "MenuItem",
      },
    ],

    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },

    // optional sub-ratings (all 1–5)
    foodRating: { type: Number, min: 1, max: 5, default: null },
    deliveryRating: { type: Number, min: 1, max: 5, default: null },
    serviceRating: { type: Number, min: 1, max: 5, default: null },

    comment: {
      type: String,
      default: "",
      maxlength: 1000,
      trim: true,
    },

    images: {
      type: [String],
      default: [],
    },

    isEdited: { type: Boolean, default: false },
    editedAt: { type: Date, default: null },

    // owner or scoped-admin reply
    ownerReply: {
      text: { type: String, default: "" },
      repliedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        default: null,
      },
      repliedAt: { type: Date, default: null },
    },

    // admin moderation
    isHidden: { type: Boolean, default: false, index: true },
    hiddenReason: { type: String, default: "" },
  },
  { timestamps: true }
);

// ---------- Indexes ----------
reviewSchema.index({ restaurantId: 1, createdAt: -1 });
reviewSchema.index({ restaurantId: 1, rating: -1 });
reviewSchema.index({ customerId: 1, createdAt: -1 });

// ---------- After-save: recompute restaurant aggregates ----------
reviewSchema.post("save", async function () {
  await recomputeRestaurantRating(this.restaurantId);
});

reviewSchema.post("findOneAndUpdate", async function (doc) {
  if (doc) await recomputeRestaurantRating(doc.restaurantId);
});

reviewSchema.post("findOneAndDelete", async function (doc) {
  if (doc) await recomputeRestaurantRating(doc.restaurantId);
});

async function recomputeRestaurantRating(restaurantId) {
  if (!restaurantId) return;
  const Review = mongoose.model("Review");
  const Restaurant = mongoose.model("Restaurant");

  const agg = await Review.aggregate([
    { $match: { restaurantId, isHidden: false } },
    {
      $group: {
        _id: "$restaurantId",
        avgRating: { $avg: "$rating" },
        totalReviews: { $sum: 1 },
      },
    },
  ]);

  const result = agg[0] || { avgRating: 0, totalReviews: 0 };

  await Restaurant.findByIdAndUpdate(restaurantId, {
    averageRating: Math.round(result.avgRating * 10) / 10, // 1 decimal
    totalReviews: result.totalReviews,
  });
}

const Review = mongoose.model("Review", reviewSchema);
export default Review;