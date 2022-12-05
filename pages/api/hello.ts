// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import { supabase } from "../../db";

type Data = {
  name: string;
};

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  supabase.from("user").insert({
    name: "",
    email: "",
    password: "",
  });

  supabase.from("form").insert({
    name: "",
    user_id: "efw",
    domains: ["few"],
  });

  supabase.from("entry").insert({
    form_id: "efw",
    email: "wef",
    fields: {},
  });

  res.status(200).json({ name: "John Doe" });
}
