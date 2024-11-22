const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

// const userSchema = new mongoose.Schema({
//   name: {
//     type: String,
//     required: true,
//   },
//   age: {
//     type: Number,
//   },
//   email: {
//     type: String,
//     unique: true,
//   },
//   mobile: {
//     type: String,
//     required: true,
//   },
//   address: {
//     type: String,
//     required: true,
//   },
//   aadhaarCardNumber: {
//     type: Number,
//     required: true,
//     unique: true,
//     validate: {
//       validator: function (v) {
//         return /^\d{12}$/.test(v); // Require exactly 12 characters
//       },
//       message: 'Product code must be exactly 12 characters long.',
//     },
//   },
//   password: {
//     type: String,
//     required: true,
//     minlength: 4,
//     maxlength: 8,
//   },
//   role: {
//     type: String,
//     enum: ["voter", "admin"],
//     default: "voter",
//   },
//   isVoted: {
//     type: Boolean,
//     default: false,
//   },
// });

// const User = mongoose.model("User", userSchema);
// module.exports = User;

//way to define schemaless data base
// setting the strict value to false
// Define an empty schema with strict set to false
const schemaLessSchema = new mongoose.Schema({}, { strict: false });

// Create the model with the schema-less schema
const User = mongoose.model("users", schemaLessSchema);
module.exports = User;

///eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY3MzIxNGRhNDRjZjA0NDFlOGQ0ZjE3MCIsImlhdCI6MTczMTMzNTM4Nn0.es6A2tCsj9Lou9WdK62SkWCfd5_ttKIEw11jBFzSq3g