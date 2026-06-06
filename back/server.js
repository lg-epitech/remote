import express from "express";
import cors from "cors";
import asyncHandler from "express-async-handler";
import 'dotenv/config'

const app = express();
const PORT = parseInt(process.env.PORT) || 4000;
const DECODER_TIMEOUT_MS = parseInt(process.env.DECODER_TIMEOUT_MS) || 4000;
const DEFAULT_DECODER_PORT = "8080";

const DECODER_URL = normalizeDecoderUrl(process.env.DECODER_URL);
if (!DECODER_URL) {
  console.error("DECODER_URL missing from environment");
  process.exit(1)
}

function normalizeDecoderUrl(value) {
  if (!value) return undefined;

  const trimmed = value.trim().replace(/\/+$/, "");
  if (!trimmed) return undefined;

  const url = new URL(/^https?:\/\//i.test(trimmed) ? trimmed : `http://${trimmed}`);
  if (!url.port) {
    url.port = DEFAULT_DECODER_PORT;
  }

  return url.toString().replace(/\/$/, "");
}

async function fetchDecoderCmd(operation, key, mode = "0") {
  const url = new URL("/remoteControl/cmd", DECODER_URL);
  url.searchParams.set("operation", operation);

  if (key) {
    url.searchParams.set("key", key);
    url.searchParams.set("mode", mode);
  }

  try {
    const response = await fetch(url, {
      signal: AbortSignal.timeout(DECODER_TIMEOUT_MS),
    });
    const text = await response.text();

    let body;
    try {
      body = text ? JSON.parse(text) : {};
    } catch {
      body = { raw: text };
    }

    if (!response.ok) {
      return {
        error: "Decoder request failed",
        statusCode: response.status,
        decoderUrl: url.toString(),
        body,
      };
    }

    return body;
  } catch (error) {
    return {
      error: "Decoder request failed",
      message: error.message,
      decoderUrl: url.toString(),
    };
  }
}

async function fetchDecoderStatus() {
  return fetchDecoderCmd("10");
}

async function fetchPowerCmd() {
  const powerResult = await fetchDecoderCmd("01", "116", "1");
  const statusResult = await fetchDecoderStatus();

  return {
    ...statusResult,
    powerResult,
  };
}

function sendDecoderResponse(res, result) {
  const statusCode = result?.error ? 502 : 200;
  res.status(statusCode).json(result);
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
    sendDecoderResponse(res, await fetchDecoderStatus());
  })
);

app.get(
  "/power",
  asyncHandler(async (req, res) => {
    sendDecoderResponse(res, await fetchPowerCmd());
  })
);

app.get(
  "/cmd/:key",
  asyncHandler(async (req, res) => {
    const { key } = req.params;
    sendDecoderResponse(res, await fetchDecoderCmd("01", key.toString()));
  })
)

app.listen(PORT, () => {
  console.log(`🔊 Listening on http://localhost:${PORT}`);
});
