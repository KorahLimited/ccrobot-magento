# ccRobot for Magento 2

Integrate the [ccRobot](https://www.ccrobot.ai) chatbot into any Magento 2 site.

### Features
* Seamlessly integrate the ccRobot widget into your Magento 2 site
* Automatically pass customer names to ccRobot for a personalized experience
* Configure ccRobot widget directly from the Magento Admin Panel

### Installation
##### With Composer:
```
cd /your/magento2/path
composer require korah/ccrobot-magento-2:dev-master
bin/magento module:enable Korah_CcRobot
bin/magento setup:upgrade
bin/magento setup:di:compile
bin/magento setup:static-content:deploy
bin/magento cache:clean
```
##### With .tar.gz:
```
tar -zxf korah-ccrobot-magento-2-1.0.0.tar.gz -C /your/magento2/path/app/code
bin/magento module:enable Korah_CcRobot
bin/magento setup:upgrade
bin/magento setup:di:compile
bin/magento setup:static-content:deploy
bin/magento cache:clean
```

### Post Installation
##### In the Magento Admin Panel
1. go to **Stores** > **Settings** > **Configuration**
2. Select **Korah** > **ccRobot**
3. Set **Enable Module** to **Yes**
4. Configure the other settings as needed
5. Click on **Save Config**
##### Then in the CLI
```
cd /your/magento2/path
bin/magento setup:static-content:deploy
bin/magento cache:clean
```