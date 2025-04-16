import { create } from "ipfs-http-client";
import { infuraApiSecret, infuraProjectId } from "../../../environment";
import { Buffer } from "buffer";

const auth = `Basic ${Buffer.from(
  `${infuraProjectId}:${infuraApiSecret}`
).toString("base64")}`;

export const client = create({
  host: "ipfs.infura.io",
  port: 5001,
  protocol: "https",
  headers: {
    authorization: auth,
  },
});