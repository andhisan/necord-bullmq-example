up:
	docker compose up -d
down:
	docker compose down --remove-orphans

bot-e2e:
	@make down
	docker compose --profile e2e up --abort-on-container-exit
