<?php
header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['success' => false, 'message' => 'Метод не разрешен']);
    exit;
}

$name = isset($_POST['name']) ? trim($_POST['name']) : '';
$phone = isset($_POST['phone']) ? trim($_POST['phone']) : '';
$email = isset($_POST['email']) ? trim($_POST['email']) : '';
$message = isset($_POST['message']) ? trim($_POST['message']) : '';
$agree = isset($_POST['agree']) ? true : false;

if (empty($name) || empty($phone) || empty($message)) {
    echo json_encode(['success' => false, 'message' => 'Заполните все обязательные поля']);
    exit;
}

if (!$agree) {
    echo json_encode(['success' => false, 'message' => 'Необходимо дать согласие на обработку персональных данных']);
    exit;
}

$to = 'info@technics-m.ru';
$subject = '=?UTF-8?B?' . base64_encode('Запрос с сайта ТЕХНИКА-М') . '?=';

$emailBody = "Новый запрос с сайта ТЕХНИКА-М\n\n";
$emailBody .= "Имя: " . $name . "\n";
$emailBody .= "Телефон: " . $phone . "\n";
$emailBody .= "E-mail: " . ($email ? $email : 'Не указан') . "\n\n";
$emailBody .= "Сообщение:\n" . $message . "\n\n";
$emailBody .= "Согласие на обработку персональных данных: Да\n";
$emailBody .= "Дата отправки: " . date('d.m.Y H:i:s') . "\n";
$emailBody .= "IP адрес: " . $_SERVER['REMOTE_ADDR'] . "\n";

$headers = "MIME-Version: 1.0\r\n";
$headers .= "Content-Type: text/plain; charset=UTF-8\r\n";
$headers .= "Content-Transfer-Encoding: 8bit\r\n";
$headers .= "From: =?UTF-8?B?" . base64_encode('Сайт ТЕХНИКА-М') . "?= <info@technics-m.ru>\r\n";
$headers .= "Reply-To: " . ($email ? $email : 'info@technics-m.ru') . "\r\n";
$headers .= "X-Mailer: PHP/" . phpversion() . "\r\n";
$headers .= "X-Priority: 3\r\n";

$mailSent = @mail($to, $subject, $emailBody, $headers);

if ($mailSent) {
    echo json_encode(['success' => true, 'message' => 'Сообщение успешно отправлено!']);
} else {
    echo json_encode(['success' => false, 'message' => 'Ошибка при отправке сообщения. Попробуйте позже.']);
}
?>

