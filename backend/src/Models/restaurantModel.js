import mongoose from "mongoose";

const restaurantSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    about: {
      type: String,
      default: "",
    },

    ownerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    restaurantLogo: {
      type: String,
      default: "",
    },

    restaurantBanner: {
      type: String,
      default: "",
    },

    address: {
      type: String,
      required: true,
    },

    phoneNumber: {
      type: String,
      required: true,
    },
    averageRating: { type: Number, default: 0, min: 0, max: 5 },
    totalReviews: { type: Number, default: 0, min: 0 },

    paymentMethods: {
      type: [String],
      default: ["Cash on Delivery"],
      enum: ["Cash on Delivery", "eSewa", "Khalti"],
    },

    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true },
);

restaurantSchema.pre("findOneAndDelete", async function () {
  const restaurant = await this.model.findOne(this.getQuery());
  if (restaurant) {
    await mongoose
      .model("MenuItem")
      .deleteMany({ restaurantId: restaurant._id });
  }
});
const Restaurant = mongoose.model("Restaurant", restaurantSchema);

export default Restaurant;
