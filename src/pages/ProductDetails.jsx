import { useParams } from "react-router-dom";
import { useLanguage } from "../context/LanguageContext";
import products from "../data/products";
import {useBridalList}
from "../context/BridalListContext";

function ProductDetails() {
const {addToList}=useBridalList();
  const { id } = useParams();

  const { language } = useLanguage();


  const product = products.find(
    (item) => item.id === Number(id)
  );


  if (!product) {
    return (
      <div className="not-found">
        <h1>
          {language === "en"
            ? "Product Not Found"
            : "المنتج غير موجود"}
        </h1>
      </div>
    );
  }


  return (

    <main className="product-details-page">


      <div className="product-details-container">


        {/* Image */}

        <div className="product-details-image">

          <img
            src={product.image}
            alt={product.name[language]}
          />

        </div>



        {/* Info */}

        <div className="product-details-info">


          <h1>
            {product.name[language]}
          </h1>


          <p className="details-price">
            ${product.price}
          </p>



          <p className="details-description">

            {product.description[language]}

          </p>



          <div className="product-info-box">


            <p>
              <strong>
                {language === "en"
                  ? "Category:"
                  : "القسم:"}
              </strong>

              {" "}

              {product.category}

            </p>



            <p>

              <strong>
                {language === "en"
                  ? "Availability:"
                  : "التوفر:"}
              </strong>

              {" "}

              {product.available
                ? language === "en"
                  ? "Available"
                  : "متوفر"
                : language === "en"
                ? "Out of Stock"
                : "غير متوفر"}

            </p>


          </div>



          <button
className="add-list-button"
onClick={()=>addToList(product)}
>

💍

{language==="en"
?"Add to Bridal List"
:"أضيفي إلى قائمة العروس"}

</button>



        </div>


      </div>


    </main>

  );
}


export default ProductDetails;