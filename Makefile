dependencies:
	npm install -g @quasar/cli && npm install

dev-client:
	quasar dev

dev-server:
	GOOGLE_APPLICATION_CREDENTIALS=bootloader/gcp.json node api/server.js
