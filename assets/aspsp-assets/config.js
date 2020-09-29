var _config = {
  "subdomain": "alias",
  "client_name": "Alias Bank",
  "client_name_lower": "Alias Bank",
  "aisp": true,
  "pisp": true,
  "base_api_path": "https://system.tell.money/dev/",
  "swagger_file": "https://system.tell.money/dev/swagger/interface/example-bank-open-banking-api"
};
console.log(window.location.hostname);
const hostnameArray = window.location.hostname.split('.');
console.log(JSON.stringify(hostnameArray));