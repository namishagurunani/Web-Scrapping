console.log("Web Scraper");

const axios = require("axios");
const cheerio = require("cheerio");
const xlsx = require("xlsx");

let products = [];

const getDataFromAmazon = async () => {
  try {
    const response = await axios.get(
      "https://www.croma.com/computers-tablets/laptops/windows-laptops/c/855",
      {
        headers: {
          "Content-Type": "text/html",
        },
      }
    );
    
    const $ = cheerio.load(response.data);
    
    $("li.product-item").each((index, element) => {
      const name = $(element).find("h3.product-title.plp-prod-title").text().trim();
      const price = $(element).find("span.amount.plp-srp-new-amount").text().trim();
      const oldPrice = $(element).find("span#old-price").text().trim();
      const discountValue = $(element).find("span.dicount-value").text().trim();
      const discountPercentage = $(element).find("span.discount.discount-mob-plp.discount-newsearch-plp").text().trim();
      products.push({ name, price, oldPrice, discountValue, discountPercentage });
    });

    console.log(products);

    const workbook = xlsx.utils.book_new();
    const workSheet = xlsx.utils.json_to_sheet(products);
    xlsx.utils.book_append_sheet(workbook, workSheet, "Sheet1");
    xlsx.writeFile(workbook, "output.xlsx");
  } catch (err) {
    console.log(err);
  }
};

getDataFromAmazon();
