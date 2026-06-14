# Archi-Jam-2026
https://edricy.itch.io/the-heist  
https://itch.io/jam/archipelago-game-jam  
https://github.com/EdricY/GameJam-S2019  

## Game Instructions
Use the Arrow Keys to move.  
Use Z to run faster. (requires item "Sprint")  
Use X to stealth in place. (requires item "Stealth")  
Use Space to interact with doors and locks.  
When picking a lock, use numbers 1-6 to guess the correct combination for the lock.  
The position of the pin is a slight indicator for it's number.  
Each number can only appear once in the combination.  
If you're using a mechanical keyboard, check the "I have a cool keyboard" checkbox on the Instructions page for a more interesting lockpicking experience.  
If you receive a World Key from archipelago and the levels don't unlock, try entering the Market and then returning to the levels landing.  
Your Goal is to escape with the bottom treasure of the final level.  

## Archipelago Setup
- Download the latest [Archipelago launcher](https://github.com/ArchipelagoMW/Archipelago/releases) (0.6.7+)
- Download [heist-jam.apworld](https://github.com/EdricY/Archi-Jam-2026/releases)
- Create a YAML file (no options are implemented, you just need to tell generation what game you're playing)
- Place player yaml file(s): Archipelago Client > Browse Files > Players > insert yaml files here.
- Generate world: Archipelago Client > Generate
- The outputted .zip file is at Archipelago Client > Browse Files > output > `AP_<numbers>.zip`
- Upload this .zip at https://archipelago.gg/uploads to create a room

## Sample Yaml
heist-jam.yaml
```
name: myslot
game: HeistJam
description: Sample Yaml for HeistJam
HeistJam:
  progression_balancing: '50'
  accessibility: full
```

## Previous work and AI Disclosure:  
The original game was created for a gamejam in 2019 ([repo](https://github.com/EdricY/GameJam-S2019), [play original here](https://edricy.github.io/GameJam-S2019/)). Upgrades to the game were made in 2026 for the Archipelago Game Jam with the help of tab completions from Antigravity, but no prompting during the jam time period. A sample AP World and the zip script were previously (pre-jam) generated with the help of Gemini 3.1 and Antigravity during other development, and were used as a starting point for the AP World in this project.

## Future Development
Due to lack of availability, I added far fewer features than I intended to. This project will probably need a full rewrite to continue development, so future development is unlikely to happen unless there is significant interest.