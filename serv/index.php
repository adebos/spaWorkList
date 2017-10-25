<?php

require 'Slim/Slim.php';

\Slim\Slim::registerAutoloader();

$app = new \Slim\Slim();

$app->get( '/list', function () use ($app) {

	$errocode = 0;
	if ( $errocode == 0 ) {

		$filename = "myfile.json";
		$handle = fopen($filename, "r"); //("r" - считывать "w" - создавать "a" - добовлять к тексту), мы создаем файл
		$contents = fread($handle, filesize($filename));
		fclose($handle);

		echo json_encode( $contents );
		$app->response->setStatus(200);
		$app->response['Content-Type'] = 'application/json';
		$app->response['Access-Control-Allow-Origin'] = '*';

	} else {
		echo json_encode(array(
				'status' => $status,
				'errorCode' => $errocode
			));
		$app->response->setStatus($errocode);
		$app->response['Content-Type'] = 'application/json';
	}
});

$app->options( '/update', function () use ($app) {
	$app->response->setStatus(204);
	$app->response['Access-Control-Allow-Origin'] = '*';
	$app->response['Access-Control-Allow-Headers'] = "content-type";
	$app->response['Content-Type'] = 'application/json';
});

$app->post( '/update', function () use ($app) {

	$paramValue = $app->request->post('json');

	$file = "myfile.json";
	unlink($file);
	$fp = fopen($file, "w"); // ("r" - считывать "w" - создавать "a" - добовлять к тексту), мы создаем файл
	fwrite($fp, $paramValue);
	fclose ($fp);

	echo json_encode( $paramValue );
	$app->response->setStatus(200);
	$app->response['Content-Type'] = 'application/json';
	$app->response['Access-Control-Allow-Origin'] = '*';
});

$app->run();