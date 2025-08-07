exec-web:
	docker exec -it parrots-app /bin/sh

sso:
	aws sso login --profile $(profile)

awsexec:
	value=$$(aws ecs list-tasks --cluster parrots-$(env)-cluster --service-name parrots-$(env)-ecs-web-redis-service --region $(region) --profile $(profile) --output text | awk -v line=$(line) 'NR == line {print $$2}') && \
	if [ -z "$$value" ]; then \
		echo "Error: Invalid line number or no value found." && exit 1; \
	else \
		echo "Exec to: $$value"; \
		aws ecs execute-command --region $(region) --cluster parrots-$(env)-cluster --task "$$value" --container $(container) --interactive --command "sh" --profile $(profile); \
	fi

#*******************************************************************************************************
# For use only when creating new environments in AWS - otherwise we should not be pushing to aws this way
#*******************************************************************************************************
build-container-aws:
	docker image build --platform linux/amd64 -t parrots-$(container) -f ./Dockerfile.$(container) .

tag-container-aws:
	docker tag parrots-$(container):latest 864992358777.dkr.ecr.$(region).amazonaws.com/parrots-$(env)-$(container):latest

push-container-aws:
	docker push 864992358777.dkr.ecr.$(region).amazonaws.com/parrots-$(env)-$(container):latest


manual-aws-container:
	docker image build --platform linux/amd64 -t parrots-$(container) -f ./Dockerfile.$(container) .
	docker tag parrots-$(container):latest 864992358777.dkr.ecr.$(region).amazonaws.com/parrots-$(env)-$(container):latest
	docker push 864992358777.dkr.ecr.$(region).amazonaws.com/parrots-$(env)-$(container):latest