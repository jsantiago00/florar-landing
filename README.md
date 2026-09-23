# Florar — landing + panel de edición

Este repo tiene dos partes:

- **Raíz** (`index.html`, `styles.css`, `script.js`, `data.json`, `config.js`): la landing pública. Se sube a **GitHub Pages**.
- **`admin-app/`**: una app separada (Next.js) que expone `/admin` para editar los links y `/api/links` para servirlos. Se sube a **Vercel**, como proyecto aparte del repo del taller que ya está en Vercel.

La landing, al cargar, pide los links a la API de Vercel. Si esa API todavía no existe o falla, usa automáticamente `data.json` como respaldo, así que la página nunca queda rota.

## 1. Publicar la landing en GitHub Pages

1. Creá un repo en GitHub y subí todo el contenido de esta carpeta (podés dejar `admin-app/` adentro, no molesta).
2. En GitHub: Settings → Pages → Source: rama `main`, carpeta `/ (root)`.
3. Listo, va a quedar en `https://<usuario>.github.io/<repo>/`. Podés después conectar un dominio propio (florar.com.ar, por ejemplo) desde el mismo panel de Pages.

## 2. Publicar el panel de admin en Vercel

1. En [vercel.com](https://vercel.com), "Add New Project", importá el mismo repo de GitHub.
2. Cuando pida la configuración: **Root Directory** → elegí `admin-app` (importante, si no va a intentar deployar todo el repo).
3. En **Environment Variables** agregá:
   - `ADMIN_PASSWORD` = la contraseña que va a usar la dueña para entrar a `/admin` (elegí una fuerte).
4. Andá a la pestaña **Storage** del proyecto en Vercel → **Marketplace** → agregá una base **Redis** (integración de Upstash, es gratis en el plan hobby). Al conectarla, Vercel agrega solas las variables `KV_REST_API_URL` y `KV_REST_API_TOKEN` — no hay que tocarlas a mano.
5. Deployá. Vas a tener una URL tipo `https://florar-admin.vercel.app`.

### Conectar la landing con el admin

Editá [`config.js`](config.js) en la raíz del repo y poné la URL de Vercel:

```js
window.FLORAR_CONFIG = {
  ADMIN_API_URL: "https://florar-admin.vercel.app"
};
```

Subí ese cambio a GitHub. A partir de ahí, la landing pública lee siempre los datos en vivo desde `/api/links`, y cada vez que la dueña guarde cambios en `/admin` se van a reflejar en la landing sin volver a tocar GitHub.

## 3. Usar el panel de edición

1. Entrar a `https://florar-admin.vercel.app/admin`.
2. Ingresar la contraseña (`ADMIN_PASSWORD`).
3. Ahí puede:
   - Editar título, subtítulo y logo del perfil.
   - Editar texto y URL de cada botón.
   - Agregar o eliminar botones y títulos de sección.
   - Reordenar todo con las flechas ↑ / ↓.
4. Botón "Guardar cambios" al final. Los cambios quedan guardados en la base de datos y la landing los muestra al instante (recargando la página).

## Logo

El isotipo real está en [`assets/logo.png`](assets/logo.png) y el perfil ya apunta ahí (`logoUrl: "assets/logo.png"`). Si en algún momento se quiere cambiar, se puede editar el campo "URL del logo" desde `/admin` — puede ser esa misma ruta relativa u otra URL externa.
