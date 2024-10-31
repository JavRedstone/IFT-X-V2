# What is it

A fun simulation game of the SpaceX Starship. Mostly physically accurate. Built with no physics engine nor game engine (only ThreeJS renderer through Threlte and Three Nebula particle system).

# How to play

Go to [iftx.pages.dev/](https://iftx.pages.dev/)

1. Customize your Starship and SuperHeavy
2. Launch the Starship and SuperHeavy
3. Use keybinds (listed in keybinds popup) to control the Starship and SuperHeavy

# Features

- Includes full customizability of Starship and SuperHeavy, from the number of engines to the size of the flaps
- Includes stage separation (hot staging)
- Includes automated landing burn
- Includes particle effects, specifically
    - Deluge system
    - Engine exhaust
    - Hot staging
    - Reentry

# Detailed Instructions

I made a **Starship simulator** that runs on the web, all without using a game engine / physics engine. Did this for about a month straight.
**Features**
1. Customize your starship + superheavy [you can change many different specs, such as the type of raptor engine (from 1-3), the length of the vehicles, size and number of grid fins, the height and presence of a HSR, etc.
    - *Your customizations will be saved on fueling (that means when you reload the page, it will still be there*
2. Fuel them (this will be a "timelapse" and will last approx 5 seconds IRL)
3. Launch them
    - this uses a fully functional mockup of the SpaceX UI and some more functionality. The to see the keybinds, open the popup via the button on the left hand corner, but essentially its two groups of arrow key commands on different regions of the keyboard. you can speed up or slow down the time rate via the slidebar that you can use + or - to control, and you can also remove particle effects if its laggy
    - MECO event
    - Stage sep (with hot staging)
    - Boostback startup & shutdown
    - Automatic landing for the most part (I tried my best on this one using PDcontrollers, and is not completely realistic, however you need to make sure that the booster is vertical in the first place)
        - you need to time the landing well otherwise you will run out of fuel / crash
    - SECO
    - As you reenter, there are reentry particle effects
    - The flaps do work, so you can choose to perform a ship landing in the same way as well
        - you need to time the landing well otherwise you will run out of fuel / crash
**Disclaimer**
The physics are not perfect and some have been changed for playability (such as grid fins not caring about the direction of movement, or that the control surfaces have much more control than in real life). Gimbaling mechanics is not perfect due to my skill level in understanding Quaternions.

# License

This project is licensed under the GPL-3.0 license. See the `LICENSE` file for more information.

- Do not use this project for commercial purposes without permission.
- Do not call this project your own for any reason.

# Credits

## General Credits

- [ThreeJS](https://threejs.org/)
- [Threlte](https://threlte.xyz/)
- [Three Nebula](https://three-nebula.org/)
- [SpaceX](https://www.spacex.com/)
- [SpaceX Starship](https://www.spacex.com/vehicles/starship/)

## Video Credits

- Start screen video: [Starship ascending through the clouds](https://twitter.com/SpaceX/status/1768747417716101402) by SpaceX
- Loading screen video: [Starship Third Flight Test](https://www.youtube.com/watch?v=ApMrILhTulI) by SpaceX
- Background music:
    Song: Savfk - Ultra
    License: Creative Commons (CC BY 3.0) https://creativecommons.org/licenses/by/3.0
    https://youtube.com/savfkmusic
    Music powered by BreakingCopyright: https://breakingcopyright.com