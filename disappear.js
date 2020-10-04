#!/usr/bin/env gjs

/*
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

imports.gi.versions.Gtk = "3.0";

const { Gtk, GLib, Gio } = imports.gi;

let search_results = null;
const sliders = new Map();
const apps = new Map();

const application = new Gtk.Application({
  application_id: "re.sonny.Disappear",
  flags: Gio.ApplicationFlags.FLAGS_NONE,
});
const title = "Disappear";
GLib.set_prgname(title);

let window;

application.connect("activate", () => {
  window.show_all();
});
application.connect("startup", () => {
  window = buildWindow();
});

function buildWindow() {
  window = new Gtk.ApplicationWindow({
    application,
    default_height: 300,
    default_width: 720,
    window_position: Gtk.WindowPosition.CENTER,
  });

  const box = new Gtk.Box({ orientation: Gtk.Orientation.VERTICAL });
  const searchEntry = new Gtk.SearchEntry();

  box.add(searchEntry);

  const { listBox, scrolledWindow } = List();

  Gio.AppInfo.get_all()
    .map((app) => {
      apps.set(app.get_id(), app);
      return {
        name: app.get_name(),
        id: app.get_id(),
        hidden: !app.should_show(),
        icon: app.get_icon(),
      };
    })
    .sort((a, b) => {
      return a.name.localeCompare(b.name);
    })
    .forEach((app) => {
      listBox.add(Row(app));
    });

  box.pack_start(scrolledWindow, true, true, 0);

  searchEntry.connect("search-changed", () => {
    const value = searchEntry.text;
    search_results = value ? Gio.DesktopAppInfo.search(value).flat() : null;
    listBox.invalidate_filter();
  });

  window.add(box);

  return window;
}

function List() {
  const scrolledWindow = new Gtk.ScrolledWindow();

  const listBox = new Gtk.ListBox({
    selection_mode: Gtk.SelectionMode.NONE,
  });

  listBox.set_filter_func((row) => {
    if (!search_results) return true;
    return search_results.includes(row.id);
  });

  listBox.connect("row-activated", (self, row) => {
    onRowActivated(row.id);
  });

  scrolledWindow.add(listBox);

  return { scrolledWindow, listBox };
}

function Row({ name, id, hidden, icon }) {
  const row = new Gtk.ListBoxRow({
    activatable: true,
  });

  // row.set_data('id', id)
  row.id = id;

  const hbox = new Gtk.Box({
    orientation: Gtk.Orientation.HORIZONTAL,
    spacing: 10,
  });
  row.add(hbox);

  // first col
  const slider = new Gtk.Switch();
  slider.state = hidden;
  slider.id = id;
  hbox.pack_start(slider, false, true, 10);
  sliders.set(id, slider);
  slider.connect("notify::active", onSwitchActivate);

  // second col
  const image = new Gtk.Image({
    gicon: icon,
    icon_size: 4,
    pixel_size: 32,
  });
  hbox.pack_start(image, false, true, 0);

  // third col
  const label = new Gtk.Label({ label: name, xalign: 0 });
  hbox.pack_start(label, true, true, 0);

  return row;
}

function onRowActivated(id) {
  const slider = sliders.get(id);
  slider.emit("activate");
}

function onSwitchActivate(slider) {
  const app = apps.get(slider.id);
  editDesktopEntry(app, slider.active);
}

function editDesktopEntry(app, hide) {
  const keyFile = new GLib.KeyFile();
  const path = `${GLib.get_user_data_dir()}/applications/${app.get_id()}`;

  try {
    keyFile.load_from_file(path, GLib.KeyFileFlags.NONE);
  } catch (err) {
    if (err.code != GLib.FileError.NOENT) {
      throw err;
    }

    keyFile.load_from_file(app.filename, GLib.KeyFileFlags.NONE);
    keyFile.set_string("Desktop Entry", "Disappear", "1.0");
  }

  if (hide) {
    keyFile.set_boolean("Desktop Entry", "NoDisplay", true);
    keyFile.save_to_file(path);
  } else {
    keyFile.set_boolean("Desktop Entry", "NoDisplay", false);

    // if (keyFile.get_string("Desktop Entry", "Disappear")) {
    // GLib.unlink(path);
    // } else {
    keyFile.save_to_file(path);
    // }
  }

  // updateDesktopDatabase();
}

application.run(ARGV);
