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

imports.gi.versions.Gtk = "4.0";

const { Gtk, GLib, Gio } = imports.gi;
const ByteArray = imports.byteArray;

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
  window.present();
});
application.connect("startup", () => {
  window = buildWindow();
});

function buildWindow() {
  window = new Gtk.ApplicationWindow({
    application,
    default_height: 720,
    default_width: 300,
  });

  const box = new Gtk.Box({ orientation: Gtk.Orientation.VERTICAL });

  const searchEntry = new Gtk.SearchEntry();
  box.append(searchEntry);

  const { listBox, scrolledWindow } = List();
  box.append(scrolledWindow);

  Gio.AppInfo.get_all()
    .map((app) => {
      // FIXME: use filename to edit the .desktop file
      // some .desktop files are in subfolders like anbox or wine
      // see ~/.local/share/applications/
      log(app.get_filename())
      apps.set(app.get_id(), app);
      return {
        name: app.get_name(),
        id: app.get_id(),
        should_show: app.should_show(),
        icon: app.get_icon(),
      };
    })
    .sort((a, b) => {
      return a.name.localeCompare(b.name);
    })
    .forEach((app) => {
      listBox.append(Row(app));
    });

  searchEntry.connect("search-changed", () => {
    const value = searchEntry.text;
    search_results = value ? Gio.DesktopAppInfo.search(value).flat() : null;
    listBox.invalidate_filter();
  });

  window.set_child(box);

  return window;
}

function List() {
  const scrolledWindow = new Gtk.ScrolledWindow({
    vexpand: true
  });

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

  scrolledWindow.set_child(listBox);

  return { scrolledWindow, listBox };
}

function Row({ name, id, should_show, icon }) {
  const row = new Gtk.ListBoxRow({
    activatable: true,
  });

  // row.set_data('id', id)
  row.id = id;

  const hbox = new Gtk.Box({
    orientation: Gtk.Orientation.HORIZONTAL,
    spacing: 10,
  });
  row.set_child(hbox);

  // first col
  const slider = new Gtk.Switch();
  slider.state = should_show;
  slider.id = id;
  slider.valign = Gtk.Align.CENTER;
  hbox.append(slider);
  sliders.set(id, slider);
  slider.connect("notify::active", onSwitchActivate);

  // second col
  const image = new Gtk.Image({
    gicon: icon,
    // pixel_size: 32,
  });
  hbox.append(image);

  // third col
  const label = new Gtk.Label({ label: name, xalign: 0 });
  hbox.append(label);

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

function editDesktopEntry(app, show) {
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

  if (show) {
    keyFile.set_boolean("Desktop Entry", "NoDisplay", false);
    // if (keyFile.get_string("Desktop Entry", "Disappear")) {
    // GLib.unlink(path);
    // } else {
    keyFile.save_to_file(path);
    // }
  } else {
    keyFile.set_boolean("Desktop Entry", "NoDisplay", true);
    keyFile.save_to_file(path);
  }

  // updateDesktopDatabase();
}

application.run(ARGV);
