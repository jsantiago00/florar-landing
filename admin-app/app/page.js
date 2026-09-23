export default function Home() {
  return (
    <div style={{ padding: 40, textAlign: "center", fontFamily: "sans-serif" }}>
      <h1>Florar - Backend de admin</h1>
      <p>
        Este proyecto sirve la API de links (<code>/api/links</code>) y el panel de edición.
      </p>
      <p>
        Ir a <a href="/admin">/admin</a> para editar los links de la landing.
      </p>
    </div>
  );
}
