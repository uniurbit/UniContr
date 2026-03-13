
# Installare docker 
- https://docs.docker.com/get-docker/

# Creare l'ambiente docker
- Entrare nella cartella ```cd .\unicontract-docker\```
- Eseguire ```docker-compose build```
- Eseguire ```docker-compose up -d```

# Configurare backend
- Entrare nella cartella ```cd .\unicontract-backend\```
- creare il file ```.env``` partendo da ```.env.example```
    - riportare le seguenti configurazioni per la connessione al database nella macchina host

    ```
    DB_CONNECTION=mysql
    DB_HOST=host.docker.internal    
    ```

    - riportare le seguenti configurazioni per utilizzare il database nel servizio db di Docker
    DB_CONNECTION=mysql
    DB_HOST=db
    DB_PORT=3306
    DB_DATABASE=unicontr
    DB_USERNAME=unicontr
    DB_PASSWORD=secret

    - configurare la connessione al database esterno oracle parametri ```DB_USERNAME_ORACLE, DB_PASSWORD_ORACLE, DB_TNS```

- eseguire ```docker-compose exec backend composer install``` 
- eseguire ```docker-compose exec backend php artisan key:generate``` 
- eseguire ```docker-compose exec backend php artisan config:cache```
- eseguire ```docker-compose exec backend php artisan migrate:fresh --seed```

# Aprire l'applicazione

- http://localhost:4200/
