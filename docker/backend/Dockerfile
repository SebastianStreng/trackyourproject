FROM php:8.1-apache

# Enable Apache mod_rewrite and mod_headers (required for .htaccess)
RUN a2enmod rewrite headers

# Install mysqli extension (required by connect.php)
RUN docker-php-ext-install mysqli && docker-php-ext-enable mysqli

# Configure Apache to allow .htaccess overrides
RUN sed -i '/<Directory \/var\/www\/>/,/<\/Directory>/ s/AllowOverride None/AllowOverride All/' /etc/apache2/apache2.conf

# Copy PHP backend files to Apache document root
COPY ["src/Backend PHP Files/", "/var/www/html/"]

# Set proper permissions
RUN chown -R www-data:www-data /var/www/html/ \
    && chmod -R 755 /var/www/html/

EXPOSE 80
