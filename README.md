# Remote

I ran out of batteries. So here is a small web remote for an Orange TV decoder.

The frontend is a Vite/React app. The backend is an Express proxy that sends remote-control commands to the decoder API. `DECODER_URL` can be just the decoder IP address; the backend defaults it to port `8080`.

## Run

Create or edit `.env` in the project root:

Find the IP address of your decoder in your admin panel device list.
```env
DECODER_URL=192.168.1.10
```

Start both services:

```bash
docker compose up -d
```

Open the remote at:

```text
http://localhost
```

Backend API:

```text
http://localhost:4000
```

Stop everything:

```bash
docker compose down
```

You can change the ports inside of `docker-compose.yml`.

**IMPORTANT:** If your decoder has been asleep for a while and enters `standby` mode, the API used will not respond.
The only way to turn it on and wake it up from `standby` is to **press the power button at back of the decoder**.

No batteries needed :)
