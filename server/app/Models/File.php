<?php
declare(strict_types=1);
namespace App\Models;
use Exception;
class File 
{
    public $error = "";
    public $httpStatus = 200;
    public $name = "";
    public function __construct(string $dir, array $file, string|null $oldFileName = null)
    {
        if(!is_null($oldFileName) && $oldFileName != "null") {
            $this->delete($dir, $oldFileName);
        }
        $this->move($dir, $file);
    }
    public function move(string $dir, array $file)
    {
        $validate = $this->validateFile($file);

        if (!$validate) {
            return false;
        }

        $name = $this->generateName($file['name']);
        $this->name = $name;
        $path = $dir.$name;
        if(!move_uploaded_file($file['tmp_name'], __DIR__ .'/../../storage'.$path)){
            $this->error = "An unexpected error occured while uploading file.";
            $this->httpStatus = 500;

            return false;
        }

        return true;
    }

    public function validateFile(array $file)
    {
        $acceptableFileTypes = ['image/png', 'image/jpeg', 'image/webp'];
        if (!in_array($file['type'], $acceptableFileTypes)) {
            $this->error = "An error occured on validating file. File type not supported.";
            $this->httpStatus = 415;
            return false;
        }

        if ($file['size'] > (4*1024*1024)) {
            $this->error = "An error occured on validating file. File is too big.";
            $this->httpStatus = 413;
            return false;
        }

        return true;
    }

    public function generateName(string $fileName) 
    {
        $name = explode('.', $fileName);
        $newName = sha1($name[0] . time() . random_bytes(6)) . '.' . $name[1];
        $this->name = $newName;
        return $newName;
    }

    public function delete(string $dir, string|null $oldFileName) {
        if (!unlink( __DIR__ .'/../../storage'.$dir.$oldFileName)) {
            $this->error = "An unexpected error occured while deleting old file.";
            $this->httpStatus = 500;
        }

        return true;
    }
}
