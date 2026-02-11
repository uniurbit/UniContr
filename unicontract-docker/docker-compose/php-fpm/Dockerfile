FROM php:8.2-fpm

LABEL Name=unicontr Version=2.0.0

ARG user
ARG uid
ARG basepath

RUN apt-get update && apt-get install -y --no-install-recommends \
    apt-utils \
    gnupg \
    dirmngr \
    ca-certificates \
    && apt-get update

RUN curl -O http://ftp.debian.org/debian/pool/main/liba/libaio/libaio1_0.3.112-9_amd64.deb \
    && dpkg -i libaio1_0.3.112-9_amd64.deb

RUN apt-get update && apt-get install -y \
    libfreetype6-dev \
    libjpeg62-turbo-dev \
    libpng-dev \
    libwebp-dev \
    libxpm-dev \
    git \
    curl \
    unzip \
    libaio1 \
    libpng-dev \
    libonig-dev \
    libxml2-dev \
    zip \
    libzip-dev \
    fontconfig \
    libfreetype6 \
    libjpeg62-turbo \
    libxrender1 \
    xfonts-75dpi \
    xfonts-base 
   

# Clear cache
RUN apt-get clean && rm -rf /var/lib/apt/lists/*  

# ZIP
RUN  docker-php-ext-install zip

RUN docker-php-ext-configure gd \
    --with-freetype \
    --with-jpeg \
    --with-webp \
    --with-xpm 

# PHP extensions
RUN docker-php-ext-install \
    pdo_mysql \
    mbstring \
    exif \
    pcntl \
    bcmath \
    gd \
    soap

# ADD Instantclient
ADD lib/instantclient-basic-linux.x64-19.26.0.0.0dbru.zip /tmp/
ADD lib/instantclient-sdk-linux.x64-19.26.0.0.0dbru.zip /tmp/

# Install Oracle Instantclient
RUN mkdir /opt/oracle
RUN cd /opt/oracle 
RUN unzip -o /tmp/instantclient-basic-linux.x64-19.26.0.0.0dbru.zip -d /opt/oracle
RUN unzip -o /tmp/instantclient-sdk-linux.x64-19.26.0.0.0dbru.zip -d /opt/oracle 
RUN ln -sf /opt/oracle/instantclient_19_26/libclntsh.so.19.1 /opt/oracle/instantclient_19_26/libclntsh.so
RUN ln -sf /opt/oracle/instantclient_19_26/libclntshcore.so.19.1 /opt/oracle/instantclient_19_26/libclntshcore.so
RUN ln -sf /opt/oracle/instantclient_19_26/libocci.so.19.1 /opt/oracle/instantclient_19_26/libocci.so 
RUN rm -rf /opt/oracle/*.zip

ENV LD_LIBRARY_PATH  /opt/oracle/instantclient_19_26:${LD_LIBRARY_PATH}

# Install Oracle extensions pecl install oci8-2.2.0
RUN echo 'instantclient,/opt/oracle/instantclient_19_26/' | pecl install oci8-3.4.1  \ 
      && docker-php-ext-enable \
               oci8 \ 
       && docker-php-ext-configure pdo_oci --with-pdo-oci=instantclient,/opt/oracle/instantclient_19_26,19.1 \
       && docker-php-ext-install \
               pdo_oci 

# Get latest Composer
COPY --from=composer:2 /usr/bin/composer /usr/bin/composer

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