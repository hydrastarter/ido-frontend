 import React from "react";
import { Link } from "react-router-dom";



 function pageNotFound(){


    return(
        <>
          <div className="error-container notfound">
      <h1>404</h1>
      <p>Page Not Found</p>
      <p>Sorry, the page you are looking for might be in another castle.</p>
      <Link to="/">Go back to the home page</Link>
    </div>
        
        </>
    )

 }

 export default pageNotFound