# MiPod

Open-source **click-wheel shell** for MiPod. Device chrome HTML, CSS, and face assets only. No music player, library, or app logic in this repo.

Live demo: [builds.doodledev.app/#/mipod](https://builds.doodledev.app/?go=1#/mipod).

The shell was designed in **[DoodleDev](https://doodledev.app)** and mounts as a web component. No framework, no runtime deps.

<p align="center">
  <img width="1920" height="1080" alt="MiPod shell" src="https://github.com/user-attachments/assets/e16e4ffa-e94d-4658-91c7-3394b5dfdbb5" />
</p>

## Features

- DoodleDev classic iPod-style shell (`<ipod-design>`)
- Chassis art + click-wheel glyphs
- Static shell demo page (LCD card, no music)
- Plain static site. Serve the folder from anywhere

<p align="center">
  <img width="1920" height="1080" alt="MiPod now playing" src="https://github.com/user-attachments/assets/72e789c7-d8c8-4cc1-a84e-f1507b26f8a1" />
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
