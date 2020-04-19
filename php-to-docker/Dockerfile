FROM composer:1.9.1 AS composer

FROM php:7.4.1-alpine AS buildenv

COPY --from=composer /usr/bin/composer /usr/bin/composer

RUN apk add --update nodejs npm && \
    npm update -g npm && \
    npm install -g grunt-cli && \
    npm install -g bower

RUN apk add --update ruby ruby-bundler ruby-dev ruby-rdoc build-base gcc && \
    gem install sass

RUN mkdir /app 
WORKDIR /app

# Copy npm dependencies
COPY package.json .
RUN npm install 

# Copy composer and download dependencies
COPY composer.json .
RUN composer install

# Copy bower and download dependencies
RUN apk add --update git
RUN echo '{ "allow_root": true }' > /root/.bowerrc
COPY bower.json .
RUN bower update 

# Copy all the remaining source code
COPY src/ /app/src
COPY Gruntfile.js .
RUN grunt build-all

# Create final image
FROM alpine:3.11.0

# Install packages 
RUN apk upgrade && apk --no-cache add php7 php7-fpm php7-json php7-openssl \
    nginx supervisor curl

# Configure nginx 
COPY config/nginx.conf /etc/nginx/nginx.conf

# Configure PHP-FPM 
COPY config/fpm-pool.conf /etc/php7/php-fpm.d/www.conf 
COPY config/php.ini /etc/php7/conf.d/zzz_custom.ini  

# Configure supervisord 
COPY config/supervisord.conf /etc/supervisor/conf.d/supervisord.conf

# Make sure files/folders needed by the processes are accessable when they run under the nobody user 
RUN chown -R nobody.nobody /run && \   
    chown -R nobody.nobody /var/lib/nginx && \
    chown -R nobody.nobody /var/log/nginx

# Setup document root 
RUN mkdir -p /var/www/html  

# Create cache directories
RUN mkdir /var/www/html/compilation_cache && chown nobody.nobody /var/www/html/compilation_cache && \
    mkdir /var/www/html/doctrine_cache && chown nobody.nobody /var/www/html/doctrine_cache

# Switch to use a non-root user from here on 
USER nobody

# Add application 
WORKDIR /var/www/html 
COPY --chown=nobody --from=buildenv /app/dist/ /var/www/html/

# Expose the port nginx is reachable on 
EXPOSE 8080  

# Let supervisord start nginx & php-fpm 
CMD ["/usr/bin/supervisord", "-c", "/etc/supervisor/conf.d/supervisord.conf"]  

# Configure a healthcheck to validate that everything is up & running 
HEALTHCHECK --timeout=10s CMD curl --silent --fail http://127.0.0.1:8080/fpm-ping
