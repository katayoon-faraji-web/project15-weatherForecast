const apikey = 'f2173df1f9ef0d3dc7f4c1ecaeed7e3e'
let search_input = document.getElementById('search_input')
let search_btn = document.getElementById('search_btn')
let location_name = document.getElementById('location_name')
let _time = document.getElementById('time')
let _date = document.getElementById('date')
let img_wearther_today = document.getElementById('img_wearther_today')
let today_weather = document.getElementById('today_weather')
let humidity = document.getElementById('humidity')
let AirPressure = document.getElementById('AirPressure')
let WindSpeed = document.getElementById('WindSpeed')
let today_temperature = document.getElementById('today_temperature')
let tonight_temperature = document.getElementById('tonight_temperature')
let sunrise = document.getElementById('sunrise')
let sunset = document.getElementById('sunset')
let moonrise = document.getElementById('moonrise')
let moonset = document.getElementById('moonset')
let hourly_box = document.getElementById('hourly_box')
let daily_box = document.getElementById('daily_box')
let get_started_btn = document.getElementById('get_started')
let firstpage = document.getElementById('firstpage')

let lon = ''
let lat = ''
let crd = {}
let cityValue = search_input.value
const options = {
    enableHighAccuracy: true,
    timeout: 5000,
    maximumAge: 0,
};

function success(pos) {
    crd = pos.coords;
    if(cityValue==''){
        lon =  crd.latitude
        lat =  crd.longitude
        search_btn.click()
    }
}

function error(err) {
    cityValue='tehran'
    search_btn.click()
    console.warn(`ERROR(${err.code}): ${err.message}`);
}

navigator.geolocation.getCurrentPosition(success, error, options);

get_started_btn.addEventListener('click',()=>{
    firstpage.style.transform = 'scale(0)'
})

search_btn.addEventListener('click',()=>{
    _reset()
    if(search_input.value==''){cityValue = 'tehran'}
    else{cityValue = search_input.value}
    fetch(`https://api.openweathermap.org/data/2.5/weather?q=${cityValue}&appid=${apikey}&units=metric`)
    .then(res => res.json())
    .then(val => {
        lon =  val.coord.lon
        lat =  val.coord.lat
        fetch(`https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&exclude=minutely&units=metric&appid=3cb1e3bc09d345e92039e64c76ec688d`)
        .then(response => response.json())
        .then(data =>{
            location_name.innerHTML =  (data.timezone.split('/'))[1]
            let dt = data.current.dt;
            myinterval = setInterval(() => {
                let time_now = moment().format('LT'); 
                let date_now = moment().format('LL'); 
                _time.innerHTML = time_now
                _date.innerHTML = date_now
            }, 1000);

            const weather = {
                id:data.current.weather[0].id,
                des:data.current.weather[0].description,
            }
            // https://openweathermap.org/weather-conditions******************
            let x = check_weather(weather)
            img_wearther_today.innerHTML = x
            today_weather.innerHTML = weather.des
            humidity.innerHTML = data.current.humidity
            AirPressure.innerHTML = data.current.pressure
            WindSpeed.innerHTML = data.current.wind_speed
            today_temperature.innerHTML = data.daily[0].temp.day +' °C'
            tonight_temperature.innerHTML = data.daily[0].temp.night +' °C'
            sunrise.innerHTML = moment((data.daily[0].sunrise)*1000).format('LT')
            sunset.innerHTML = moment((data.daily[0].sunset)*1000).format('LT')
            moonrise.innerHTML = moment((data.daily[0].moonrise)*1000).format('LT')
            moonset.innerHTML = moment((data.daily[0].moonset)*1000).format('LT')

            // ********hourly forecast**********
            let all_hours = data.hourly
            let count = 0
            let countt = 0
            for(let count=0;count<=(all_hours.length);count+=2){
                const weather_forecast_hourly = {
                    id:all_hours[count].weather[0].id,
                }
                hourly_box.innerHTML += `
                <div class="w-[100px] h-[200px] flex flex-wrap justify-center content-center items-center bg-[#181818a] lg:mx-2">
                    <span class=" text-white text-[20px] text-start w-full flex justify-center items-center">${moment((all_hours[count].dt)*1000).format('LT')}</span>
                    <span class="img_hourly text-white text-[15px] text-start w-[40px] lg:w-[60px] flex justify-center items-center my-4">weather</span>
                    <span class= "text-white text-[20px] text-start w-full flex justify-center items-center">${all_hours[count].weather[0].description}</span>
                </div>
                <span class="line2  hidden lg:flex"></span>
`
                let img_hourly = document.querySelectorAll('.img_hourly')
                let p = check_weather(weather_forecast_hourly)
                img_hourly[countt].innerHTML = p
                countt++ 
                console.log(countt);
                if(count==16){
                    break;
                } 
            }

            // ********daily forecast**********
            let all_days = data.daily
            for(let counttt=1;counttt<=(all_days.length);counttt++){
                const weather_forecast_daily = {
                    id:all_days[counttt].weather[0].id,
                }
                daily_box.innerHTML += `
                <div class=" w-full h-[90px] flex  justify-between content-center items-center bg-[#181818a] mx-2">
                    <span class="text-white text-[20px] text-start flex justify-center items-center">${moment((all_days[counttt].dt)*1000).format('dddd')}</span>
                    <span class="img_daily text-white text-[15px] text-start w-[40px] lg:w-[60px] flex justify-center items-center my-4">weather</span>
                    <span class="text-white text-[20px] text-start justify-center items-center hidden lg:flex">${all_days[counttt].weather[0].description}</span>
                    <span class="text-white text-[20px] text-start justify-center items-center hidden lg:flex">${all_days[counttt].temp.day} °C</span>

                </div> `
                let img_daily = document.querySelectorAll('.img_daily')
                let p = check_weather(weather_forecast_daily)
                img_daily[counttt-1].innerHTML = p                        
            }
        })
    }) 
})

function check_weather(weather){
    if (weather.id >= 200 && weather.id <= 232) {
        return`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><defs><linearGradient id="a" x1="22.56" x2="39.2" y1="21.96" y2="50.8" gradientUnits="userSpaceOnUse"><stop offset="0" stop-color="#f3f7fe"/><stop offset=".45" stop-color="#f3f7fe"/><stop offset="1" stop-color="#deeafb"/></linearGradient><linearGradient id="b" x1="26.74" x2="35.76" y1="37.88" y2="53.52" gradientUnits="userSpaceOnUse"><stop offset="0" stop-color="#f7b23b"/><stop offset=".45" stop-color="#f7b23b"/><stop offset="1" stop-color="#f59e0b"/></linearGradient></defs><path fill="url(#a)" stroke="#e6effc" stroke-miterlimit="10" stroke-width=".5" d="M46.5 31.5h-.32a10.49 10.49 0 0 0-19.11-8 7 7 0 0 0-10.57 6 7.21 7.21 0 0 0 .1 1.14A7.5 7.5 0 0 0 18 45.5a4.19 4.19 0 0 0 .5 0h28a7 7 0 0 0 0-14z"/><path fill="url(#b)" stroke="#f6a823" stroke-miterlimit="10" stroke-width=".5" d="m30 36-4 12h4l-2 10 10-14h-6l4-8h-6z"><animate attributeName="opacity" dur="2s" repeatCount="indefinite" values="1; 1; 1; 1; 1; 1; 0.1; 1; 0.1; 1; 1; 0.1; 1; 0.1; 1"/></path></svg>`
    }else if(weather.id >= 300 && weather.id <= 321){
        return `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 64 64"><defs><linearGradient id="b" x1="22.56" x2="39.2" y1="21.96" y2="50.8" gradientUnits="userSpaceOnUse"><stop offset="0" stop-color="#f3f7fe"/><stop offset=".45" stop-color="#f3f7fe"/><stop offset="1" stop-color="#deeafb"/></linearGradient><linearGradient id="a" x1="23.31" x2="24.69" y1="44.3" y2="46.7" gradientUnits="userSpaceOnUse"><stop offset="0" stop-color="#4286ee"/><stop offset=".45" stop-color="#4286ee"/><stop offset="1" stop-color="#0950bc"/></linearGradient><linearGradient id="c" x1="30.31" x2="31.69" y1="44.3" y2="46.7" xlink:href="#a"/><linearGradient id="d" x1="37.31" x2="38.69" y1="44.3" y2="46.7" xlink:href="#a"/></defs><path fill="url(#b)" stroke="#e6effc" stroke-miterlimit="10" stroke-width=".5" d="M46.5 31.5h-.32a10.49 10.49 0 0 0-19.11-8 7 7 0 0 0-10.57 6 7.21 7.21 0 0 0 .1 1.14A7.5 7.5 0 0 0 18 45.5a4.19 4.19 0 0 0 .5 0h28a7 7 0 0 0 0-14z"/><path fill="none" stroke="url(#a)" stroke-linecap="round" stroke-miterlimit="10" stroke-width="2" d="m24.08 45.01-.16.98"><animateTransform attributeName="transform" dur="1.5s" repeatCount="indefinite" type="translate" values="1 -5; -2 10"/><animate attributeName="opacity" dur="1.5s" repeatCount="indefinite" values="0;1;1;0"/></path><path fill="none" stroke="url(#c)" stroke-linecap="round" stroke-miterlimit="10" stroke-width="2" d="m31.08 45.01-.16.98"><animateTransform attributeName="transform" begin="-0.5s" dur="1.5s" repeatCount="indefinite" type="translate" values="1 -5; -2 10"/><animate attributeName="opacity" begin="-0.5s" dur="1.5s" repeatCount="indefinite" values="0;1;1;0"/></path><path fill="none" stroke="url(#d)" stroke-linecap="round" stroke-miterlimit="10" stroke-width="2" d="m38.08 45.01-.16.98"><animateTransform attributeName="transform" begin="-1s" dur="1.5s" repeatCount="indefinite" type="translate" values="1 -5; -2 10"/><animate attributeName="opacity" begin="-1s" dur="1.5s" repeatCount="indefinite" values="0;1;1;0"/></path></svg>`
    }else if(weather.id >= 500 && weather.id <= 521){
        return `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 64 64"><defs><linearGradient id="b" x1="22.56" x2="39.2" y1="21.96" y2="50.8" gradientUnits="userSpaceOnUse"><stop offset="0" stop-color="#f3f7fe"/><stop offset=".45" stop-color="#f3f7fe"/><stop offset="1" stop-color="#deeafb"/></linearGradient><linearGradient id="a" x1="22.53" x2="25.47" y1="42.95" y2="48.05" gradientUnits="userSpaceOnUse"><stop offset="0" stop-color="#4286ee"/><stop offset=".45" stop-color="#4286ee"/><stop offset="1" stop-color="#0950bc"/></linearGradient><linearGradient id="c" x1="29.53" x2="32.47" y1="42.95" y2="48.05" xlink:href="#a"/><linearGradient id="d" x1="36.53" x2="39.47" y1="42.95" y2="48.05" xlink:href="#a"/></defs><path fill="url(#b)" stroke="#e6effc" stroke-miterlimit="10" stroke-width=".5" d="M46.5 31.5h-.32a10.49 10.49 0 0 0-19.11-8 7 7 0 0 0-10.57 6 7.21 7.21 0 0 0 .1 1.14A7.5 7.5 0 0 0 18 45.5a4.19 4.19 0 0 0 .5 0h28a7 7 0 0 0 0-14z"/><path fill="none" stroke="url(#a)" stroke-linecap="round" stroke-miterlimit="10" stroke-width="2" d="m24.39 43.03-.78 4.94"><animateTransform attributeName="transform" dur="0.7s" repeatCount="indefinite" type="translate" values="1 -5; -2 10"/><animate attributeName="opacity" dur="0.7s" repeatCount="indefinite" values="0;1;1;0"/></path><path fill="none" stroke="url(#c)" stroke-linecap="round" stroke-miterlimit="10" stroke-width="2" d="m31.39 43.03-.78 4.94"><animateTransform attributeName="transform" begin="-0.4s" dur="0.7s" repeatCount="indefinite" type="translate" values="1 -5; -2 10"/><animate attributeName="opacity" begin="-0.4s" dur="0.7s" repeatCount="indefinite" values="0;1;1;0"/></path><path fill="none" stroke="url(#d)" stroke-linecap="round" stroke-miterlimit="10" stroke-width="2" d="m38.39 43.03-.78 4.94"><animateTransform attributeName="transform" begin="-0.2s" dur="0.7s" repeatCount="indefinite" type="translate" values="1 -5; -2 10"/><animate attributeName="opacity" begin="-0.2s" dur="0.7s" repeatCount="indefinite" values="0;1;1;0"/></path></svg>`
    }else if(weather.id >= 600 && weather.id <= 622){
        return `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 64 64"><defs><linearGradient id="b" x1="22.56" x2="39.2" y1="21.96" y2="50.8" gradientUnits="userSpaceOnUse"><stop offset="0" stop-color="#f3f7fe"/><stop offset=".45" stop-color="#f3f7fe"/><stop offset="1" stop-color="#deeafb"/></linearGradient><linearGradient id="a" x1="22.66" x2="25.34" y1="42.68" y2="47.32" gradientUnits="userSpaceOnUse"><stop offset="0" stop-color="#86c3db"/><stop offset=".45" stop-color="#86c3db"/><stop offset="1" stop-color="#5eafcf"/></linearGradient><linearGradient id="c" x1="29.66" x2="32.34" y1="42.68" y2="47.32" xlink:href="#a"/><linearGradient id="d" x1="36.66" x2="39.34" y1="42.68" y2="47.32" xlink:href="#a"/></defs><path fill="url(#b)" stroke="#e6effc" stroke-miterlimit="10" stroke-width=".5" d="M46.5 31.5h-.32a10.49 10.49 0 0 0-19.11-8 7 7 0 0 0-10.57 6 7.21 7.21 0 0 0 .1 1.14A7.5 7.5 0 0 0 18 45.5a4.19 4.19 0 0 0 .5 0h28a7 7 0 0 0 0-14z"/><path fill="url(#a)" d="m26.45 45.82-.73-.41a1.59 1.59 0 0 0 0-.81l.73-.42a.49.49 0 0 0 .18-.68.51.51 0 0 0-.69-.18l-.72.41a1.66 1.66 0 0 0-.71-.41v-.82a.51.51 0 0 0-1 0v.83a1.74 1.74 0 0 0-.71.4l-.72-.41a.51.51 0 0 0-.69.18.49.49 0 0 0 .18.68l.73.41a1.59 1.59 0 0 0 0 .81l-.73.42a.49.49 0 0 0-.18.68.5.5 0 0 0 .44.25.47.47 0 0 0 .25-.07l.72-.41a2 2 0 0 0 .33.25 1.5 1.5 0 0 0 .38.15v.83a.51.51 0 0 0 1 0v-.83a1.74 1.74 0 0 0 .71-.4l.72.41a.47.47 0 0 0 .25.07.5.5 0 0 0 .44-.25.49.49 0 0 0-.18-.68zm-2.83-.17a.75.75 0 0 1 .38-1.4.75.75 0 0 1 .38.1.75.75 0 0 1 .28 1 .77.77 0 0 1-1.04.3z"><animateTransform additive="sum" attributeName="transform" begin="-2.7s" dur="4s" repeatCount="indefinite" type="translate" values="1 -6; -1 12"/><animateTransform additive="sum" attributeName="transform" begin="-2.7s" dur="4s" repeatCount="indefinite" type="rotate" values="-45 24 45; 45 24 45"/><animate attributeName="opacity" begin="-2.7s" dur="4s" repeatCount="indefinite" values="0;1;1;1;0"/></path><path fill="url(#c)" d="m33.45 45.82-.73-.41a1.59 1.59 0 0 0 0-.81l.73-.42a.49.49 0 0 0 .18-.68.51.51 0 0 0-.69-.18l-.72.41a1.66 1.66 0 0 0-.71-.41v-.82a.51.51 0 0 0-1 0v.83a1.74 1.74 0 0 0-.71.4l-.72-.41a.51.51 0 0 0-.69.18.49.49 0 0 0 .18.68l.73.41a1.59 1.59 0 0 0 0 .81l-.73.42a.49.49 0 0 0-.18.68.5.5 0 0 0 .44.25.47.47 0 0 0 .25-.07l.72-.41a2 2 0 0 0 .33.25 1.5 1.5 0 0 0 .38.15v.83a.51.51 0 0 0 1 0v-.83a1.74 1.74 0 0 0 .71-.4l.72.41a.47.47 0 0 0 .25.07.5.5 0 0 0 .44-.25.49.49 0 0 0-.18-.68zm-2.83-.17a.75.75 0 0 1 .38-1.4.75.75 0 0 1 .38.1.75.75 0 0 1 .28 1 .77.77 0 0 1-1.04.3z"><animateTransform additive="sum" attributeName="transform" dur="4s" repeatCount="indefinite" type="translate" values="-1 -6; 1 12"/><animateTransform additive="sum" attributeName="transform" dur="4s" repeatCount="indefinite" type="rotate" values="-45 31 45; 45 31 45"/><animate attributeName="opacity" dur="4s" repeatCount="indefinite" values="0;1;1;1;0"/></path><path fill="url(#d)" d="m40.45 45.82-.73-.41a1.59 1.59 0 0 0 0-.81l.73-.42a.49.49 0 0 0 .18-.68.51.51 0 0 0-.69-.18l-.72.41a1.66 1.66 0 0 0-.71-.41v-.82a.51.51 0 0 0-1 0v.83a1.74 1.74 0 0 0-.71.4l-.72-.41a.51.51 0 0 0-.69.18.49.49 0 0 0 .18.68l.73.41a1.59 1.59 0 0 0 0 .81l-.73.42a.49.49 0 0 0-.18.68.5.5 0 0 0 .44.25.47.47 0 0 0 .25-.07l.72-.41a2 2 0 0 0 .33.25 1.5 1.5 0 0 0 .38.15v.83a.51.51 0 0 0 1 0v-.83a1.74 1.74 0 0 0 .71-.4l.72.41a.47.47 0 0 0 .25.07.5.5 0 0 0 .44-.25.49.49 0 0 0-.18-.68zm-2.83-.17a.75.75 0 0 1 .38-1.4.75.75 0 0 1 .38.1.75.75 0 0 1 .28 1 .77.77 0 0 1-1.04.3z"><animateTransform additive="sum" attributeName="transform" begin="-1.3s" dur="4s" repeatCount="indefinite" type="translate" values="1 -6; -1 12"/><animateTransform additive="sum" attributeName="transform" begin="-1.3s" dur="4s" repeatCount="indefinite" type="rotate" values="-45 38 45; 45 38 45"/><animate attributeName="opacity" begin="-1.3s" dur="4s" repeatCount="indefinite" values="0;1;1;1;0"/></path></svg>`
    }else if(weather.id >= 701 && weather.id <= 781){
        return `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 64 64"><defs><clipPath id="b"><path fill="none" d="M0 7.5h64v32H0z"/></clipPath><linearGradient id="c" x1="26.75" x2="37.25" y1="29.91" y2="48.09" gradientUnits="userSpaceOnUse"><stop offset="0" stop-color="#fbbf24"/><stop offset=".45" stop-color="#fbbf24"/><stop offset="1" stop-color="#f59e0b"/></linearGradient><linearGradient id="a" x1="15.5" x2="48.5" y1="44" y2="44" gradientUnits="userSpaceOnUse"><stop offset="0" stop-color="#d4d7dd"/><stop offset=".45" stop-color="#d4d7dd"/><stop offset="1" stop-color="#bec1c6"/></linearGradient><linearGradient id="d" y1="51" y2="51" xlink:href="#a"/></defs><g stroke-miterlimit="10" clip-path="url(#b)"><circle cx="32" cy="39" r="10.5" fill="url(#c)" stroke="#f8af18" stroke-width=".5"/><path fill="none" stroke="#fbbf24" stroke-linecap="round" stroke-width="3" d="M32 22.71V16.5m0 45v-6.21m11.52-27.81 4.39-4.39M16.09 54.91l4.39-4.39m0-23-4.39-4.39m31.82 31.78-4.39-4.39M15.71 39H9.5m45 0h-6.21"><animateTransform attributeName="transform" dur="45s" repeatCount="indefinite" type="rotate" values="0 32 39; 360 32 39"/></path></g><path fill="none" stroke="url(#a)" stroke-linecap="round" stroke-miterlimit="10" stroke-width="3" d="M17 44h30"><animateTransform attributeName="transform" begin="0s" dur="5s" repeatCount="indefinite" type="translate" values="-4 0; 4 0; -4 0"/></path><path fill="none" stroke="url(#d)" stroke-linecap="round" stroke-miterlimit="10" stroke-width="3" d="M17 51h30"><animateTransform attributeName="transform" begin="-4s" dur="5s" repeatCount="indefinite" type="translate" values="-4 0; 4 0; -4 0"/></path></svg>`
    }else if(weather.id == 800){
        return`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><defs><linearGradient id="a" x1="26.75" x2="37.25" y1="22.91" y2="41.09" gradientUnits="userSpaceOnUse"><stop offset="0" stop-color="#fbbf24"/><stop offset=".45" stop-color="#fbbf24"/><stop offset="1" stop-color="#f59e0b"/></linearGradient></defs><circle cx="32" cy="32" r="10.5" fill="url(#a)" stroke="#f8af18" stroke-miterlimit="10" stroke-width=".5"/><path fill="none" stroke="#fbbf24" stroke-linecap="round" stroke-miterlimit="10" stroke-width="3" d="M32 15.71V9.5m0 45v-6.21m11.52-27.81 4.39-4.39M16.09 47.91l4.39-4.39m0-23-4.39-4.39m31.82 31.78-4.39-4.39M15.71 32H9.5m45 0h-6.21"><animateTransform attributeName="transform" dur="45s" repeatCount="indefinite" type="rotate" values="0 32 32; 360 32 32"/></path></svg>`
    }else if(weather.id >= 801 && weather.id <= 804){
        return`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><defs><linearGradient id="a" x1="22.56" x2="39.2" y1="21.96" y2="50.8" gradientUnits="userSpaceOnUse"><stop offset="0" stop-color="#f3f7fe"/><stop offset=".45" stop-color="#f3f7fe"/><stop offset="1" stop-color="#deeafb"/></linearGradient></defs><path fill="url(#a)" stroke="#e6effc" stroke-miterlimit="10" stroke-width=".5" d="M46.5 31.5h-.32a10.49 10.49 0 0 0-19.11-8 7 7 0 0 0-10.57 6 7.21 7.21 0 0 0 .1 1.14A7.5 7.5 0 0 0 18 45.5a4.19 4.19 0 0 0 .5 0h28a7 7 0 0 0 0-14z"><animateTransform attributeName="transform" dur="7s" repeatCount="indefinite" type="translate" values="-3 0; 3 0; -3 0"/></path></svg>`
    }
}
function _reset(){
    while(hourly_box.firstChild){
        hourly_box.removeChild(hourly_box.lastChild)
    }
    while(daily_box.firstChild){
        daily_box.removeChild(daily_box.lastChild)
    }
}