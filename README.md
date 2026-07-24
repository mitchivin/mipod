# MiPod

Open-source **click-wheel shell** for MiPod. Device chrome HTML, CSS, and face assets only. No music player, library, or app logic in this repo.

Live demo: [builds.doodledev.app/#/mipod](https://builds.doodledev.app/?go=1#/mipod).

The shell was designed in **[DoodleDev](https://doodledev.app)** and mounts as a web component. No framework, no runtime deps.

<p align="center">
  <img src="https://github.com/user-attachments/assets/2d15667e-1ee2-4979-a0a2-5bd7c3fa78f1" alt="MiPod now playing" />
</p>

## Features

- DoodleDev classic iPod-style shell (`<ipod-design>`)
- Chassis art + click-wheel glyphs
- Static shell demo page (LCD card, no music)
- Plain static site. Serve the folder from anywhere

<p align="center">
  <img src="https://github.com/user-attachments/assets/a05e9b16-afde-496b-8cbd-174d2450feda" alt="MiPod shell" />
</p>

## Run locally

```bash
git clone https://github.com/mitchivin/mipod.git
cd mipod
npx serve .
```

Open whatever URL it prints (usually `http://localhost:3000`). You should see the device with a shell demo LCD.

## Layout

```
|-- index.html
|-- css/
|   `-- ipod-bundle.css
|-- js/
|   |-- mobileZoomGuard.js
|   |-- shellPress.js
|   `-- components/IpodDesign.js
|-- public/
|   |-- ipod-base.webp
|   |-- icons/
|   `-- ...
`-- LICENSE
```

## Stack

- Vanilla HTML / CSS / Web Component
- Shell from [DoodleDev](https://doodledev.app)

## Related

- [DoodleBuilds](https://builds.doodledev.app/?go=1) - shared live demo host
- [MI Boy Color](https://github.com/mitchivin/miboy) - handheld shell
- [MitchIvin XP](https://mitchivin.com/) - Windows XP portfolio desktop

## Credits

Built by **[Mitch Ivin](https://mitchivin.com/)**.  
Shell designed in **[DoodleDev](https://doodledev.app)**.

## License

MIT. See [LICENSE](./LICENSE).
