#!/usr/bin/env sh

install -D disappear.js /usr/bin/re.sonny.Disappear
install disappear.desktop /usr/share/applications/re.sonny.Disappear.desktop
install icon/icon.svg /usr/share/icons/hicolor/scalable/apps/re.sonny.Disappear.svg
install icon/symbolic.svg /usr/share/icons/hicolor/symbolic/apps/re.sonny.Disappear-symbolic.svg

gtk-update-icon-cache -qtf /usr/share/icons/hicolor
update-desktop-database -q /usr/share/applications
