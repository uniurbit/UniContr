FROM php:7.3-fpm
LABEL Name=unicontr Version=0.0.1

# Arguments defined in docker-compose.yml
ARG user
ARG uid
ARG basepath

# Install system dependencies
RUN apt-get update && apt-get install -y \
    git \
    curl \
    libaio1 \
    libpng-dev \
    libonig-dev \
    libxml2-dev \
    zip \
    libzip-dev\ 
    fontconfig\
    libfreetype6\
    libjpeg62-turbo\
    libxrender1\
    xfonts-75dpi\
    xfonts-base

    
#whtmltopdf 0.12.6.1 (with patched qt)
RUN curl "https://github.com/wkhtmltopdf/packaging/releases/download/0.12.6-1/wkhtmltox_0.12.6-1.buster_amd64.deb" -L -o "wkhtmltopdf.deb"
RUN dpkg -i wkhtmltopdf.deb
RUN dpkg --configure -a
RUN cp /usr/local/bin/wkhtmltopdf /usr/bin/
RUN cp /usr/local/bin/wkhtmltoimage /usr/bin/

# Clear cache
RUN apt-get clean && rm -rf /var/lib/apt/lists/*  


#lib-zip
RUN docker-php-ext-configure zip --with-libzip \
    && docker-php-ext-install zip

# Install PHP extensions
RUN docker-php-ext-install pdo_mysql mbstring exif pcntl bcmath gd soap 

# Oracle instantclient
ADD /docker-compose/php-fpm/lib/instantclient-basic-linux.x64-12.1.0.2.0.zip /tmp/
ADD /docker-compose/php-fpm/lib/instantclient-sdk-linux.x64-12.1.0.2.0.zip /tmp/
ADD /docker-compose/php-fpm/lib/instantclient-sqlplus-linux.x64-12.1.0.2.0.zip /tmp/

# Install Oracle Instantclient
RUN mkdir /opt/oracle \
    && cd /opt/oracle \
    && unzip /tmp/instantclient-basic-linux.x64-12.1.0.2.0.zip -d /opt/oracle \
    && unzip /tmp/instantclient-sdk-linux.x64-12.1.0.2.0.zip -d /opt/oracle \
    && unzip /tmp/instantclient-sqlplus-linux.x64-12.1.0.2.0.zip -d /opt/oracle/ \
    && ln -s /opt/oracle/instantclient_12_1/libclntsh.so.12.1 /opt/oracle/instantclient_12_1/libclntsh.so \
    && ln -s /opt/oracle/instantclient_12_1/libclntshcore.so.12.1 /opt/oracle/instantclient_12_1/libclntshcore.so \
    && ln -s /opt/oracle/instantclient_12_1/libocci.so.12.1 /opt/oracle/instantclient_12_1/libocci.so \
    && rm -rf /opt/oracle/*.zip

ENV LD_LIBRARY_PATH  /opt/oracle/instantclient_12_1:${LD_LIBRARY_PATH}

# Install Oracle extensions
RUN echo 'instantclient,/opt/oracle/instantclient_12_1/' | pecl install oci8-2.2.0 \ 
      && docker-php-ext-enable \
               oci8 \ 
       && docker-php-ext-configure pdo_oci --with-pdo-oci=instantclient,/opt/oracle/instantclient_12_1,12.1 \
       && docker-php-ext-install \
               pdo_oci 

# Get latest Composer
COPY --from=composer:1.9.3 /usr/bin/composer /usr/bin/composer

# Create system user to run Composer and Artisan Commands
RUN useradd -G www-data,root -u $uid -d /home/$user $user
RUN mkdir -p /home/$user/.composer && \
    chown -R $user:$user /home/$user


#RUN chown -R $user:www-data ${basepath}storage
#RUN chown -R $user:www-data ${basepath}bootstrap/cache

RUN echo $basepath
# Set working directory
RUN mkdir -p ${basepath}
RUN chown -R $user:$user /var/www

WORKDIR $basepath

RUN echo $basepath
USER $user


# # Expose port 9000 and start php-fpm server
# EXPOSE 9000
# CMD ["php-fpm"]