.PHONY: help dev prod build up down logs restart clean backup test

help:
	@echo "Fitness Challenge API - Commandes Docker"
	@echo ""
	@echo "Développement:"
	@echo "  make dev          - Démarrer en mode développement"
	@echo "  make dev-logs     - Voir les logs en mode développement"
	@echo ""
	@echo "Production:"
	@echo "  make prod         - Démarrer en mode production"
	@echo "  make build        - Builder les images"
	@echo "  make up           - Démarrer les conteneurs"
	@echo "  make down         - Arrêter les conteneurs"
	@echo "  make restart      - Redémarrer les conteneurs"
	@echo ""
	@echo "Monitoring:"
	@echo "  make logs         - Voir les logs"
	@echo "  make logs-api     - Voir les logs de l'API"
	@echo "  make logs-db      - Voir les logs de PostgreSQL"
	@echo "  make ps           - Voir le statut des conteneurs"
	@echo ""
	@echo "Base de données:"
	@echo "  make db-shell     - Accéder au shell PostgreSQL"
	@echo "  make db-migrate   - Exécuter les migrations"
	@echo "  make backup       - Sauvegarder la base de données"
	@echo ""
	@echo "Maintenance:"
	@echo "  make clean        - Nettoyer les conteneurs et volumes"
	@echo "  make rebuild      - Rebuild complet"
	@echo "  make test         - Lancer les tests"

dev:
	docker-compose -f docker-compose.dev.yml up

dev-logs:
	docker-compose -f docker-compose.dev.yml logs -f

prod:
	docker-compose up -d

build:
	docker-compose build

up:
	docker-compose up -d

down:
	docker-compose down

restart:
	docker-compose restart

logs:
	docker-compose logs -f

logs-api:
	docker-compose logs -f api

logs-db:
	docker-compose logs -f postgres

ps:
	docker-compose ps

db-shell:
	docker-compose exec postgres psql -U fitness_user -d fitness_challenge

db-migrate:
	docker-compose exec api npm run db:push

backup:
	@mkdir -p backups
	@docker-compose exec -T postgres pg_dump -U fitness_user fitness_challenge > backups/backup_$$(date +%Y%m%d_%H%M%S).sql
	@echo "Backup créé dans backups/"

clean:
	docker-compose down -v
	docker system prune -f

rebuild:
	docker-compose down
	docker-compose build --no-cache
	docker-compose up -d

test:
	docker-compose exec api npm test
