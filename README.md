<img style="vertical-align: middle;" src="icon/icon.svg" width="120" height="120">

# Disappear

Free your desktop from cumbersome apps.

Disappear is a simple application to hide/unhide applications from your Linux desktop.

## Install

```sh
git clone https://github.com/sonnyp/Disappear.git
cd Disappear
sudo ./install.sh
```

## Update

```sh
cd Disappear
sudo ./uninstall.sh
git pull
sudo ./install.sh
```

## Uninstall

```sh
cd disappear
sudo ./uninstall.sh
```

<!-- ## Development

```sh
git clone https://github.com/sonnyp/Disappear.git
cd Disappear
flatpak-builder --user --install-deps-from=flathub --force-clean --install build flatpak.json
``` -->

## Known issues

* It might take a while for your desktop to pickup the update.
* Reinstalling an application might override your preference.

## How does it work

Disappear uses the [`NoDisplay`](https://specifications.freedesktop.org/desktop-entry-spec/desktop-entry-spec-latest.html#key-nodisplay) key from the [Desktop Entry Specification](https://specifications.freedesktop.org/desktop-entry-spec/desktop-entry-spec-latest.html).

For desktop files installed in `XDG_DATA_HOME` (e.g. `~/.local/share/applications`) Disappear will modify the file in place.

For desktop files installed system-wide (e.g. `/usr/local/share/applications`) Disappear will copy the deskop file into `XDG_DATA_HOME` (which takes precedence) and modify it.

Neither of these is ideal so if you have better ideas please open an issue.

## Credits

Icon [ripen pear](https://thenounproject.com/icon/1882627/) by [Vectors Market](https://thenounproject.com/vectorsmarket/) from [the Noun Project](https://thenounproject.com/). 