const apiKey = "8240204737961b8798f59e1c6a648ee2";
const apiCountryURL = 'https://flagsapi.com/'

const cityInput = document.querySelector("#city-input")
const searchBtn = document.querySelector("#search")

const cityElement = document.querySelector("#city")
const tempElement = document.querySelector("#temperature span")
const descElement = document.querySelector("#description")
const weatherIconElement = document.querySelector("#weather-icon")
const countryElement = document.querySelector("#country")
const humidityElement = document.querySelector("#humidity span")
const windElement = document.querySelector("#wind span")
const weatherContainer = document.querySelector("#weather-data")
const errorMessageElement = document.querySelector("#error-message");
const container = document.querySelector(".container")
const body = document.body



// Functions
const getWeatherData = async (city) => {
    try {
        const apiWeatherURL = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apiKey}&lang=pt_br`;

        const res = await fetch(apiWeatherURL);

        if (!res.ok) {
            throw new Error(`Erro na requisição: ${res.status} - ${res.statusText}`);
        }
        
        const data = await res.json();
        return data;

    } catch (error) {
        console.error("Erro ao buscar dados do clima:", error.message);
        return null;
    }
};

const showWeatherData = async (city) => {
    
    errorMessageElement.innerText = "";
    
    const data = await getWeatherData(city);

    if (data === null) {
        errorMessageElement.innerText = "Cidade não encontrada!";
        weatherContainer.classList.add("hide");
        return;
    }

    const countryCode = data.sys.country;

    cityElement.innerText = data.name
    tempElement.innerText = parseInt(data.main.temp)
    descElement.innerText = data.weather[0].description
    weatherIconElement.setAttribute("src",
        `http://openweathermap.org/img/wn/${data.weather[0].icon}.png`)
    countryElement.setAttribute("src", `${apiCountryURL}${countryCode}/flat/64.png`);
    humidityElement.innerText = `${data.main.humidity}%`
    windElement.innerText = `${data.wind.speed}km/h`

    weatherContainer.classList.remove("hide")

    const periodo = determinarPeriodoDoDia(data);
    console.log("Período determinado:", periodo);
    aplicarEstilosFundo(periodo);
}

function determinarPeriodoDoDia(data){
    const timezoneOffset = data.timezone;
    const dataUTC = new Date((data.dt + timezoneOffset) * 1000);
    const hora = dataUTC.getUTCHours();

    console.log("Hora local ajustada:", hora);

    if (hora >= 5 && hora < 12) {
        console.log("Detectado: manhã");
        return "manha";
    } else if (hora >= 12 && hora < 17) {
        console.log("Detectado: tarde");
        return "tarde";
    } else if (hora >= 17 && hora < 20) {
        console.log("Detectado: entardecer");
        return "entardecer";
    } else {
        console.log("Detectado: noite");
        return "noite";
    }
}

function aplicarEstilosFundo(periodo) {
    console.log("Aplicando estilo para:", periodo);

    switch (periodo) {
        case "manha":
            console.log("Aplicando estilo de manhã");
            body.style.background = 'linear-gradient(to bottom, #ff9966 0%, #ff765f 30%, #7dc2ff 100%)';
            container.style.background = 'linear-gradient(135deg, #6a4c93 0%, #533d7a 100%)';
            searchBtn.style.background = "linear-gradient(135deg, #FFD700, #FFB347)";
            searchBtn.style.color = "#333";
            break;
        case "tarde":
            console.log("Aplicando estilo de tarde");
            body.style.background = 'linear-gradient(to bottom, #1a8cff 0%, #38b0de 50%, #87ceeb 100%)';
            container.style.background = 'linear-gradient(135deg, #4e4376 0%, #2b5876 100%)';
            searchBtn.style.background = "linear-gradient(135deg, #1E90FF, #00BFFF)";
            searchBtn.style.color = "white";
            break;
        case "entardecer":
            console.log("Aplicando estilo de entardecer");
            body.style.background = 'linear-gradient(to bottom, #e65c00, #F9D423)';
            container.style.background = 'linear-gradient(135deg, #6441A5, #2a0845)';
            searchBtn.style.background = "linear-gradient(135deg, #FF4500, #FF6347)";
            searchBtn.style.color = "white";
            break;
        case "noite":
            console.log("Aplicando estilo de noite");
            body.style.background = 'linear-gradient(to bottom, #0f2027 0%, #203a43 50%, #2c5364 100%)';
            container.style.background = 'linear-gradient(135deg, #4776e6 0%, #8e54e9 100%)';
            searchBtn.style.background = "linear-gradient(135deg, #6A5ACD, #483D8B)";
            searchBtn.style.color = "white";
            break;
        default:
            console.log("Período não reconhecido:", periodo);
            body.style.background = 'linear-gradient(to bottom, #1a8cff 0%, #38b0de 50%, #87ceeb 100%)';
            container.style.background = 'linear-gradient(135deg, #4e4376 0%, #2b5876 100%)';
            searchBtn.style.background = "linear-gradient(135deg, #ff7eb3, #ff758c)";
            searchBtn.style.color = "white";
    }
}

// Eventos
searchBtn.addEventListener("click", (e) => {

    e.preventDefault()

    const city = cityInput.value
    showWeatherData(city)
})

cityInput.addEventListener("keyup", (e) => {
    if(e.code === "Enter"){
        const city = e.target.value

        showWeatherData(city)
    }
})
