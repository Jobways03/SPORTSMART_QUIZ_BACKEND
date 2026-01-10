import { User } from "../models/User.js";

export async function loginOrCreateUser({ name, phone }) {
  let user = await User.findOne({ phone });

  if (!user) {
    user = await User.create({
      name: name.trim(),
      phone,
    });
  }

  return user;
}
