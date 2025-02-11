

## requirements

- java --version == java 21.0.6 2025-01-21 LTS
- node --version == v22.13.1
- docker


## development

- build each micrsoservice with `./mvnw -ntp -Pprod verify jib:dockerBuild`
- run `docker-compose up -d` to start all services
- go to localhost:8083
- connect to mssql with port 1435, user: `sa`, password: `yourStrong(!)Password`

troubleshooting:

- if you run into prettier errors, go to the project that has issues, and run `npm run lint:fix`
- if you run into other errors, check java + nodejs versions, restart docker


## steps to create this repository

- use https://start.jhipster.tech/jdl-studio/ to modify application jhipster-jdl.jdl
- jhipster import-jdl jhipster-jdl.jdl
- mkdir docker-compose and then `jhipster docker-compose`
- modify docker-compose.yml to only use one mssql service, set port to 1435
- change </jib-maven-plugin.version> to 3.3.2
- acceptLicense() in MsSqlTestContainer.java
- for each application run `./mvnw -ntp -Pprod verify jib:dockerBuild`
- in docker-compose run `docker-compose up -d`



** to convert sql to jdl: https://github.com/Blackdread/sql-to-jdl