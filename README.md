

## requirements

- java --version == java 21.0.6 2025-01-21 LTS
- node --version == v22.13.1
- docker


## development

- build each micrsoservice with `./mvnw -ntp -Pprod verify jib:dockerBuild`
- run `docker-compose up -d` to start all services


## steps to create this repository

- use https://start.jhipster.tech/jdl-studio/ to modify application jhipster-jdl.jdl
- jhipster import-jdl jhipster-jdl.jdl
- mkdir docker-compose and then `jhipster docker-compose`
- change </jib-maven-plugin.version> to 3.3.2
- acceptLicense() in MsSqlTestContainer.java
- for each application run `./mvnw -ntp -Pprod verify jib:dockerBuild`
- in docker-compose run `docker-compose run -d`



** to convert sql to jdl: https://github.com/Blackdread/sql-to-jdl