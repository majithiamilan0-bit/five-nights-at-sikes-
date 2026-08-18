# Escape Mr. Lau

A first-person 3D sewer escape game built with Three.js. You're a school
student who got locked in the sewer tunnels beneath the school after hours
— and Mr. Lau, in his dark coat and glasses, is down there hunting for you
with nothing but your flickering flashlight to see by. Explore a randomly
generated maze, solve 4 maths clues hidden at glowing rune stations to
build a 4-digit exit code, stay out of Mr. Lau's reach, and reach the gate
before your lives run out.

## Play locally

This is a static site with no build step. Serve the folder with any static
file server and open it in a browser, for example:

```
python3 -m http.server 8000
```

then visit `http://localhost:8000/`.

## Controls

- Click the screen to lock the mouse and look around
- `W` `A` `S` `D` or arrow keys to move
- Walk up to a glowing rune to read its maths clue
- Reach the exit gate once all 4 clues are solved and type in the code

## Deploying

Push this repo and enable **GitHub Pages** (Settings → Pages → deploy from
the `main` branch) to get a public URL for the game. Three.js is vendored
locally under `vendor/three/`, so the game has no external dependencies
and works entirely from this repo.
