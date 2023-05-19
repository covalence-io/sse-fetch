import { fetchEventSource } from "@microsoft/fetch-event-source";

(function () {
    const btn = <HTMLButtonElement>document.getElementById('stream');
    const messages = <HTMLElement>document.getElementById('messages');

    function showMessages(message: string) {
        if (!messages) {
            return;
        }

        messages.textContent += `\n${message}`;
        messages.scrollTop = messages.scrollHeight;
    }

    if (!btn) {
        console.log('You messed up - no button :(');
        return;
    }

    btn.addEventListener('click', async () => {
        const ctrl = new AbortController();

        try {
            await fetchEventSource('/api/v1/users/stats', {
                method: 'POST',
                headers: {},
                signal: ctrl.signal,
                openWhenHidden: true,
                body: JSON.stringify({
                    id: 1,
                }),
                onopen: async (res) => {
                    const contentType = res.headers.get('content-type');

                    if (!!contentType && contentType.indexOf('application/json') >= 0) {
                        throw await res.json();
                    }
                },
                onerror: (e) => {
                    if (!!e) {
                        console.log('Fetch onerror', e);
                        // do something with this error
                    }

                    // ctrl.abort();

                    throw e;
                },
                onmessage: async (ev) => {
                    const data = ev.data;

                    if (!data) {
                        return;
                    }

                    try {
                        const d = JSON.parse(data);

                        showMessages(d.value);
                    } catch (e) {
                        console.log('Fetch onmessage error', e);
                    }
                },
            })
        } catch (e) {
            console.log('Error', e);
        }
    });
})();