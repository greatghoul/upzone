#!/bin/bash

PKG_FILE=site/site-packages.zip
LIB=site/static/lib

install:
	@echo '-- Install python components'
	@pip install -r requirements.txt
	@echo ''
	@echo '-- Install bower dependencies'
	@bower install
	@rm -rf $(LIB)/jquery/src

server:
	cd site && fab server