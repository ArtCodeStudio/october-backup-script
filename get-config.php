<?php

    $root = $argv[1];

    require_once $root . '/bootstrap/autoload.php';

    // Looing for .env at the root directory
    $app = require_once $root . '/bootstrap/app.php';
    $env = $app->loadEnvironmentFrom($root . '/.env');

    $database = require_once $root . '/config/database.php';
    $app = require_once $root . '/config/app.php';
    $cms = require_once $root . '/config/cms.php';

    $config = [
        'database' => $database,
        'app' => $app,
        'cms' => $cms,
    ];

    $configJsonStr = json_encode($config);
    echo $configJsonStr;
?>
