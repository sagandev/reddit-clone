<?php
declare(strict_types=1);
namespace App\Models;
use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\SMTP;
use PHPMailer\PHPMailer\Exception;
use Dotenv\Dotenv;

$dotenv = Dotenv::createImmutable(__DIR__ . "/../../");
$dotenv->load();
class Mailer
{
    public string $Host;
    public string $Username;
    public string $Password;
    public int $Port;
    public $mail;
    public $error;

    public function __construct()
    {
        $this->Host = $_ENV['MAIL_HOST'];
        $this->Username = $_ENV['MAIL_USERNAME'];
        $this->Password = $_ENV['MAIL_PASSWORD'];
        $this->Port = (int) $_ENV['MAIL_PORT'];

        $this->mail = new PHPMailer(true);     
        $this->connectionSetup();
    }

    public function connectionSetup()
    {
        $this->mail->SMTPDebug = SMTP::DEBUG_SERVER;                      //Enable verbose debug output
        $this->mail->isSMTP();                                            //Send using SMTP
        $this->mail->Host       = $this->Host;                     //Set the SMTP server to send through
        $this->mail->SMTPAuth   = true;                                   //Enable SMTP authentication
        $this->mail->Username   = $this->Username;                     //SMTP username
        $this->mail->Password   = $this->Password;                               //SMTP password
        $this->mail->SMTPSecure = PHPMailer::ENCRYPTION_STARTTLS;            //Enable implicit TLS encryption
        $this->mail->Port       = $this->Port;   
    }

    public function send(string $receiverMail, string $subject, string $body, string $altBody = ""): bool
    {
        try {
            $this->mail->setFrom($this->Username, '[No-reply] sagandev.pl');
            $this->mail->addAddress($receiverMail);
            $this->mail->isHTML(true); 
            $this->mail->Subject = $subject;
            $this->mail->Body    = $body;
            $this->mail->AltBody = $altBody;
            $this->mail->send();
            
        } catch (Exception $e){
            $this->error = $e->getMessage();
            throw new Exception($e->getMessage());
        }

        return true;
    }
}