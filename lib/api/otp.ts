import { totp } from "otplib";
import { KrHash } from "@element-ts/krypton";

totp.options = {
  step: 60 * 10, // 10 minutes
};

const OTP_SECRET = process.env.OTP_SECRET ?? "";
if (!OTP_SECRET || OTP_SECRET.length === 0)
  throw new Error("No OTP_SECRET in env.");

function secret(key: string): string {
  const keySecret = key + OTP_SECRET;
  const buff = KrHash.hash(Buffer.from(keySecret));
  return buff.toString("hex");
}

export function otpGenerate(key: string): string {
  return totp.generate(secret(key));
}

export function otpVerify({
  code,
  key,
}: {
  key: string;
  code: string;
}): boolean {
  return totp.check(code, secret(key));
}
