.PHONY: test lint build

test:
	npm --prefix server test
	npm --prefix client run lint
	npm --prefix client run build

lint:
	npm --prefix client run lint

build:
	npm --prefix client run build
