import mongoose from "mongoose";
import uniqueValidator from "mongoose-unique-validator";

const categorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "category name is required"],
    trim: true,
    minLength: 1,
    maxLength: 20,
  },
});

categorySchema.plugin(uniqueValidator);

//export the model if it exists, create it if it doesn't
export default mongoose.models.Category ||
  mongoose.model("Category", categorySchema);
