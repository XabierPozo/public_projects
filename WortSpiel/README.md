README.md 🇬🇧

#### Wortspiel — Memory Game 





 File Structure 



 <code>wortspiel/</code>



<code>├── docker-compose.yml</code>



<code>├── sql/database.sql</code>



<code>└── web/</code>



<code>    ├── index.html</code>



<code>    ├── css/style.css</code>



<code>    ├── js/main.js</code>



<code>    └── php/api.php</code>





 Requirements 



 If developing the web app in a container, you will need Docker & Docker Compose installed. 





 Installation 



 1. Install: Run docker-compose up -d --build in the project root. 



 2. Configure: Edit api.php constants (DB_HOST, DB_USER, etc.). 



 3. Deploy: Access http://localhost:8081. 





 API Reference 



 GET api.php?action=pairs&count=8 



 Returns random pairs in JSON format: 



 {"success": true, "pairs": [...]} 





 Game Rules 



 1. Cards start face down. 



 2. Click a card to flip it. 



 3. Match German ↔ Spanish to keep them visible. 



 4. Match all pairs to win.

README.md 🇪🇸

#### Wortspiel — Juego de Memoria Alemán-Español 





 Estructura de archivos 



 <code>wortspiel/</code>



<code>├── docker-compose.yml</code>



<code>├── sql/database.sql</code>



<code>└── web/</code>



<code>    ├── index.html</code>



<code>    ├── css/style.css</code>



<code>    ├── js/main.js</code>



<code>    └── php/api.php</code>





 Requisitos 



 En caso de desarrollar la web en un contenedor, se requerirá Docker y Docker Compose instalados. 





 Instalación 



 1. Instalar: Ejecuta docker-compose up -d --build en la raíz del proyecto. 



 2. Configurar: Edita las constantes en api.php (DB_HOST, DB_USER, etc.). 



 3. Desplegar: Accede a http://localhost:8081. 





 Referencia de API 



 GET api.php?action=pairs&count=8 



 Devuelve parejas aleatorias en formato JSON: 



 {"success": true, "pairs": [...]} 





 Reglas del juego 



 1. Todas las cartas empiezan boca abajo. 



 2. Haz clic en una carta para voltearla. 



 3. Forma parejas (alemán ↔ español) para descubrirlas. 



 4. Ganas cuando emparejas todas las cartas.
