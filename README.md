<img style="vertical-align: middle;" src="icon/icon.svg" width="120" height="120">

# Disappear

Free your launcher from cumbersome apps.

Disappear is a simple program to hide (or show) applications from your launcher.

Some packages like Wine, Java, glmark2, ... come with applications that I'm not interested in cluttering my app launcher.

Others such as GTK, GNOME, come with applications hidden by default that I want available in my app launcher.

## Install

Dependencies GTK 4 and gjs.

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

- It might take a while for your desktop to pickup the update
- Reinstalling an application may override your preference
- Applications for which `.desktop` files are placed in subfolders are not supported yet
- Flatpak isn't possible at the moment

## How does it work

Disappear uses the [`NoDisplay`](https://specifications.freedesktop.org/desktop-entry-spec/desktop-entry-spec-latest.html#key-nodisplay) key from the [Desktop Entry Specification](https://specifications.freedesktop.org/desktop-entry-spec/desktop-entry-spec-latest.html).

For `.desktop` files installed in `XDG_DATA_HOME` (e.g. `~/.local/share/applications`) Disappear will modify the file in place.

For desktop files installed system-wide (e.g. `/usr/local/share/applications`) Disappear will copy the `.desktop` file into `XDG_DATA_HOME` (which takes precedence) and modify it.

Neither of these is ideal so if you have better ideas please open an issue.

### Alternatives considered

#### `XDG_DATA_DIRS`

An option could have been to add a directory, for example `~/.local/share/disappear` to `XDG_DATA_DIRS` and write custom `.desktop` files but there are 2 issues with this

1. According to [basedir spec](https://specifications.freedesktop.org/basedir-spec/basedir-spec-latest.html) `XDG_DATA_HOME` takes precedence over `XDG_DATA_DIRS`
2. Permanently setting/extending an environment variable is difficult for a plug'n play application like Disappear

#### GNOME Shell extension

If I don't find a reasonable solutions to known issues I might turn this into a GNOME Shell extension or at least use a GNOME Shell extension when possible.

## Credits

Icon [ripen pear](https://thenounproject.com/icon/1882627/) by [Vectors Market](https://thenounproject.com/vectorsmarket/) from [the Noun Project](https://thenounproject.com/).
