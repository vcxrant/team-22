
const axios = require("axios")
require("dotenv").config();
try {
  const secretKey: string = process.env.GITHUB1;
  console.log(secretKey);
} catch (e) {
  console.log(e);
}

const validateUrl = (url: string) => {
  if (
    /^(http(s):\/\/.)[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)$/g.test(
      url
    )
  ) {
    return true;
  } else {
    return false;
  }
};

const getRepoInfo = async (url: string) => {
  if (validateUrl(url)) {
    axios
      .get("https://api.coindesk.com/v1/bpi/currentprice.json")
      .then(function (response: any) {
        console.log(response.data);
      })
      .catch(function (error: any) {
        console.error(error);
      });
  } else {
    // error handling for failing the validation stage
  }
};

getRepoInfo("https://api.coindesk.com/v1/bpi/currentprice.json");
