const MACRODROID_ID = '20517ba0-d5f2-42f4-b0de-5d796a375c35';
const NTFY_TOPIC = 'tablet-vol-20517ba0';

document.addEventListener('DOMContentLoaded', () => {
    const volumeSlider = document.getElementById('volumeSlider');
    const volumeValue = document.getElementById('volumeValue');
    const btnMute = document.getElementById('btnMute');
    const btnSpotify = document.getElementById('btnSpotify');
    const btnClock = document.getElementById('btnClock');
    const btnPomodoro = document.getElementById('btnPomodoro');
    const btnTurnOn = document.getElementById('btnTurnOn');
    const btnTurnOff = document.getElementById('btnTurnOff');
    const toast = document.getElementById('toast');
    let toastTimeout;

    let isDragging = false;

    // --- Interfaz de notificaciones (Toast) ---
    const showToast = (message, type = 'success') => {
        toast.textContent = message;
        toast.className = `toast show ${type}`;

        clearTimeout(toastTimeout);
        toastTimeout = setTimeout(() => {
            toast.classList.remove('show');
        }, 3000);
    };

    // --- Salida de Comandos a MacroDroid ---
    const sendWebhook = async (endpoint) => {
        const url = `https://trigger.macrodroid.com/${MACRODROID_ID}/${endpoint}`;
        try {
            await fetch(url, { method: 'GET', mode: 'no-cors' });
            return true;
        } catch (error) {
            console.error('Error enviando webhook:', error);
            showToast('❌ Error al enviar comando', 'error');
            return false;
        }
    };

    // --- Eventos Lógica de Volumen ---
    // Detectar arrastre (Regla de oro: No actualizar UI desde NTFY si isDragging es true)
    volumeSlider.addEventListener('mousedown', () => isDragging = true);
    volumeSlider.addEventListener('touchstart', () => isDragging = true);

    // Al soltar el click o el dedo
    volumeSlider.addEventListener('mouseup', () => { isDragging = false; });
    volumeSlider.addEventListener('touchend', () => { isDragging = false; });

    // Actualización visual durante el arrastre local
    volumeSlider.addEventListener('input', (e) => {
        volumeValue.textContent = `${e.target.value}%`;
    });

    // Envío del cambio al soltar el slider
    volumeSlider.addEventListener('change', async (e) => {
        const value = e.target.value;
        const success = await sendWebhook(`set_volume?nivel=${value}`);
        if (success) {
            showToast(`🔊 Volumen ajustado a ${value}%`);
        }
    });

    // --- Eventos Botones ---
    btnMute.addEventListener('click', async () => {
        const success = await sendWebhook('vol_mute');
        if (success) {
            showToast('🔇 Comando Mutear enviado');
            btnMute.style.transform = 'scale(0.95)';
            setTimeout(() => btnMute.style.transform = '', 100);
        }
    });

    btnSpotify.addEventListener('click', async () => {
        const success = await sendWebhook('open_spotify');
        if (success) {
            showToast('🎵 Comando lanzado: Abrir Spotify');
            btnSpotify.style.transform = 'scale(0.95)';
            setTimeout(() => btnSpotify.style.transform = '', 100);
        }
    });

    btnClock.addEventListener('click', async () => {
        const success = await sendWebhook('open_clock');
        if (success) {
            showToast('⏰ Comando lanzado: Abrir Reloj');
            btnClock.style.transform = 'scale(0.95)';
            setTimeout(() => btnClock.style.transform = '', 100);
        }
    });

    btnPomodoro.addEventListener('click', async () => {
        const success = await sendWebhook('open_pomodoro');
        if (success) {
            showToast('🍅 Comando lanzado: Iniciar Pomodoro');
            btnPomodoro.style.transform = 'scale(0.95)';
            setTimeout(() => btnPomodoro.style.transform = '', 100);
        }
    });

    btnTurnOn.addEventListener('click', async () => {
        const success = await sendWebhook('turn_on');
        if (success) {
            showToast('☀️ Pantalla encendida');
            btnTurnOn.style.transform = 'scale(0.95)';
            setTimeout(() => btnTurnOn.style.transform = '', 100);
        }
    });

    btnTurnOff.addEventListener('click', async () => {
        const success = await sendWebhook('turn_off');
        if (success) {
            showToast('🌙 Pantalla apagada');
            btnTurnOff.style.transform = 'scale(0.95)';
            setTimeout(() => btnTurnOff.style.transform = '', 100);
        }
    });

    // --- Entrada Sincronización desde Tablet vía Ntfy.sh (Server-Sent Events) ---
    const eventSource = new EventSource(`https://ntfy.sh/${NTFY_TOPIC}/sse`);

    eventSource.onmessage = (event) => {
        let volumeStr = event.data;

        // Ntfy.sh suele envolver el mensaje real en un objeto JSON con el tipo de evento
        try {
            const parsedData = JSON.parse(event.data);
            if (parsedData.event === 'message') {
                volumeStr = parsedData.message; // Aquí obtenemos el string enviado por POST
            } else {
                return; // Ignoramos eventos de conectividad como 'open', 'keepalive', etc.
            }
        } catch (e) {
            // Si el JSON falla, significa que el servidor envió el dato directo 
            // como texto plano (fallback seguro, tal como lo solicitaste).
        }

        // Convertimos a entero
        const newLevel = parseInt(volumeStr, 10);

        // Validamos si es un número correcto
        if (!isNaN(newLevel)) {
            // REGRA DE ORO: Solo actualizar visualmente si NO interviene el usuario
            if (!isDragging && newLevel.toString() !== volumeSlider.value) {
                volumeSlider.value = newLevel;
                volumeValue.textContent = `${newLevel}%`;
            }
        }
    };

    eventSource.onerror = (error) => {
        console.error('Error conectando con Ntfy.sh EventSource:', error);
    };
});
