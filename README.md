# Daniil IoT Project

Лёгкий IoT-проект для управления лампами через веб-интерфейс, backend API, WebSocket и MQTT-брокер.

## Что внутри

-  — UI для отображения состояния ламп и переключения реле.
-  — API + WebSocket сервер + интеграция с MQTT.
-  — MQTT-брокер () с авторизацией.
-  — reverse proxy + Basic Auth + проксирование  и .
-  — запуск всех сервисов одной командой.

## Архитектура



## Требования

- Docker
- Docker Compose (v2)

## Быстрый старт

1. Создать/проверить  (пример):

SHELL=/bin/bash
WSL2_GUI_APPS_ENABLED=1
WSL_DISTRO_NAME=Ubuntu
NAME=DESKTOP-2TNVKGG
PWD=/home/vadim/Iot-api
LOGNAME=vadim
HOME=/home/vadim
LANG=C.UTF-8
WSL_INTEROP=/run/WSL/78288_interop
WAYLAND_DISPLAY=wayland-0
TERM=xterm-256color
USER=vadim
DISPLAY=:0
SHLVL=1
XDG_RUNTIME_DIR=/run/user/1000/
WSLENV=
PATH=/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin:/usr/games:/usr/local/games:/usr/lib/wsl/lib:/mnt/c/Users/bobro/.codex/tmp/arg0/codex-arg0IuYTny:/mnt/c/Program Files/SqlCmd/:/mnt/c/Program Files (x86)/Common Files/Oracle/Java/javapath:/mnt/c/Python310/Scripts/:/mnt/c/Python310/:/mnt/c/Windows/system32:/mnt/c/Windows:/mnt/c/Windows/System32/Wbem:/mnt/c/Windows/System32/WindowsPowerShell/v1.0/:/mnt/c/Windows/System32/OpenSSH/:/mnt/c/Program Files (x86)/NVIDIA Corporation/PhysX/Common:/mnt/c/Users/bobro/AppData/Roaming/nvm:/mnt/c/Program Files/nodejs:/mnt/c/php8.2:/mnt/c/Program Files/Microsoft SQL Server/150/Tools/Binn/:/mnt/c/Program Files/nodejs/:/mnt/c/ProgramData/chocolatey/bin:/mnt/c/composer:/mnt/c/Program Files/Git/cmd:/mnt/c/WINDOWS/system32:/mnt/c/WINDOWS:/mnt/c/WINDOWS/System32/Wbem:/mnt/c/WINDOWS/System32/WindowsPowerShell/v1.0/:/mnt/c/WINDOWS/System32/OpenSSH/:/mnt/c/Program Files (x86)/dotnet/:/mnt/c/stripe:/mnt/c/Program Files/Go/bin:/mnt/c/Program Files/Common Files/Autodesk Shared/:/mnt/c/WINDOWS/system32:/mnt/c/WINDOWS:/mnt/c/WINDOWS/System32/Wbem:/mnt/c/WINDOWS/System32/WindowsPowerShell/v1.0/:/mnt/c/WINDOWS/System32/OpenSSH/:/mnt/c/Program Files/NVIDIA Corporation/NVIDIA app/NvDLISR:/mnt/c/Users/bobro/AppData/Local/Programs/cursor/resources/app/bin:/mnt/c/Users/bobro/.config/herd-lite/bin:/mnt/c/Users/bobro/AppData/Local/Programs/Python/Python311/Scripts/:/mnt/c/Users/bobro/AppData/Local/Programs/Python/Python311/:/mnt/c/Users/bobro/AppData/Local/Microsoft/WindowsApps:/mnt/c/Users/bobro/AppData/Roaming/npm:/mnt/c/Users/bobro/AppData/Roaming/Composer/vendor/bin:/mnt/c/Program Files/JetBrains/PhpStorm 2024.3.1.1/bin:/mnt/c/Program Files/JetBrains/PyCharm Community Edition 2022.3/bin:/mnt/c/Users/bobro/AppData/Local/Programs/Microsoft VS Code/bin:/mnt/c/Program Files/JetBrains/DataGrip 2023.1.1/bin:/mnt/c/Users/bobro/go/bin:/mnt/c/Program Files/JetBrains/GoLand 2024.3.1/bin:/mnt/c/Program Files/JetBrains/PhpStorm 2025.2/bin:/mnt/c/Users/bobro/AppData/Local/Programs/cursor/resources/app/bin:/mnt/c/Users/bobro/AppData/Local/OpenAI/Codex/bin/ada252862d154cdd:/mnt/c/Program Files/WindowsApps/OpenAI.Codex_26.519.11010.0_x64__2p2nqsd0c76g0/app/resources
DBUS_SESSION_BUS_ADDRESS=unix:path=/run/user/1000/bus
HOSTTYPE=x86_64
PULSE_SERVER=unix:/mnt/wslg/PulseServer
_=/usr/bin/env

2. Запустить проект:



3. Открыть в браузере:

- 

Nginx запросит Basic Auth (логин/пароль из ).

## Остановка



## Полезные команды

### Пересобрать и перезапустить



### Посмотреть логи всех сервисов



### Логи конкретного сервиса



### Проверить статус контейнеров



### Применить изменения без полной пересборки (если образ не менялся)



## API и WebSocket

### API

-  — проверка доступности backend.

### WebSocket

- endpoint: 
- события:
  -  — начальные состояния устройств
  -  — обновление состояния устройства
  -  — команда переключения реле

## MQTT

- broker: 
- auth: логин/пароль из 
- topics:
  -  — входящие статусы устройств
  -  — команды для устройств

## Безопасность

- Внешний доступ закрыт Basic Auth на уровне Nginx.
- Mosquitto работает без анонимного доступа ().
- Не храните боевые пароли в git; используйте локальные секреты/переменные окружения.

## Структура проекта



## Кратко о работе системы

1. Браузер подключается к .
2. Nginx отдает frontend и проксирует  в backend.
3. Backend подписывается на MQTT статусы и отправляет обновления в UI через WebSocket.
4. При нажатии на выключатель UI отправляет , backend публикует MQTT-команду.
5. Подтвержденный статус устройства возвращается в UI через MQTT -> backend -> WebSocket.

---

Если нужно, добавлю отдельный раздел с командами для разработки без Docker.
