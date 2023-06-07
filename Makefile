up:
	- docker-compose up -d --remove-orphans
down:
	- docker-compose down
proto:
	- npm run proto:build

gw-dev:
	- nx serve temo
acc-dev:
	- nx serve account-service
ev-dev:
	- nx serve event-service
wk-dev:
	- nx serve worker-service