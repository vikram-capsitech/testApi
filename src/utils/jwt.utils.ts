import jwt from "jsonwebtoken";

export function signJwt(
  key: string
) {
  return jwt.sign({ id: key }, process.env.JWT_SECRET ?? '', {
    expiresIn: "30d",
  });
}
