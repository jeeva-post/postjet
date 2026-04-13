import mongoose, { Schema, model, models } from "mongoose";

const UserSchema = new Schema({
  email: { type: String, unique: true, required: true },
  name: { type: String },
  image: { type: String },
}, { timestamps: true });

// ఒకవేళ మోడల్ ఆల్రెడీ ఉంటే దాన్నే వాడు లేకపోతే కొత్తది క్రియేట్ చెయ్యి అని అర్థం
const User = models.User || model("User", UserSchema);

export default User;