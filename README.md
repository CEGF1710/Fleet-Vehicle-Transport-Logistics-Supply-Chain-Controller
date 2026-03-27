Es una plataforma web fuertemente inspirada en Odoo Fleet enfocada en la eficiencia logística. Trabaja en base a un Dashboard Principal y dos formularios satélite (Entidades de Negocio).
-Funcionamiento
1. Gestor de Flota y Conductores: Primero debes "alimentar" al sistema de los datos mínimos y registrar un par de Vehículos y Choferes con sus respectivas matrículas y licencias para poder emparejarlos.
2. Dashboard de Viajes: Aquí el despachador crea las rutas escogiendo al Vehículo y Chofer guardados. El despachador solo pone la "Fecha", el "Kilometraje al salir" (Inicial), el "Kilometraje al volver" (Final) y cuántos litros de gasolina gastó en esa ruta.
3. Toda esa tabla de viajes se llena cronológicamente como un "Reporte y Auditoría Histórica", dándote información sobre el rendimiento que está logrando tu flota en la vida real.
-Tecnologías usadas 
1. Next.js 14: Nos solucionó el tener que crear una API externa o un servidor Python/Node separado. Next.js hace que todo funcione en una misma aplicación: el Frontend (la vista hermosa) mediante React y todo el Backend mediante Server Actions (validaciones directas a base de datos ultrarrápidas).
2. Prisma y SQLite: Prisma que simplifica el flujo de la base de datos y SQLite, el cual genera automáticamente un archivo llamado `dev.db` que guarda las toneladas de información internamente dentro de la misma memoria del proyecto al instante.
3. Vainilla CSS Puro (Cero Tailwind u otros): Usando un diseño formal, interactivo y espaciador.
 
-Validadores Inteligentes Activos
1. Evita falsificación del odómetro: El backend consultará si tu Vehículo XYZ terminó su viaje anterior con 500KM. Por lo que el siguiente solo puede ser un numero mayor.
2. Calcula rendimiento automáticamente: En la vista final verás etiquetas (Verdes, Amarillas y Rojas) evaluando matemáticamente si consumieron muchos litros para tan pocos kilómetros.
-Pasos para abrirlo y usarlo ahora en tu Computador
1. Abre esta misma carpeta tuya de `Fleet Vehicle Transport Logistics...` en tu programa VS Code.
2. Dale al botón de "Terminal" en la barra superior y click en "New Terminal".
3. En la ventanita negra que aparece abajo, vas a escribir el comando para arrancar el servidor web:
  ```
  npm run dev
  ```
4. Presiona Enter y espera 2 segundos a que el terminal te diga algo como: `ready in x ms, url: http://localhost:3000`. No cierres la terminal ni aprietes ctrl + C pues detendrás el programa.
5. Entra a Google Chrome, y en la URL escribe: **`http://localhost:3000`**
