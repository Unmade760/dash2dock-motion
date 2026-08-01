UUID = dash2dock-motion@unmade.space
INSTALL_DIR = $(HOME)/.local/share/gnome-shell/extensions/$(UUID)

# Everything the extension needs at runtime. Documentation and showcase media
# are deliberately left out of the package: extensions.gnome.org rejects
# submissions carrying files that are not required to run.
SOURCES = \
	appIconIndicators.js \
	appIcons.js \
	appIconsDecorator.js \
	appSpread.js \
	dash.js \
	dbusmenuUtils.js \
	desktopIconsIntegration.js \
	docking.js \
	extension.js \
	fileManager1API.js \
	glass.js \
	imports.js \
	intellihide.js \
	launcherAPI.js \
	locations.js \
	locationsWorker.js \
	magnifier.js \
	notificationsMonitor.js \
	prefs.js \
	theming.js \
	utils.js \
	windowPreview.js \
	metadata.json \
	stylesheet.css \
	Settings.ui \
	COPYING \
	NOTICE

DIRS = dependencies locale media schemas

.PHONY: all compile-schemas install uninstall zip clean

all: compile-schemas

compile-schemas:
	glib-compile-schemas --strict schemas/

install: compile-schemas
	rm -rf $(INSTALL_DIR)
	mkdir -p $(INSTALL_DIR)
	cp -r $(SOURCES) $(DIRS) $(INSTALL_DIR)
	@echo "Installed to $(INSTALL_DIR)"
	@echo "Log out and back in, then: gnome-extensions enable $(UUID)"

uninstall:
	rm -rf $(INSTALL_DIR)

zip: compile-schemas
	rm -f $(UUID).zip
	zip -rq $(UUID).zip $(SOURCES) $(DIRS)
	@echo "Created $(UUID).zip"

clean:
	rm -f $(UUID).zip schemas/gschemas.compiled
