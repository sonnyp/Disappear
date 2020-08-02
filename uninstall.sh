#!/usr/bin/env sh

rm /usr/bin/re.sonny.Disappear
rm /usr/share/applications/re.sonny.Disappear.desktop
rm /usr/share/icons/hicolor/scalable/apps/re.sonny.Disappear.svg
rm /usr/share/icons/hicolor/symbolic/apps/re.sonny.Disappear-symbolic.svg

gtk-update-icon-cache -qtf /usr/share/icons/hicolor
update-desktop-database -q /usr/share/applications
