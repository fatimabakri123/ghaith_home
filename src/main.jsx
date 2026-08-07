import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";
import { LanguageProvider } from "./context/LanguageContext";
import { BridalListProvider }
from "./context/BridalListContext";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>

 <LanguageProvider>

   <BridalListProvider>

      <App />

   </BridalListProvider>

 </LanguageProvider>

</React.StrictMode>
);