import { Redis } from "@upstash/redis";

const KEY = "florar:data";

function getRedis() {
  const url = process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN;
  if (!url || !token) return null;
  return new Redis({ url, token });
}

export const DEFAULT_DATA = {
  profile: {
    logoText: "FLORAR",
    logoUrl: "assets/logo.png",
    title: "Florar by Florencia Bidone",
    subtitle:
      "Hola! Bienvenidx a mi taller, donde dicto clases y hago producción personal♡"
  },
  items: [
    {
      type: "link",
      id: "info-clases",
      label: "INFO CLASES",
      url: "https://drive.google.com/file/d/1rq7mqmcuOjgc0pGWNGJiylMeEpI4Iczl/view?usp=drivesdk"
    },
    {
      type: "link",
      id: "reglas-taller",
      label: "REGLAS DEL TALLER",
      url: "https://drive.google.com/file/d/1aErK4HlUtA39ztnTCQuyfHnvYpRzMQyu/view?usp=drivesdk"
    },
    {
      type: "link",
      id: "sobre-mi-trabajo",
      label: "SOBRE MI TRABAJO",
      url: "https://drive.google.com/file/d/1AQewtamx7F3rH2JnYj5PjYuUMDAAvWeO/view?usp=drivesdk"
    },
    { type: "header", id: "header-encuentros", label: "ENCUENTROS TERAPÉUTICOS" },
    {
      type: "link",
      id: "2025-esculpiendo",
      label: "2025. Esculpiendo el ser",
      url: "https://drive.google.com/file/d/1BDmUG6iq5nd3KoJlRSGTznqrUByPqxgY/view?usp=drivesdk"
    },
    {
      type: "link",
      id: "2024-utero",
      label: "2024. Útero contenedor",
      url: "https://drive.google.com/file/d/1gXQcbtXYmdErKORq5MrCQxn7Nv9KH-au/view?usp=drivesdk"
    },
    {
      type: "link",
      id: "2021-cuerpx",
      label: "2021. Cuerpx de arcilla",
      url: "https://www.canva.com/design/DAE7tuE1jcY/M4Rm6inxsoADa1RL8zRcCg/view?website#4"
    },
    { type: "header", id: "header-redes", label: "EN LAS REDES:" },
    {
      type: "link",
      id: "youtube",
      label: "Florar en Youtube",
      url: "https://youtube.com/@florar-tallerdeceramica6364?si=DXP0mqUtzSOlj60f"
    },
    {
      type: "link",
      id: "tiktok",
      label: "Florar en TikTok",
      url: "https://www.tiktok.com/@florartallerceramica?_t=8oh6g2leb78&_r=1"
    },
    {
      type: "link",
      id: "instagram",
      label: "Florar en Instagram",
      url: "https://www.instagram.com/florartallerceramica/"
    },
    {
      type: "link",
      id: "facebook",
      label: "Florar en Facebook",
      url: "https://www.facebook.com/florartesanias/"
    }
  ]
};

export async function getData() {
  const redis = getRedis();
  if (!redis) {
    // Sin Redis configurado todavía (desarrollo local): devolvemos el default.
    return DEFAULT_DATA;
  }
  const data = await redis.get(KEY);
  return data || DEFAULT_DATA;
}

export async function setData(data) {
  const redis = getRedis();
  if (!redis) {
    throw new Error("No hay base de datos configurada (falta conectar Redis en Vercel)");
  }
  await redis.set(KEY, data);
}

export function checkPassword(pw) {
  return Boolean(process.env.ADMIN_PASSWORD) && pw === process.env.ADMIN_PASSWORD;
}
