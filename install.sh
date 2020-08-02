#!/usr/bin/env sh

install -D disappear.js /usr/bin/re.sonny.Disappear
install re.sonny.Disappear.desktop /usr/share/applications
install re.sonny.Disappear.svg /usr/share/icons/hicolor/scalable/apps
install re.sonny.Disappear-symbolic.svg /usr/share/icons/hicolor/symbolic/apps

gtk-update-icon-cache -qtf /usr/share/icons/hicolor
update-desktop-database -q /usr/share/applications
