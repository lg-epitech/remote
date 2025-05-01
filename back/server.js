import express from "express";
import cors from "cors";
import asyncHandler from "express-async-handler";
import 'dotenv/config'

const app = express();
const PORT = parseInt(process.env.PORT) || 4000;

const DECODER_URL = process.env.DECODER_URL;
if (!DECODER_URL) {
  console.error("DECODER_URL missing from environment");
  process.exit(1)
}

function fetchDecoderCmd(operation, key) {
  let url = ""
  if (!key) {
    url = `${DECODER_URL}/remoteControl/cmd?operation=${operation}`
  } else {
    url = `${DECODER_URL}/remoteControl/cmd?operation=${operation}&key=${key}&mode=0`
  }

  try {
    return fetch(url).then(res => res.json());
  } catch {
    return { error: `Request failed, ${operation}, ${key}` };
  }
}

app.use(express.json());

app.use(
  cors({
    origin: "*",
  })
);

app.get(
  "/status",
  asyncHandler(async (req, res) => {
    res.json(await fetchDecoderCmd("10"));
  })
);

app.get(
  "/power",
  asyncHandler(async (req, res) => {
    res.json(await fetchDecoderCmd("01", "116"));
  })
);

app.get(
  "/cmd/:key",
  asyncHandler(async (req, res) => {
    const { key } = req.params;
    res.json(await fetchDecoderCmd("1", key.toString() ));
  })
)

app.listen(PORT, () => {
  console.log(`🔊 Listening on http://localhost:${PORT}`);
});
