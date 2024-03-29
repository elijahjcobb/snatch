import {
  JsonWebTokenError,
  sign,
  TokenExpiredError,
  verify,
} from "jsonwebtoken";
import { NextApiRequest } from "next";
import { supabase } from "#db";
import { APIError } from "lib/api-error";

export type TokenType = "user" | "project";
export interface TokenData {
  id: string;
  type: TokenType;
}

export interface Token extends TokenData {
  iat: number;
  exp: number;
}

export const TOKEN_AGE_SEC = 60 * 60 * 24 * 30;
const SECRET = process.env.TOKEN_SECRET as string;
if (!SECRET) throw new Error("TOKEN_SECRET is undefined.");

export function tokenSign(id: string, type: TokenType): Promise<string> {
  const token: TokenData = { id, type };
  return new Promise((res, rej) => {
    sign(token, SECRET, { expiresIn: TOKEN_AGE_SEC }, (err, token) => {
      if (err || !token) rej(err);
      else res(token);
    });
  });
}

function tokenVerifyInternal(token: string): Promise<Token> {
  return new Promise((res, rej) => {
    verify(token, SECRET, (err, decoded) => {
      if (err || !decoded) rej(err);
      else res(decoded as Token);
    });
  });
}

async function tokenVerifyString(
  token: string,
  type: TokenType
): Promise<Token> {
  try {
    const verifiedToken = await tokenVerifyInternal(token);
    if (verifiedToken.type !== type)
      throw new APIError(401, "Token invalid type.");
    return verifiedToken;
  } catch (e) {
    if (e instanceof TokenExpiredError) {
      throw new APIError(401, "Authentication expired.");
    } else if (e instanceof JsonWebTokenError) {
      throw new APIError(401, "Authentication invalid.");
    }
    throw e;
  }
}

export async function tokenVerifyRequestForType(
  req: NextApiRequest,
  type: TokenType
): Promise<Token> {
  let token: string | undefined = req.cookies[type];

  if (!token) {
    const authHeader = req.headers.authorization ?? "";
    const arr = authHeader.split(" ");
    token = arr[1];
  }

  if (!token) {
    throw new APIError(
      401,
      `No ${type} token present in cookies as '${type}' or bearer token in authorization header.`
    );
  }

  return tokenVerifyString(token, type);
}

export async function verifyUser(
  req: NextApiRequest,
  config?: {
    allowUnverified?: boolean;
  }
) {
  const { id } = await tokenVerifyRequestForType(req, "user");
  const { data, error } = await supabase.from("user").select().eq("id", id);
  if (error || !data || data.length < 1) {
    console.error(error);
    throw new APIError(401, "Authentication user is invalid.");
  }
  const user = data[0];
  if (config?.allowUnverified) return user;
  if (!user.verified)
    throw new APIError(401, "User has not verified their email address.");
  return user;
}

export async function verifyProject(req: NextApiRequest) {
  const { id } = await tokenVerifyRequestForType(req, "project");
  const { data, error } = await supabase.from("project").select().eq("id", id);
  if (error || !data || data.length < 1) {
    console.error(error);
    throw new APIError(401, "Authentication project is invalid.");
  }
  return data[0];
}
