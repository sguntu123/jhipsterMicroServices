steps to create this repository

- use https://start.jhipster.tech/jdl-studio/ to modify application jhipster-jdl.jdl
- jhipster import-jdl jhipster-jdl.jdl
- mkdir docker-compose and then `jhipster docker-compose`
- change </jib-maven-plugin.version> to 3.3.2
- for each application run `./mvnw -ntp -Pprod verify jib:dockerBuild`
- in docker-compose run `docker-compose run -d`



** to convert sql to jdl: https://github.com/Blackdread/sql-to-jdl