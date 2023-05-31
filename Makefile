up:
	- docker-compose up -d --remove-orphans
down:
	- docker-compose down

gw-dev:
	- nx serve temo
acc-dev:
	- nx serve account-service
ev-dev:
	- nx serve event-service