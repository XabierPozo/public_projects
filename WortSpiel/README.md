| README.md ENGLISH |
| :---: |
#### Wortspiel — Memory Game

##### File Structure

```
wortspiel/
|
│───docker-compose.yml  ← Compose file to install the game easily
│
├───sql
│       database.sql    ← SQL Script to create the database
│       
└───web
    │───index.html      ← The game
    │   
    ├───css
    │       style.css   ← The styles
    │       
    ├───js
    │       main.js     ← Instructions / functions
    │
    └───php
            api.php     ← API that reads vocabulary from MySQL
```

##### Requirements
If developing the web app in a container, you will need:
Docker & Docker Compose installed

##### Installation

###### 1. Install the game
From the terminal, run "docker-compose up -d --build" at the root of the wortspiel project.

###### 2. Configure api.php
Edit the constants at the top of `api.php`:
```php
define('DB_HOST', 'WortSpiel_db'); 
define('DB_USER', 'user_wortspiel');
define('DB_PASS', '****');
define('DB_NAME', 'wortspiel_db');
```

###### 3. Deploy
Access `http://your-server/wortspiel/index.html`.
---

##### API Reference

`GET api.php?action=pairs&count=8`

Returns N random pairs from the database.

```json
{
  "success": true,
  "pairs": [
    { "id": 1, "aleman": "sein", "espanol": "ser, estar" },
    ...
  ]
}
```

Parameters:
- `action` → always `pairs`
- `count`  → number of pairs (maximum 20)

---

##### Game Rules
1. All cards start face down
2. Click a card to flip it over
3. Click a second card
4. If the two cards form a pair (German verb ↔ Spanish), they remain uncovered
5. If they do not match, they flip back over
6. You win when you match all the cards


| README.md ESPAÑOL |
| :---: |
#### Wortspiel — Juego de Memoria Alemán-Español

##### Estructura de archivos

```
wortspiel/
|
│───docker-compose.yml  ← Compose para instalar el juego facilmente
│
├───sql
│       database.sql    ← Script SQL para crear la base de datos
│       
└───web
    │───index.html      ← El juego
    │   
    ├───css
    │       style.css   ← El estilo
    │       
    ├───js
    │       main.js     ← Las instrucciones / funciones
    │
    └───php
            api.php     ← API que lee el vocabulario desde MySQL
```

##### Requisitos
En caso de desarrollar la web en un container, se requerirá:
Docker & Docker Compose instalados

##### Instalación

###### 1. Instalar juego
A partir del terminal, ejecuta en la base del proyecto wortspiel "docker-compose up -d --build"

###### 2. Configurar api.php
Edita las constantes en la parte superior de `api.php`:
```php
define('DB_HOST', 'WortSpiel_db'); 
define('DB_USER', 'user_wortspiel');
define('DB_PASS', '****');
define('DB_NAME', 'wortspiel_db');
```

###### 3. Desplegar
Accede a `http://tu-servidor/wortspiel/index.html`.
---

##### Referencia de API
`GET api.php?action=pairs&count=8`

Devuelve N parejas aleatorias de la base de datos.

```json
{
  "success": true,
  "pairs": [
    { "id": 1, "aleman": "sein", "espanol": "ser, estar" },
    ...
  ]
}
```

Parámetros:
- `action` → siempre `pairs`
- `count`  → número de parejas (máximo 20)

---

##### Reglas del juego
1. Todas las cartas empiezan boca abajo
2. Haz clic en una carta para voltearla
3. Haz clic en una segunda carta
4. Si las dos cartas forman una pareja (verbo alemán ↔ español), quedan descubiertas
5. Si no coinciden, se vuelven a voltear
6. Ganas cuando empareja todas las cartas
