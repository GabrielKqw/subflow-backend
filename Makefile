.PHONY: help install dev build start test lint clean docker-up docker-down migrate seed

help:
	@echo "Available commands:"
	@echo "  make install      - Install dependencies"
	@echo "  make dev          - Run development server"
	@echo "  make build        - Build for production"
	@echo "  make start        - Start production server"
	@echo "  make test         - Run tests"
	@echo "  make test-watch   - Run tests in watch mode"
	@echo "  make lint         - Run linter"
	@echo "  make format       - Format code"
	@echo "  make clean        - Clean build files"
	@echo "  make docker-up    - Start Docker containers"
	@echo "  make docker-down  - Stop Docker containers"
	@echo "  make migrate      - Run database migrations"
	@echo "  make seed         - Seed database"
	@echo "  make studio       - Open Prisma Studio"

install:
	npm install

dev:
	npm run dev

build:
	npm run build

start:
	npm start

test:
	npm test

test-watch:
	npm run test:watch

test-coverage:
	npm run test:coverage

lint:
	npm run lint

lint-fix:
	npm run lint:fix

format:
	npm run format

clean:
	rm -rf dist node_modules coverage

docker-up:
	docker-compose up -d

docker-down:
	docker-compose down

docker-logs:
	docker-compose logs -f app

migrate:
	npx prisma migrate dev

migrate-deploy:
	npx prisma migrate deploy

seed:
	npx prisma db seed

studio:
	npx prisma studio

reset:
	npx prisma migrate reset

generate:
	npx prisma generate

setup: install migrate seed
	@echo "Setup complete!"

docker-setup: docker-up
	docker-compose exec app npx prisma migrate deploy
	docker-compose exec app npx prisma db seed
	@echo "Docker setup complete!"

