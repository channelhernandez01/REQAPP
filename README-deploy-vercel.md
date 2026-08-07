Despliegue en Vercel

Pasos rápidos para dejar la web pública en Vercel:

1) Conecta el repositorio a Vercel
   - Ir a https://vercel.com/new y conectar tu cuenta de GitHub/GitLab/Bitbucket o subir el repo.
   - Selecciona el repositorio que contiene este proyecto.

2) Variables de entorno (IMPORTANT)
   - En el dashboard del proyecto en Vercel, entra en Settings -> Environment Variables.
   - Añade al menos estas variables:
     - SUPABASE_URL = https://<tu-project-ref>.supabase.co
     - SUPABASE_SERVICE_ROLE_KEY = <tu_service_role_key>
     - (Alternativa menos privilegiada) SUPABASE_ANON_KEY = <tu_anon_key>
   - NO subas ni comites claves privadas al repositorio.

3) Build & Run
   - Este proyecto usa funciones serverless en la carpeta /api. Vercel detectará las funciones y las desplegará como endpoints.
   - Endpoint disponible tras deploy: https://<tu-proyecto>.vercel.app/api/todos

4) Probar localmente
   - Instala dependencias: npm install
   - Crea .env con las variables necesarias (igual que en Vercel) para pruebas locales.
   - Ejecuta: vercel dev

5) Notas de seguridad
   - Para llamadas desde el navegador públicas, preferible usar políticas RLS y claves anon en el cliente.
   - Para operaciones administrativas, usa SUPABASE_SERVICE_ROLE_KEY únicamente en server-side (funciones serverless).

6) Soporte y rollback
   - Vercel mantiene despliegues anteriores; puedes hacer rollback desde el dashboard.

Si quieres, puedo:
 - Crear la rama y el commit con estos archivos (ya creados) y guiarte para conectar el repo a Vercel.
 - O guiarte paso a paso con capturas de pantalla para configurar las variables en Vercel.
