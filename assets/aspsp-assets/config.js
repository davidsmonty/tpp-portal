const hostnameArray = window.location.hostname.split('.');
let subdomain = hostnameArray[0];
let version = 'v1';

if (subdomain === '') {
  subdomain = 'aliasdev';
}

if (subdomain.slice(subdomain.length - 3) === 'dev') version = 'dev';

var get_config = $.ajax({
  type: "GET",
  url: "https://system.tell.money/" + version + "/tpp/config/" + subdomain,
  async: false,
  headers: {
    "Content-Type": "application/json"
  }
}).done(function (result) {
});
const _config = get_config.responseJSON



/*var _config = {
  "subdomain": "alias",
  "client_name": "Alias Bank",
  "client_name_lower": "Alias Bank",
  "aisp": true,
  "pisp": true,
  "base_api_path": "https://system.tell.money/dev/",
  "swagger_file": "https://system.tell.money/dev/swagger/interface/example-bank-open-banking-api"
};
*/