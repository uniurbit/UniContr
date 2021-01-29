
# Installare docker 
- https://docs.docker.com/get-docker/

# Creare l'ambiente docker
- Entrare nella cartella ```cd .\unicontract-docker\```
- Eseguire ```docker-compose build```
- Eseguire ```docker-compose up -d```

# Configurare backend
- Entrare nella cartella ```cd .\unicontract-backend\```
- creare il file ```.env``` partendo da ```.env.example```
    - riportare le seguenti configurazioni per la connessione al database locale

    ```
    DB_CONNECTION=mysql
    DB_HOST=host.docker.internal
    DB_PORT=3308
    DB_DATABASE=UniContract
    DB_USERNAME=unicontr
    DB_PASSWORD=unicontr
    ```
    - configurare la connessione al database esterno oracle parametri ```DB_USERNAME_ORACLE, DB_PASSWORD_ORACLE, DB_TNS```

- eseguire ```docker-compose exec app php artisan key:generate``` 
- eseguire ```docker-compose exec app php artisan config:cache```
- eseguire ```docker-compose exec app php artisan migrate:fresh --seed```

# Aprire l'applicazione

- http://localhost:4200/
