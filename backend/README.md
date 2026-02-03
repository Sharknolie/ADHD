# ADHD Helper Backend (MySQL)

1) Create DB tables

```sql
-- Use backend/db/schema.sql
```

2) Configure database credentials

- Copy `src/main/resources/application.example.yml` to `src/main/resources/application.yml`
- Fill in `spring.datasource.username` and `spring.datasource.password`
  - Or set environment variables `DB_USERNAME` and `DB_PASSWORD`

3) Run

```bash
mvn spring-boot:run
```

API base: `http://localhost:8081/api`
