up:
	docker-compose up -d

down:
	docker-compose down

enter-app:
	docker exec -it hypebold_api sh

enter-mongo:
	docker exec -it mongodb sh
