(function () {
    'use strict';

    var ENDPOINT = '/bin/employeehub/weather';

    function glyphFor(desc) {
        var d = (desc || '').toLowerCase();
        if (d.indexOf('clear') !== -1) { return '☀️'; }
        if (d.indexOf('thunder') !== -1) { return '⛈️'; }
        if (d.indexOf('snow') !== -1) { return '❄️'; }
        if (d.indexOf('rain') !== -1 || d.indexOf('drizzle') !== -1 || d.indexOf('shower') !== -1) { return '🌧️'; }
        if (d.indexOf('fog') !== -1) { return '🌫️'; }
        if (d.indexOf('cloud') !== -1) { return '⛅'; }
        return '🌡️';
    }

    function fetchWeather(widget) {
        var input = widget.querySelector('.eh-weather__input');
        var result = widget.querySelector('.eh-weather__result');
        var glyph = widget.querySelector('.eh-weather__glyph');
        var btn = widget.querySelector('.eh-weather__btn');
        var city = input ? input.value.trim() : '';

        widget.classList.add('is-loading');
        if (btn) { btn.disabled = true; }
        result.innerHTML = '<div class="eh-weather__loader"><span></span><span></span><span></span></div>';

        fetch(ENDPOINT + '?city=' + encodeURIComponent(city), {
            headers: { 'Accept': 'application/json' }
        })
            .then(function (res) { return res.json(); })
            .then(function (data) {
                widget.classList.remove('is-loading');
                if (btn) { btn.disabled = false; }
                if (!data.success) {
                    result.innerHTML = '<p class="eh-weather__error">' +
                        (data.message || 'Unable to fetch weather') + '</p>';
                    return;
                }
                var icon = glyphFor(data.description);
                if (glyph) { glyph.textContent = icon; }
                result.innerHTML =
                    '<div class="eh-weather__reading">' +
                        '<div class="eh-weather__temp">' + Math.round(data.temperature) +
                            '<span class="eh-weather__unit">°C</span></div>' +
                        '<div class="eh-weather__meta">' +
                            '<span class="eh-weather__city">' + data.city + '</span>' +
                            '<span class="eh-weather__desc">' + icon + ' ' + data.description + '</span>' +
                        '</div>' +
                    '</div>' +
                    '<div class="eh-weather__chips">' +
                        '<span class="eh-weather__chip">💨 ' + data.windspeed + ' km/h wind</span>' +
                        '<span class="eh-weather__chip">📍 Updated just now</span>' +
                    '</div>';
            })
            .catch(function () {
                widget.classList.remove('is-loading');
                if (btn) { btn.disabled = false; }
                result.innerHTML = '<p class="eh-weather__error">Network error. Try again.</p>';
            });
    }

    function init() {
        document.querySelectorAll('.eh-weather').forEach(function (widget) {
            var btn = widget.querySelector('.eh-weather__btn');
            var input = widget.querySelector('.eh-weather__input');
            if (btn) {
                btn.addEventListener('click', function () { fetchWeather(widget); });
            }
            if (input) {
                input.addEventListener('keydown', function (e) {
                    if (e.key === 'Enter') { fetchWeather(widget); }
                });
            }
        });
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
