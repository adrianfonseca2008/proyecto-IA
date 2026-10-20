@echo off
title Snake 3D Launcher
cd /d "%~dp0"
echo ========================================================
echo               INICIANDO SNAKE 3D
echo ========================================================
echo Abriendo Snake 3D en tu navegador...
echo.

:: Abre el archivo index.html en el navegador predeterminado
start "" "index.html"

echo El juego se ha abierto en tu navegador.
echo Si deseas ejecutarlo con un servidor web local (puerto 8080),
echo se mantendra activo mientras esta ventana este abierta.
echo.
echo Servidor en: http://localhost:8080
echo Presiona Ctrl+C para detener el servidor local.
echo.

node -e "const http=require('http'),fs=require('fs'),path=require('path');http.createServer((req,res)=>{let f=decodeURIComponent(req.url.split('?')[0]);if(f==='/')f='/index.html';let p=path.join('.',f);if(fs.existsSync(p)&&fs.statSync(p).isFile()){let ext=path.extname(p);let m={'js':'text/javascript','css':'text/css','html':'text/html','json':'application/json'}[ext.slice(1)]||'text/plain';res.writeHead(200,{'Content-Type':m});fs.createReadStream(p).pipe(res)}else{res.writeHead(404);res.end('Not Found')}}).listen(8080,()=>console.log('Servidor HTTP Node.js listo en http://localhost:8080'));"
