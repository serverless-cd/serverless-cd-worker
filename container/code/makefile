latest_tag=registry.cn-hangzhou.aliyuncs.com/serverless-devs/serverless-cd:latest

build:
	docker build -t ${latest_tag} -f Dockerfile .

push:
	docker push ${latest_tag}