const monthAbbreviations = [
    'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
    'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
];
var date=new Date();
var selected_City="Baku"
window.onload=getCities()

function getCities() {
    axios
        .get("az.json")
        .then((res) => {
          setCities(res.data)
        })
        .catch((err) => console.log(err))
        .finally(() => {
            
        });

    axios
        .get(`https://api.weatherapi.com/v1/forecast.json?key=cb7565cfb0f74e86a0f155847221912&q=${selected_City}&days=7&aqi=no&alerts=no`)
        .then((res) => {
            setWeather(res.data,date.getHours())
        })
        .catch((err) => console.log(err))
}
function setCities(arr) {
    arr.forEach(element => {
        document.querySelector(".dropdown-menu").innerHTML+=
        `<li><a class="dropdown-item" href="#">${element.city}</a></li>`
    });
    document.querySelectorAll(".dropdown-item").forEach(e=>{
        e.addEventListener("click",(a)=>{
            selected_City=transliterateAzerbaijaniToEnglish(a.target.innerText)
            document.querySelector(".drp-dwn-btn").innerText=a.target.innerText
            axios
                .get(`https://api.weatherapi.com/v1/forecast.json?key=cb7565cfb0f74e86a0f155847221912&q=${selected_City}&days=7&aqi=no&alerts=no`)
                .then((res) => {
                    setWeather(res.data,date.getHours())
                })
                .catch((err) => console.log(err))
            
        })
    })
}

function transliterateAzerbaijaniToEnglish(azerbaijaniText) {
    const transliterationMap = {
      'ç': 'ch',
      'ə': 'e',
      'ğ': 'g',
      'ı': 'i',
      'ü': 'u',
      'ö': 'o',
      'ş': 'sh',
    };
  
    return azerbaijaniText
      .split('')
      .map(char => transliterationMap[char] || char)
      .join('');
}
function setWeather(obj,i=0) {
    console.log(obj)
    var hour_for_bg= new Date(obj.current.last_updated)
    var hour_for_bg= new Date("2023-09-17 20:15")
    console.log(hour_for_bg.getHours())
    if((hour_for_bg.getHours()>18 || hour_for_bg.getHours()<6)  || obj.current.condition.code>=1030){
        document.querySelector(".weather-container").classList.add("darkmode")
        document.querySelector(".weather-container").classList.remove("lightmode")
    }else{
        document.querySelector(".weather-container").classList.add("lightmode")
        document.querySelector(".weather-container").classList.remove("darkmode")
    }
    document.querySelector(".current-img").setAttribute("src",`${obj.current.condition.icon}`)
    document.querySelector(".current-degree").innerHTML=obj.current.temp_c+"º";
    document.querySelector(".max-degree").innerHTML=obj.forecast.forecastday[0].day.maxtemp_c+"º";
    document.querySelector(".min-degree").innerHTML=obj.forecast.forecastday[0].day.mintemp_c+"º";
    document.querySelector(".rain").innerHTML=obj.forecast.forecastday[0].day.daily_chance_of_rain+"%";
    document.querySelector(".humidity").innerHTML=obj.forecast.forecastday[0].day.avghumidity+"%";
    document.querySelector(".wind").innerHTML=obj.forecast.forecastday[0].day.maxwind_kph+"km/h"

    document.querySelector(".date").innerHTML=`${monthAbbreviations[date.getMonth()]},${date.getDate()}`
    let k=0
    var hour_temp=0;
    var hour_condition_img=""
    var hour=0;
    for(let j=1;j<5;j++){
        if(i<24){
            
            hour_temp=obj.forecast.forecastday[0].hour[i].temp_c
            hour_condition_img=obj.forecast.forecastday[0].hour[i].condition.icon
            hour=i
            i++
        }else{
            hour_temp=obj.forecast.forecastday[1].hour[k].temp_c
            hour_condition_img=obj.forecast.forecastday[1].hour[k].condition.icon
            hour=k
            k++;
        }
        document.querySelector(`.hour${j}-degree`).innerHTML=hour_temp+"ºC"
        document.querySelector(`.hourly-image${j}`).setAttribute("src",`${hour_condition_img}`)
        document.querySelector(`.hour${j}-time`).innerHTML=hour<10?"0"+hour+":00":hour+":00"
    }
    for(let m=1;m<3;m++){
        var d=new Date(obj.forecast.forecastday[m].date);
        var weekday=""
        switch (d.getDay()) {
            case 1:
                weekday="Monday";
                break;
            case 2:
                weekday="Tuesday";
                break;
            case 3:
                weekday="Wednesday";
                break;
            case 4:
                weekday="Thursday";
                break;        
            case 5:
                weekday="Friday";
                break;
            case 6:
                weekday="Saturday";
                break;        
            case 0:
                weekday="Sunday";
                break;
    
            default:
                break;
        }
        document.querySelector(`.day-of-week-${m}`).innerHTML=weekday
        document.querySelector(`.day-of-week-img-${m}`).setAttribute("src",`${obj.forecast.forecastday[m].day.condition.icon}`)
        document.querySelector(`.max-${m}`).innerHTML=obj.forecast.forecastday[m].day.maxtemp_c+"ºC";
        document.querySelector(`.min-${m}`).innerHTML=obj.forecast.forecastday[m].day.mintemp_c+"ºC";
    }
}