#!/bin/bash

PKG_FILE=site/site-packages.zip

install:
	@echo '-- Install development dependencies'
	pip install -r requirements-dev.txt
	@echo '-- Install runtime dependencies'
	saecloud install -r requirements.txt
	@echo '-- Package dependencies to site/site-packages.zip'
	rm -f $(PKG_FILE)
	cd site-packages && zip -r ../$(PKG_FILE) . && cd ..

deploy:
	saecloud deploy site

server:
	cd site && dev_server.py --host upzone.dev